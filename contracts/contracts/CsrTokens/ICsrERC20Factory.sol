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

interface ICsrERC20Factory {
    /// @notice Create a CSR enabled wrapped ERC20 token of an existing ERC20 token.
    /// @dev    The caller of this function will become the admin of the CSR ERC20 token.
    /// @param  erc20       The ERC20 token contract address.
    /// @return csrERC20    The contract address of the newly created csrERC token contract.
    function create(address payable erc20) external returns (address csrERC20);

    /// @notice Verify if a contract address is a CSR enabled ERC20 token created
    ///         by this factory contract.
    /// @param  addr        The contract address to be verified.
    /// @return result      True if the contract address is a CSR enabled ERC20 token.
    function isCsrERC20(address addr) external view returns (bool result);

    /// @notice Get CSR enabled ERC20 token addrress of ERC20 token.
    /// @param  erc20       The contract address of the ERC20 token.
    /// @return csrERC20    The CSR enabled ERC20 token contract address. Return address(0) if the given
    ///                     contract address has not a CSR enabled ERC20 token.
    function getCsrERC20(
        address erc20
    ) external view returns (address csrERC20);

    /// @notice Get the ERC20 token address of a CSR enabled ERC20 token.
    /// @param  csrERC20    The contract address of the CSR enabled ERC20 token.
    /// @return erc20       The ERC20 token contract address. Return address(0) if the given
    ///                     contract address is not a CSR enabled ERC20 token.
    function getERC20(address csrERC20) external view returns (address erc20);

    /// @notice Get the number of CSR enabled ERC20 tokens created by this factory contract.
    /// @return count       The number of CSR enabled ERC20 tokens created by this factory contract.
    function getTokenPairsCount() external view returns (uint256 count);

    /// @notice Get the ERC20 token address and CSR enabled ERC20 token address by tokens pair id.
    /// @param  i           The index of the CSR enabled ERC20 token.
    /// @return erc20       The ERC20 token contract address.
    /// @return csrERC20    The CSR enabled ERC20 token contract address.
    function getTokenPairById(
        uint256 i
    ) external view returns (address erc20, address csrERC20);

    /// @notice Get the address of the CSC stakers contract.
    /// @return cscStakers  The address of the CSC stakers contract.
    function getCSCstakersAddress() external view returns (address cscStakers);

    /// @notice Special function callable only by the factory contract which
    ///         pull and distribute the CSR among token holders. The purpose
    ///         of this function is to ensure the CSR gets pulled frequently
    ///         out of the box while maintaining low running cost for the team.
    /// @dev    Pull the CSR, refund `msg.sender` the gas cost for calling this
    ///         function and distribute the rest among token holders.
    ///         If the gas cost is higher than the amount of the CSR available,
    ///         `msg.sender` will not be refunded and the full CSR amount will be
    ///         distributed.
    ///         To prevent gas price manipulation, this function is callable only
    ///         by the wallet of the team, it's sole purpose is to assure frequent
    ///         CSR distribution when no one actively call the public
    ///         `pullFundsFromTurnstile` function of the `csrERC20` token.
    /// @param  csrERC20    The CSR enabled ERC20 token contract address.
    function pullFundsFromTurnstile(address csrERC20) external;

    /*=======================================
    =                onlyOwner              =
    =======================================*/

    /// @notice Original function from Ownable.sol by OpenZeppelin.
    /// @dev    This make the doc more explicit to have this func here.
    /// @param  newOwner    The new owner address
    function transferOwnership(address newOwner) external;

    /// @notice Set the address allowed to pull the CSR with gas cost refunds.
    /// @dev    Set the address allowed to call the `pullFundsFromTurnstile`
    ///         function.
    /// @param  newCron        The cron wallet address
    function setCron(address newCron) external;

    /// @notice Set the address of the CSC stakers contract.
    /// @param  newCscStakers    The new address of the CSC stakers contract.
    function setCscStakers(address newCscStakers) external;

    /* CSR wrapped ERC20 tokens management */
    function addClaimer(
        address claimer,
        address payee,
        address csrERC20
    ) external;

    function delClaimer(address claimer, address csrERC20) external;

    function setAdmin(address admin, address csrERC20) external;
}
