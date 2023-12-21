// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

/*
   _                
  | |                ██████  █████  ███    ██ ████████  ██████  
 / __) ___ ___ _ __ ██      ██   ██ ████   ██    ██    ██    ██ 
 \__ \/ __/ __| '__|██      ███████ ██ ██  ██    ██    ██    ██ 
 (   / (__\__ \ |   ██      ██   ██ ██  ██ ██    ██    ██    ██ 
  |_| \___|___/_|    ██████ ██   ██ ██   ████    ██     ██████  
*/

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../StakeManager/StakeManager.sol";
import "./CSC.sol";

contract StakingCSCRewards is ReentrancyGuard, Pausable, Ownable {
    using SafeMath for uint256;

    uint256 private constant COLLATERAL_RELEASE_DELAY = 21 days; // Collateral release delay in seconds

    /* ========== STATE VARIABLES ========== */

    CSC public rewardsAndStakingToken;
    StakeManager stakeManager;
    uint256 public periodFinish = 0;
    uint256 public rewardRate = 0;
    // Total amount of time per period
    uint256 public rewardsDuration = 30 days;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    /* ========== CONSTRUCTOR ========== */

    constructor(
        address _owner,
        address _rewardsAndStakingToken,
        address _stakeManager
    ) Ownable() {
        transferOwnership(_owner);
        rewardsAndStakingToken = CSC(_rewardsAndStakingToken);
        stakeManager = StakeManager(_stakeManager);
    }

    /* ========== VIEWS ========== */

    function totalSupply() external view returns (uint256) {
        return stakeManager.getTotalSupply();
    }

    function balanceOf(address account) external view returns (uint256) {
        return stakeManager.getUserStake(account);
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    // how much reward a single staked token should earn
    function rewardPerToken() public view returns (uint256) {
        if (stakeManager.getTotalSupply() == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored.add(
                (lastTimeRewardApplicable() - lastUpdateTime)
                    .mul(rewardRate)
                    .mul(1e18)
                    .div(stakeManager.getTotalSupply())
            );
    }

    function earned(address account) public view returns (uint256) {
        return
            stakeManager
                .getUserStake(account)
                .mul(rewardPerToken().sub(userRewardPerTokenPaid[account]))
                .div(1e18)
                .add(rewards[account]);
    }

    function getRewardForDuration() external view returns (uint256) {
        return rewardRate.mul(rewardsDuration);
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    function stake(
        uint256 amount
    ) external nonReentrant whenNotPaused updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        stakeManager.setTotalSupply(stakeManager.getTotalSupply().add(amount));
        stakeManager.setUserStaking(
            msg.sender,
            stakeManager.getUserStake(msg.sender) + amount
        );
        rewardsAndStakingToken.transferFrom(
            msg.sender,
            address(stakeManager),
            amount
        );
        emit Staked(msg.sender, amount);
    }

    function withdraw() public nonReentrant updateReward(msg.sender) {
        uint256 userStake = stakeManager.getUserStake(msg.sender);

        stakeManager.setTotalSupply(
            stakeManager.getTotalSupply().sub(userStake)
        );
        stakeManager.setUserVestingPayout(
            msg.sender,
            userStake,
            rewards[msg.sender]
        );
        rewards[msg.sender] = 0;
        stakeManager.setUserStaking(msg.sender, 0);
        emit Withdrawn(msg.sender, userStake);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 userStake = stakeManager.getUserStake(msg.sender);

        require(userStake == 0, "can only claim reward if unstaked");
        // Calculate the stake duration
        VestingPayout memory userPayout = stakeManager.getUserPaypout(
            msg.sender
        );
        uint256 stakeDuration = block.timestamp - userPayout.timestamp;
        uint256 totalAmount = userPayout.stakedBalance + userPayout.amount;
        stakeManager.transfer(
            address(rewardsAndStakingToken),
            address(this),
            userPayout.stakedBalance
        );
        if (stakeDuration >= COLLATERAL_RELEASE_DELAY) {
            stakeManager.setUserVestingPayout(msg.sender, 0, 0);
            rewardsAndStakingToken.transfer(msg.sender, totalAmount);
            emit RewardPaid(msg.sender, totalAmount);
        } else {
            // Calculate the penalty amount based on the stake duration
            uint256 penaltyAmount = stakeManager.calculatePenaltyAmount(
                stakeDuration,
                totalAmount,
                false
            );
            uint256 rewardPayout = totalAmount - penaltyAmount;
            rewardsAndStakingToken.transfer(address(1), penaltyAmount);
            rewardsAndStakingToken.transfer(msg.sender, rewardPayout);
            emit RewardPaid(msg.sender, rewardPayout);
        }
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    function notifyRewardAmount(
        uint256 reward
    ) external onlyOwner updateReward(address(0)) {
        if (block.timestamp >= periodFinish) {
            rewardRate = reward.div(rewardsDuration);
        } else {
            uint256 remaining = periodFinish.sub(block.timestamp);
            uint256 leftover = remaining.mul(rewardRate);
            rewardRate = reward.add(leftover).div(rewardsDuration);
        }

        // Ensure the provided reward amount is not more than the balance in the contract.
        // This keeps the reward rate in the right range, preventing overflows due to
        // very high values of rewardRate in the earned and rewardsPerToken functions;
        // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
        uint balance = rewardsAndStakingToken.balanceOf(address(this));
        require(
            rewardRate <= balance.div(rewardsDuration),
            "Provided reward too high"
        );

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp.add(rewardsDuration);
        emit RewardAdded(reward);
    }

    function recoverERC20(
        address tokenAddress,
        uint256 tokenAmount
    ) external onlyOwner {
        ERC20(tokenAddress).transfer(owner(), tokenAmount);
        emit Recovered(tokenAddress, tokenAmount);
    }

    function setRewardsDuration(uint256 _rewardsDuration) external onlyOwner {
        require(
            block.timestamp > periodFinish,
            "Previous rewards period must be complete before changing the duration for the new period"
        );
        rewardsDuration = _rewardsDuration;
        emit RewardsDurationUpdated(rewardsDuration);
    }

    function pauseContract() external onlyOwner {
        _pause();
    }

    function unpauseContract() external onlyOwner {
        _unpause();
    }

    /* ========== MODIFIERS ========== */

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    /* ========== EVENTS ========== */

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardsDurationUpdated(uint256 newDuration);
    event Recovered(address token, uint256 amount);
}
