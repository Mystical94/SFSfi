// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "contracts/CsrCanto/CsrCanto.sol";

contract DeployCsrCanto is Script {
    address turnstile = 0xEcf044C5B4b867CFda001101c617eCd347095B44;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_KEY");
        vm.startBroadcast(deployerPrivateKey);

        new CsrCanto(turnstile);

        vm.stopBroadcast();
    }
}