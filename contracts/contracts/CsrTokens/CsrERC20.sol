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

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Wrapper.sol";

import "../mocks/canto/ICanto_Turnstile.sol";
import "./ICsrERC20Factory.sol";
import "./ICsrERC20.sol";

contract CsrERC20 is ICsrERC20, ERC20Wrapper, ReentrancyGuard {
    ICanto_Turnstile immutable turnstile;
    ICsrERC20Factory immutable factoryContract;
    uint256 public immutable turnstileTokenId;

    constructor(
        ERC20 erc20,
        address turnstileAddr,
        address admin
    )
        ERC20(
            string.concat("CSR enabled ", erc20.name()),
            string.concat("csr", erc20.symbol())
        )
        ERC20Wrapper(erc20)
    {
        ADMIN = admin;

        turnstile = ICanto_Turnstile(turnstileAddr);
        turnstile.register(address(this));
        turnstileTokenId = turnstile.getTokenId(address(this));

        factoryContract = ICsrERC20Factory(msg.sender);
    }

    address public ADMIN;
    struct Holder {
        address payee;
        /* Token Holders CSR Payments */
        // claimed but not yet withdrawn funds for a user
        uint256 claimedFunds;
        // cumulative funds received which were already processed for distribution - by user
        uint256 processedFunds;
    }
    mapping(address => Holder) public holders;
    mapping(address => address) public payees;
    uint256 public claimersTotalSupply = 0;
    uint256 public receivedFunds; // cumulative funds received by this contract

    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);
    event Register(address account);
    event Claim(address indexed account, uint256 claimed);
    event ContractReceived(address from, uint256 amount);
    event PullFundsFromTurnstile(address from, uint256 amount);

    /*=======================================
    =           wrapper functions           =
    =======================================*/

    /// @notice Wrap `amount` ERC20 to csrERC20.Requires approval for spending allowance by this contract.
    /// @dev    Call super.depositFor(msg.sender, amount) from ERC20Wrapper: Allow a user to deposit underlying
    ///         tokens and mint the corresponding number of wrapped tokens.
    /// @param  amount  The amount of underlying ERC20 token to wrap.
    /// @return success True if the operation was successful.
    function deposit(uint256 amount) public returns (bool success) {
        return super.depositFor(msg.sender, amount);
    }

    /// @notice Unwrap `amount` csrERC20 to ERC20.
    /// @dev    Call super.withdrawTo(msg.sender, amount) from ERC20Wrapper: Allow a user to burn a number of
    ///         wrapped tokens and withdraw the corresponding number of underlying tokens.
    /// @param  amount  The amount of underlying csrERC20 token to unwrap.
    /// @return success True if the operation was successful.
    function withdraw(uint256 amount) public returns (bool success) {
        return super.withdrawTo(msg.sender, amount);
    }

    /*=======================================================
    =        TOKEN HOLDERS CSR PAYMENTS MECHANISM           =
    =======================================================*/

    receive() external payable {
        require(
            msg.sender == address(turnstile),
            "accept receiving plain $CANTO transfers only from turnstile contract"
        );
        emit ContractReceived(msg.sender, msg.value);
    }

    function _claimFunds(address _forAddress) internal {
        uint256 unprocessedFunds = _calcUnprocessedFunds(_forAddress);

        holders[_forAddress].processedFunds = receivedFunds;
        holders[_forAddress].claimedFunds += unprocessedFunds;
    }

    function _calcUnprocessedFunds(
        address _forAddress
    ) internal view returns (uint256) {
        if (holders[_forAddress].payee == address(0)) return 0;
        return
            (balanceOf(_forAddress) *
                (receivedFunds - holders[_forAddress].processedFunds)) /
            claimersTotalSupply;
    }

    /*
     * ERC20 overrides
     */

    function transfer(
        address _to,
        uint256 _value
    ) public override(IERC20, ERC20) returns (bool) {
        _claimFunds(msg.sender);
        _claimFunds(_to);

        return super.transfer(_to, _value);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public override(IERC20, ERC20) returns (bool) {
        _claimFunds(_from);
        _claimFunds(_to);

        return super.transferFrom(_from, _to, _value);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (holders[from].payee != address(0))
            claimersTotalSupply = claimersTotalSupply - amount;
        if (holders[to].payee != address(0))
            claimersTotalSupply = claimersTotalSupply + amount;
    }

    /*
     * public functions
     */

    /// @notice Pull and distribute the CSR among token holders
    /// @dev    Pull CANTO from the turnstile contract and register the funds by
    ///         incrementing the receivedFunds state
    function pullFundsFromTurnstile() public nonReentrant {
        uint256 amount = turnstile.balances(turnstileTokenId);
        require(amount > 0, "no funds to pull from turnstile");
        turnstile.withdraw(turnstileTokenId, payable(address(this)), amount);
        receivedFunds = receivedFunds + amount; // register funds
        emit PullFundsFromTurnstile(msg.sender, amount);
    }

    /// @notice Special function callable only by the factory contract which
    ///         pull and distribute the CSR among token holders. The purpose
    ///         of this function is to ensure the CSR gets pulled frequently
    ///         out of the box while maintaining low running cost for the team.
    /// @dev    Pull the CSR, refund `msg.sender` the gas cost for calling this
    ///         function and distribute the rest among token holders.
    ///         If the gas cost is higher than the amount of the CSR available,
    ///         `msg.sender` will not be refunded and the full CSR amount will be
    ///         distributed.
    function pullFundsFromTurnstileWithGasRefund() public nonReentrant {
        require(
            msg.sender == address(factoryContract),
            "only callable by factory contract"
        );
        uint256 amount = turnstile.balances(turnstileTokenId);
        require(amount > 0, "no funds to pull from turnstile");
        turnstile.withdraw(turnstileTokenId, payable(address(this)), amount);

        emit PullFundsFromTurnstile(msg.sender, amount);
        receivedFunds = receivedFunds + amount; // register funds

        uint256 gasCost = tx.gasprice * 77451; // gas used by the contract call

        // refund caller
        if (amount > gasCost) {
            payable(tx.origin).transfer(gasCost);
            receivedFunds = receivedFunds - gasCost;
        }
    }

    /// @notice Get the amount of claimed funds available for withdrawal for a given
    ///         account
    /// @dev    The amount of claimed funds available is calculated from the CSR
    ///         that has been received by the contract
    /// @param  _forAddress     The address to check
    /// @return The amount of claimed funds available for withdrawal by `_forAddress`
    function availableFunds(address _forAddress) public view returns (uint256) {
        return
            _calcUnprocessedFunds(_forAddress) +
            holders[_forAddress].claimedFunds;
    }

    /// @notice Register to be able to claim Turnstile revenue (EOA only)
    /// @dev    Update the claimersTotalSupply state used to calculate the unprocessed
    ///         funds pull from the Turnstile contract (CSR)
    function register() public {
        require(tx.origin == msg.sender, "Registrant must be an EOA");
        require(
            holders[msg.sender].payee == address(0),
            "Already registered as a claimer"
        );

        holders[msg.sender].payee = msg.sender;
        payees[msg.sender] = msg.sender;
        claimersTotalSupply = claimersTotalSupply + balanceOf(msg.sender);

        emit Register(msg.sender);
    }

    /// @notice Check if an address is registered as a claimer
    /// @param addr The address to check
    /// @return True if the address is registered as a claimer, false otherwise
    function isClaimer(address addr) public view returns (bool) {
        return holders[addr].payee != address(0);
    }

    /// @notice Withdraw the CSR funds claimed internally at user's $csrCANTO balance change
    /// @dev    Withdraw the available funds, reset user states related to their funds
    ///         and burn the $csrCANTO equivalent
    function withdrawClaimed() public nonReentrant {
        require(claimersTotalSupply > 0, "no claimers yet");
        require(payees[msg.sender] != address(0), "not in the payees list");

        Holder storage holder = holders[payees[msg.sender]];
        uint256 claimed = availableFunds(payees[msg.sender]);
        holder.processedFunds = receivedFunds;
        holder.claimedFunds = 0;

        uint256 tax = (claimed * 1000) / 10_000; // 10% tax
        claimed -= tax;

        payable(msg.sender).transfer(claimed);
        payable(factoryContract.getCSCstakersAddress()).transfer(tax);

        emit Claim(msg.sender, claimed);
    }

    /*=======================================
    =            ADMIN FUNCTIONS            =
    =======================================*/
    function addClaimer(address addr, address payee) public {
        require(msg.sender == ADMIN);
        require(
            holders[addr].payee == address(0),
            "address already in the claimers list"
        );
        holders[addr].payee = payee;
        payees[payee] = addr;
        claimersTotalSupply += balanceOf(addr);
    }

    function delClaimer(address addr) public {
        require(msg.sender == ADMIN);
        require(holders[addr].payee != address(0), "address not claimer");
        delete holders[addr].payee;
        delete payees[addr];
        claimersTotalSupply -= balanceOf(addr);
    }

    function setAdmin(address addr) public {
        require(msg.sender == ADMIN);
        ADMIN = addr;
    }
}
