// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

/*
   _             __     __           _______    _              
  | |            \ \   / /          |__   __|  | |             
 / __) ___ ___ _ _\ \_/ /__  _   _ _ __| | ___ | | _____ _ __  
 \__ \/ __/ __| '__\   / _ \| | | | '__| |/ _ \| |/ / _ \ '_ \ 
 (   / (__\__ \ |   | | (_) | |_| | |  | | (_) |   <  __/ | | |
  |_| \___|___/_|   |_|\___/ \__,_|_|  |_|\___/|_|\_\___|_| |_|

by $csrCANTO team                                                               
*/

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICsrERC20 is IERC20 {
    /*=======================================
    =           wrapper functions           =
    =======================================*/

    /// @notice Wrap `amount` ERC20 to csrERC20.Requires approval for spending allowance by this contract.
    /// @dev    Call super.depositFor(msg.sender, amount) from ERC20Wrapper: Allow a user to deposit underlying
    ///         tokens and mint the corresponding number of wrapped tokens.
    /// @param  amount  The amount of underlying ERC20 token to wrap.
    /// @return success True if the operation was successful.
    function deposit(uint256 amount) external returns (bool success);

    /// @notice Unwrap `amount` csrERC20 to ERC20.
    /// @dev    Call super.withdrawTo(msg.sender, amount) from ERC20Wrapper: Allow a user to burn a number of
    ///         wrapped tokens and withdraw the corresponding number of underlying tokens.
    /// @param  amount  The amount of underlying csrERC20 token to unwrap.
    /// @return success True if the operation was successful.
    function withdraw(uint256 amount) external returns (bool success);

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

    /// @notice Withdraw the CSR funds claimed internally at user's csrERC20 balance change
    /// @dev    Withdraw the available funds, reset user states related to their funds
    ///         and burn the csrERC20 amount equivalent
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

    /// @notice Special function callable only by the factory contract which
    ///         pull and distribute the CSR among token holders. The purpose
    ///         of this function is to ensure the CSR gets pulled frequently
    ///         out of the box while maintaining low running cost for the team.
    /// @dev    Pull the CSR, refund `msg.sender` the gas cost for calling this
    ///         function and distribute the rest among token holders.
    ///         If the gas cost is higher than the amount of the CSR available,
    ///         `msg.sender` will not be refunded and the full CSR amount will be
    ///         distributed.
    function pullFundsFromTurnstileWithGasRefund() external;

    /*=======================================
    =            ADMIN FUNCTIONS            =
    =======================================*/
    function setAdmin(address addr) external;

    function addClaimer(address addr, address payee) external;

    function delClaimer(address addr) external;
}
