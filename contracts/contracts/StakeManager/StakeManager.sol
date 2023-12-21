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

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {CSC} from "../CSC/CSC.sol";
import {StakingCSCRewards} from "../CSC/StakingCSCRewards.sol";

struct VestingPayout {
    uint256 stakedBalance;
    uint256 amount;
    // timestamp when the vesting was initiated
    uint256 timestamp;
}

contract StakeManager is Ownable, ReentrancyGuard {
    uint256 public constant unstakingPeriodCSC = 21 days;
    uint256 public constant unstakingPeriodLP = 14 days;
    uint256 public constant initialFee = 50;
    uint256 private lastDeployed = 0;
    CSC private csc;

    address[] public whitelistedContracts;
    uint256 internal totalSupply;
    mapping(address => uint256) public stakes;
    mapping(address => VestingPayout) public payouts;

    event NewStakingContract(address);

    constructor(address _csc) {
        csc = CSC(_csc);
    }

    function deployStakingContract() public nonReentrant returns (address) {
        require(lastDeployed + 30 days < block.timestamp, "too early");
        StakingCSCRewards stakingContract = new StakingCSCRewards(
            owner(),
            address(csc),
            address(this)
        );
        address[] storage addresses = whitelistedContracts;
        addresses.push(address(stakingContract));
        whitelistedContracts = addresses;
        emit NewStakingContract(address(stakingContract));
        lastDeployed = block.timestamp;
        csc.transfer(msg.sender, 50 ether);
        return address(stakingContract);
    }

    function getWhitelistedContracts() public view returns (address[] memory) {
        return whitelistedContracts;
    }

    function setWhiteListedContracts(
        address[] memory _whitelistedContracts
    ) public onlyOwner {
        whitelistedContracts = _whitelistedContracts;
    }

    function getTotalSupply() public view returns (uint256) {
        return totalSupply;
    }

    function setTotalSupply(
        uint newTotalSupply
    ) public onlyWhitelistedContracts {
        totalSupply = newTotalSupply;
    }

    function getUserStake(address adr) public view returns (uint256) {
        return stakes[adr];
    }

    function getUserPaypout(
        address adr
    ) public view returns (VestingPayout memory) {
        return payouts[adr];
    }

    function setUserStaking(
        address adr,
        uint256 balance
    ) public onlyWhitelistedContracts {
        stakes[adr] = balance;
    }

    function setUserVestingPayout(
        address adr,
        uint256 stakedBalance,
        uint256 reawrds
    ) public onlyWhitelistedContracts {
        payouts[adr] = VestingPayout(stakedBalance, reawrds, block.timestamp);
    }

    function transfer(
        address token,
        address adr,
        uint256 amount
    ) external nonReentrant onlyWhitelistedContracts {
        ERC20(token).transfer(adr, amount);
    }

    function calculatePenaltyAmount(
        uint256 _stakeDuration,
        uint256 _stakeAmount,
        bool isLPContract
    ) public pure returns (uint256 penaltyAmount) {
        uint256 howManyDays = isLPContract
            ? unstakingPeriodLP
            : unstakingPeriodCSC;
        if (_stakeDuration >= howManyDays) {
            return 0;
        }
        uint256 remainingDays = howManyDays - _stakeDuration;
        uint256 fee = (initialFee * remainingDays) / howManyDays;
        uint256 feeAmount = (_stakeAmount * fee) / 100;
        return feeAmount;
    }

    modifier onlyWhitelistedContracts() {
        bool isIncluded = false;
        address[] memory addresses = getWhitelistedContracts();
        for (uint i = 0; i < addresses.length; i++) {
            if (addresses[i] == msg.sender) {
                isIncluded = true;
                break;
            }
        }
        require(isIncluded, "address not inlcuded");
        _;
    }
}
