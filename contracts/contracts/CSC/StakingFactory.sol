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

import {StakingCSCRewards} from "./StakingCSCRewards.sol";
import {StakeManager} from "../StakeManager/StakeManager.sol";
import {CSC} from "./CSC.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingFactory is Ownable, ReentrancyGuard {
    uint256 private lastDeployed = 0;
    CSC private csc;
    StakeManager private stakeManager;
    address[] private stakingRewardsContracts;

    event NewStakingContract(address);

    constructor(address _csc, address _stakeManager) {
        csc = CSC(_csc);
        stakeManager = StakeManager(_stakeManager);
    }

    function getStakingRewardsContract()
        public
        view
        returns (address[] memory)
    {
        return stakingRewardsContracts;
    }

    function deployStakingContract() public nonReentrant {
        require(lastDeployed + 30 days < block.timestamp, "too early");
        StakingCSCRewards stakingContract = new StakingCSCRewards(
            owner(),
            address(csc),
            address(stakeManager)
        );
        stakingRewardsContracts.push(address(stakingContract));
        address[] memory addresses = stakeManager.getWhitelistedContracts();
        stakeManager.setWhiteListedContracts(addresses);
        emit NewStakingContract(address(stakingContract));
        lastDeployed = block.timestamp;
        csc.transfer(msg.sender, 50 ether);
    }

    function transferStakeManagerOwnership(
        address newOwner
    ) external onlyOwner {
        stakeManager.transferOwnership(newOwner);
    }
}
