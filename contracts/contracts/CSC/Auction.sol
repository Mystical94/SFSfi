// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

/*
   _                
  | |                ██████  █████  ███    ██ ████████  ██████  
 / __) ___ ___ _ __ ██      ██   ██ ████   ██    ██    ██    ██ 
 \__ \/ __/ __| '__|██      ███████ ██ ██  ██    ██    ██    ██ 
 (   / (__\__ \ |   ██      ██   ██ ██  ██ ██    ██    ██    ██ 
  |_| \___|___/_|    ██████ ██   ██ ██   ████    ██     ██████  
*/

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../interfaces/IEsManager.sol";
import "../interfaces/ITurnstile.sol";

contract Auction is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct UserInfo {
        uint256 allocation; // amount taken into account to obtain TOKEN (amount spent + discount)
        uint256 contribution; // amount spent to buy TOKEN
        bool hasClaimed; // has already claimed its allocation
    }

    IERC20 public immutable PROJECT_TOKEN; // Project token contract
    IERC20 public immutable SALE_TOKEN; // token used to participate

    uint256 public immutable START_TIME; // sale start time
    uint256 public immutable END_TIME; // sale end time

    address public TURNSTILE;

    mapping(address => UserInfo) public userInfo; // buyers and referrers info
    uint256 public totalRaised; // raised amount
    uint256 public totalAllocation;

    address public immutable treasury; // treasury multisig, will receive raised amount

    bool public unsoldTokensDealt;

    constructor(
        IERC20 projectToken,
        IERC20 saleToken,
        uint256 startTime,
        uint256 endTime,
        address treasury_,
        address turnstile,
        uint256 csrNftId
    ) {
        require(startTime < endTime, "invalid dates");
        require(treasury_ != address(0), "invalid treasury");

        PROJECT_TOKEN = projectToken;
        SALE_TOKEN = saleToken;
        START_TIME = startTime;
        END_TIME = endTime;
        TURNSTILE = turnstile;
        treasury = treasury_;
        ITurnstile(turnstile).assign(csrNftId);
    }

    /********************************************/
    /****************** EVENTS ******************/
    /********************************************/

    event Buy(address indexed user, uint256 amount);
    event Claim(address indexed user, uint256 amount);
    event EmergencyWithdraw(address token, uint256 amount);

    /***********************************************/
    /****************** MODIFIERS ******************/
    /***********************************************/

    /**
     * @dev Check whether the sale is currently active
     *
     * Will be marked as inactive if PROJECT_TOKEN has not been deposited into the contract
     */
    modifier isSaleActive() {
        require(hasStarted() && !hasEnded(), "isActive: sale is not active");
        _;
    }

    /**************************************************/
    /****************** PUBLIC VIEWS ******************/
    /**************************************************/

    /**
     * @dev Get remaining duration before the end of the sale
     */
    function getRemainingTime() external view returns (uint256) {
        if (hasEnded()) return 0;
        return END_TIME.sub(_currentBlockTimestamp());
    }

    /**
     * @dev Returns whether the sale has already started
     */
    function hasStarted() public view returns (bool) {
        return _currentBlockTimestamp() >= START_TIME;
    }

    /**
     * @dev Returns whether the sale has already ended
     */
    function hasEnded() public view returns (bool) {
        return END_TIME <= _currentBlockTimestamp();
    }

    /**
     * @dev Returns the price of PROJECT_TOKEN
     */
    function price() public view returns (uint256) {
        if (totalRaised < 37_500 ether) {
            // 0.05 NOTE
            return 50000000000000000;
        }
        return totalRaised.div(750_000);
    }

    function getExpectedClaimAmount(
        address account
    ) public view returns (uint256) {
        if (totalAllocation == 0) return 0;

        UserInfo memory user = userInfo[account];
        return price().mul(user.allocation).div(1e18);
    }

    /****************************************************************/
    /****************** EXTERNAL PUBLIC FUNCTIONS  ******************/
    /****************************************************************/

    /**
     * @dev Purchase an allocation for the sale for a value of "amount" SALE_TOKEN
     */
    function buy(uint256 amount) external isSaleActive nonReentrant {
        require(amount > 0, "buy: zero amount");

        UserInfo storage user = userInfo[msg.sender];

        // update raised amounts
        user.contribution = user.contribution.add(amount);
        totalRaised = totalRaised.add(amount);

        // update allocations
        user.allocation = user.allocation.add(amount);
        totalAllocation = totalAllocation.add(amount);

        emit Buy(msg.sender, amount);

        // transfer contribution to treasury
        SALE_TOKEN.safeTransferFrom(msg.sender, treasury, amount);
    }

    /**
     * @dev Claim purchased PROJECT_TOKEN during the sale
     */
    function claim() external {
        require(hasEnded(), "isClaimable: sale has not ended");
        UserInfo storage user = userInfo[msg.sender];

        require(
            totalAllocation > 0 && user.allocation > 0,
            "claim: zero allocation"
        );
        require(!user.hasClaimed, "claim: already claimed");
        user.hasClaimed = true;

        uint256 amount = getExpectedClaimAmount(msg.sender);

        emit Claim(msg.sender, amount);

        // send PROJECT_TOKEN allocation
        _safeClaimTransfer(msg.sender, amount);
    }

    /********************************************************/
    /****************** /!\ EMERGENCY ONLY ******************/
    /********************************************************/

    /**
     * @dev Failsafe
     */
    function emergencyWithdrawFunds(
        address token,
        uint256 amount
    ) external onlyOwner {
        IERC20(token).safeTransfer(msg.sender, amount);

        emit EmergencyWithdraw(token, amount);
    }

    /**
     * @dev Return unsold PROJECT_TOKEN if MIN_TOTAL_RAISED_FOR_MAX_PROJECT_TOKEN has not been reached
     *
     * Must only be called by the owner
     */
    function returnUnsoldTokens(uint256 amount) external onlyOwner {
        require(hasEnded(), "returnUnsoldTokens: presale has not ended");
        require(!unsoldTokensDealt, "returnUnsoldTokens: already burnt");
        unsoldTokensDealt = true;
        PROJECT_TOKEN.transfer(treasury, amount);
    }

    /********************************************************/
    /****************** INTERNAL FUNCTIONS ******************/
    /********************************************************/

    /**
     * @dev Safe token transfer function, in case rounding error causes contract to not have enough tokens
     */
    function _safeClaimTransfer(address to, uint256 amount) internal {
        uint256 balance = PROJECT_TOKEN.balanceOf(address(this));
        bool transferSuccess = false;

        if (amount > balance) {
            transferSuccess = PROJECT_TOKEN.transfer(to, balance);
        } else {
            transferSuccess = PROJECT_TOKEN.transfer(to, amount);
        }

        require(transferSuccess, "safeClaimTransfer: Transfer failed");
    }

    /**
     * @dev Utility function to get the current block timestamp
     */
    function _currentBlockTimestamp() internal view virtual returns (uint256) {
        return block.timestamp;
    }
}
