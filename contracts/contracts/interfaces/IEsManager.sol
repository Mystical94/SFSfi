// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
pragma abicoder v2;

interface IEsManager {
    function balanceOf(address account) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
}
