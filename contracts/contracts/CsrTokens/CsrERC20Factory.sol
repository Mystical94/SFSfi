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

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../mocks/canto/ICanto_Turnstile.sol";
import "../CsrCanto/CsrCanto.sol";
import "./CsrERC20.sol";
import "./ICsrERC20Factory.sol";

contract CsrERC20Factory is ICsrERC20Factory, Ownable {
    ICanto_Turnstile immutable turnstile;
    address public cron;
    address public csc_stakers;

    struct TokenPair {
        address erc20;
        address csrErc20;
    }

    TokenPair[] public tokenPairs;
    mapping(address => bool) public hasBeenCreated;

    event Created(address indexed erc20, address indexed csrERC20);

    constructor(
        address turnstileAddr,
        address csrCANTOaddr,
        address _csc_stakers
    ) {
        turnstile = ICanto_Turnstile(turnstileAddr);
        uint256 turnstileTokenId = turnstile.getTokenId(address(csrCANTOaddr));
        turnstile.assign(turnstileTokenId);
        cron = owner();
        csc_stakers = _csc_stakers;
    }

    /// @notice Create a CSR enabled wrapped ERC20 token of an existing ERC20 token.
    /// @dev    The caller of this function will become the admin of the CSR ERC20 token.
    /// @param  erc20       The ERC20 token contract address.
    /// @return csrERC20    The contract address of the newly created csrERC token contract.
    function create(address payable erc20) public returns (address) {
        require(!hasBeenCreated[erc20], "CsrERC20Factory: already created");

        address csrERC20 = address(
            new CsrERC20(ERC20(erc20), address(turnstile), address(this))
        );

        tokenPairs.push(TokenPair(erc20, csrERC20));
        hasBeenCreated[erc20] = true;

        emit Created(erc20, csrERC20);

        return csrERC20;
    }

    /// @notice Verify if a contract address is a CSR enabled ERC20 token created
    ///         by this factory contract.
    /// @param  addr        The contract address to be verified.
    /// @return result      True if the contract address is a CSR enabled ERC20 token.
    function isCsrERC20(address addr) public view returns (bool result) {
        for (uint256 i = 0; i < tokenPairs.length; i++) {
            if (tokenPairs[i].csrErc20 == addr) {
                return true;
            }
        }
        return false;
    }

    /// @notice Get CSR enabled ERC20 token addrress of ERC20 token.
    /// @param  erc20       The contract address of the ERC20 token.
    /// @return csrERC20    The CSR enabled ERC20 token contract address. Return address(0) if the given
    ///                     contract address has not a CSR enabled ERC20 token.
    function getCsrERC20(address erc20) public view returns (address csrERC20) {
        for (uint256 i = 0; i < tokenPairs.length; i++) {
            if (tokenPairs[i].erc20 == erc20) {
                return tokenPairs[i].csrErc20;
            }
        }
        return address(0);
    }

    /// @notice Get the ERC20 token address of a CSR enabled ERC20 token.
    /// @param  csrERC20    The contract address of the CSR enabled ERC20 token.
    /// @return erc20       The ERC20 token contract address. Return address(0) if the given
    ///                     contract address is not a CSR enabled ERC20 token.
    function getERC20(address csrERC20) public view returns (address erc20) {
        for (uint256 i = 0; i < tokenPairs.length; i++) {
            if (tokenPairs[i].csrErc20 == csrERC20) {
                return tokenPairs[i].erc20;
            }
        }
        return address(0);
    }

    /// @notice Get the number of CSR enabled ERC20 tokens created by this factory contract.
    /// @return count       The number of CSR enabled ERC20 tokens created by this factory contract.
    function getTokenPairsCount() public view returns (uint256 count) {
        return tokenPairs.length;
    }

    /// @notice Get the ERC20 token address and CSR enabled ERC20 token address by tokens pair id.
    /// @param  i           The index of the CSR enabled ERC20 token.
    /// @return erc20       The ERC20 token contract address.
    /// @return csrERC20    The CSR enabled ERC20 token contract address.
    function getTokenPairById(
        uint256 i
    ) public view returns (address erc20, address csrERC20) {
        return (tokenPairs[i].erc20, tokenPairs[i].csrErc20);
    }

    /// @notice Get the address of the CSC stakers contract.
    /// @return cscStakers  The address of the CSC stakers contract.
    function getCSCstakersAddress() public view returns (address cscStakers) {
        return csc_stakers;
    }

    /* csrCANTO team bot */

    function pullFundsFromTurnstile(address csrERC20) public {
        require(msg.sender == cron, "CsrERC20Factory: only cron");
        CsrERC20(payable(csrERC20)).pullFundsFromTurnstileWithGasRefund();
    }

    /*=======================================
    =                onlyOwner              =
    =======================================*/

    /// @notice Original function from Ownable.sol by OpenZeppelin.
    /// @dev    This make the doc more explicit to have this func here.
    /// @param  newOwner    The new owner address
    function transferOwnership(
        address newOwner
    ) public override(Ownable, ICsrERC20Factory) onlyOwner {
        super.transferOwnership(newOwner);
    }

    /// @notice Set the address allowed to pull the CSR with gas cost refunds.
    /// @dev    Set the address allowed to call the `pullFundsFromTurnstile`
    ///         function.
    /// @param  newCron        The cron wallet address
    function setCron(address newCron) public onlyOwner {
        cron = newCron;
    }

    /// @notice Set the address of the CSC stakers contract.
    /// @param  newCscStakers    The new address of the CSC stakers contract.
    function setCscStakers(address newCscStakers) public onlyOwner {
        csc_stakers = newCscStakers;
    }

    /* CSR wrapped ERC20 tokens management */

    function addClaimer(
        address claimer,
        address payee,
        address csrERC20
    ) public onlyOwner {
        CsrERC20(payable(csrERC20)).addClaimer(claimer, payee);
    }

    function delClaimer(address claimer, address csrERC20) public onlyOwner {
        CsrERC20(payable(csrERC20)).delClaimer(claimer);
    }

    function setAdmin(address admin, address csrERC20) public onlyOwner {
        CsrERC20(payable(csrERC20)).setAdmin(admin);
    }
}
