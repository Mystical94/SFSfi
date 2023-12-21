// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "forge-std/Test.sol";
import "contracts/csrTokens/CsrERC20Factory.sol";

contract DeployCsrCanto is Script, Test {
    address turnstile = 0xEcf044C5B4b867CFda001101c617eCd347095B44;
    address csrCANTO = 0xbe1Be54f6251109d5fB2532b85d7eE9Cb375C43f;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_KEY");
        emit log_named_address("Deploying contract with" , vm.addr(deployerPrivateKey));
        vm.startBroadcast(deployerPrivateKey);

        new CsrERC20Factory(
            turnstile,
            csrCANTO,
            vm.addr(deployerPrivateKey) // csc_stakers address
        );

        vm.stopBroadcast();
    }
}