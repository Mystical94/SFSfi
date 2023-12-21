// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

/*
   _                 _____          _   _ _______ ____  
  | |               / ____|   /\   | \ | |__   __/ __ \ 
 / __) ___ ___ _ __| |       /  \  |  \| |  | | | |  | |
 \__ \/ __/ __| '__| |      / /\ \ | . ` |  | | | |  | |
 (   / (__\__ \ |  | |____ / ____ \| |\  |  | | | |__| |
  |_| \___|___/_|   \_____/_/    \_\_| \_|  |_|  \____/ 

The final version.
*/

interface ICsrCanto {
    /*=======================================
    =             WETH functions            =
    =======================================*/

    /// @notice Wrap CANTO into csrCANTO
    /// @dev    Deposit CANTO and mint $csrCANTO, then claim the funds pulled from the turnstile
    function deposit() external payable;

    /// @notice Unwrap csrCANTO to CANTO
    /// @dev    Withdraw CANTO and burn csrCANTO
    /// @param  amount The amount of csrCANTO to withdraw
    function withdraw(uint256 amount) external;

    /*=======================================
    =      CSR distribution functions       =
    =======================================*/

    /// @notice Register to be able to claim Turnstile revenue (EOA only)
    /// @dev    Update the claimersTotalSupply state used to calculate the unprocessed
    ///         funds pull from the Turnstile contract (CSR)
    function register() external;

    /// @notice Check if an address is registered as a claimer
    /// @param  addr    The address to check
    /// @return result  True if the address is registered as a claimer, false otherwise
    function isClaimer(address addr) external view returns (bool result);

    /// @notice Withdraw the CSR funds claimed internally at user's $csrCANTO balance change
    /// @dev    Withdraw the available funds, reset user states related to their funds
    ///         and burn the $csrCANTO equivalent
    function withdrawClaimed() external;

    /// @notice Get the amount of claimed funds available for withdrawal for a given
    ///         account
    /// @dev    The amount of claimed funds available is calculated from the CSR
    ///         that has been received by the contract
    /// @param  _forAddress     The address to check
    /// @return amount          The amount of claimed funds available for withdrawal by `_forAddress`
    function availableFunds(
        address _forAddress
    ) external view returns (uint256 amount);

    /// @notice Pull and distribute the CSR among token holders
    /// @dev    Pull CANTO from the turnstile contract and register the funds by
    ///         incrementing the receivedFunds state
    function pullFundsFromTurnstile() external;

    /*=======================================
    =            ADMIN FUNCTIONS            =
    =======================================*/
    function setAdmin(address addr) external;

    function addClaimer(address addr, address payee) external;

    function delClaimer(address addr) external;
}
