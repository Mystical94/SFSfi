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

interface ITurnstile {
    function register(address) external returns (uint256);

    function getTokenId(address _smartContract) external view returns (uint256);

    function withdraw(
        uint256 _tokenId,
        address _recipient,
        uint256 _amount
    ) external returns (uint256);

    function balances(uint256 _tokenId) external view returns (uint256);

    function assign(uint256) external;
}
