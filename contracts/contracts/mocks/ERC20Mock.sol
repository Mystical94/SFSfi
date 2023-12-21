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

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {}

    function mint(address account, uint amount) public {
        _mint(account, amount);
    }
}
