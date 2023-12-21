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

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../mocks/canto/ICanto_Turnstile.sol";
import "./ICsrCanto.sol";

/// @title  $csrCANTO token
/// @notice This is a wrapped CANTO token with a mechanism for token holders to
///         receive a share of the CSR generated
/// @dev    An ERC-20 wrapper contract with an adaptation of ERC-1843 that
///         redistributes the CSR to the token holders
contract CsrCanto is ICsrCanto, ERC20, ReentrancyGuard {
    ICanto_Turnstile immutable turnstile;
    uint256 public immutable turnstileTokenId;

    /*=====================================
    =            CONFIGURABLES            =
    =====================================*/
    address public ADMIN;

    /*================================
    =            DATASETS            =
    ================================*/
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

    /*==============================
    =            EVENTS            =
    ==============================*/
    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);
    event Register(address account);
    event Claim(address indexed account, uint256 claimed);
    event ContractReceived(address from, uint256 amount);
    event PullFundsFromTurnstile(address from, uint256 amount);

    /*=======================================================
    =        TOKEN HOLDERS CSR PAYMENTS MECHANISM           =
    =======================================================*/

    receive() external payable {
        require(
            msg.sender == address(turnstile),
            "Accept receiving plain $CANTO transfers only from turnstile contract."
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
    ) public override returns (bool) {
        _claimFunds(msg.sender);
        _claimFunds(_to);

        return super.transfer(_to, _value);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public override returns (bool) {
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
    function pullFundsFromTurnstile() external nonReentrant {
        uint256 amount = turnstile.balances(turnstileTokenId);
        require(amount > 0, "No funds available to pull from turnstile.");
        turnstile.withdraw(turnstileTokenId, payable(address(this)), amount);
        _mint(address(this), amount);
        receivedFunds = receivedFunds + amount; // register funds
        emit PullFundsFromTurnstile(msg.sender, amount);
    }

    /// @notice Get the amount of claimed funds available for withdrawal for a given
    ///         account
    /// @dev    The amount of claimed funds available is calculated from the CSR
    ///         that has been received by the contract
    /// @param  _forAddress     The address to check
    /// @return amount          The amount of claimed funds available for withdrawal by `_forAddress`
    function availableFunds(
        address _forAddress
    ) public view returns (uint256 amount) {
        return
            _calcUnprocessedFunds(_forAddress) +
            holders[_forAddress].claimedFunds;
    }

    /*=======================================
    =            PUBLIC FUNCTIONS           =
    =======================================*/

    /// @dev Set default admin role to the deployer, register
    ///      the contract with the turnstile and store its NFT ID
    /// @param turnstileAddr The address of the turnstile contract
    constructor(address turnstileAddr) ERC20("csrCANTO", "csrCANTO") {
        ADMIN = msg.sender;

        turnstile = ICanto_Turnstile(turnstileAddr);
        turnstile.register(address(this));
        turnstileTokenId = turnstile.getTokenId(address(this));
    }

    /// @notice Wrap CANTO into $csrCANTO
    /// @dev Deposit CANTO and mint $csrCANTO, then claim the funds pulled from the turnstile
    function deposit() external payable {
        _mint(msg.sender, msg.value);
        _claimFunds(msg.sender);
        emit Deposit(msg.sender, msg.value);
    }

    /// @notice Unwrap $csrCANTO into CANTO
    /// @dev Withdraw CANTO and burn $csrCANTO
    /// @param amount The amount of $csrCANTO to withdraw
    function withdraw(uint256 amount) public nonReentrant {
        require(this.balanceOf(msg.sender) >= amount, "Insufficient balance.");

        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);

        emit Withdraw(msg.sender, amount);
    }

    /// @notice Register to be able to claim Turnstile revenue (EOA only)
    /// @dev    Update the claimersTotalSupply state used to calculate the unprocessed
    //          funds pull from the Turnstile contract (CSR)
    function register() external nonReentrant {
        require(tx.origin == msg.sender, "Registrant must be an EOA.");
        require(
            holders[msg.sender].payee == address(0),
            "Already registered as a claimer."
        );

        holders[msg.sender].payee = msg.sender;
        payees[msg.sender] = msg.sender;
        claimersTotalSupply = claimersTotalSupply + balanceOf(msg.sender);

        emit Register(msg.sender);
    }

    /// @notice Check if an address is registered as a claimer
    /// @param  addr    The address to check
    /// @return result  True if the address is registered as a claimer, false otherwise
    function isClaimer(address addr) public view returns (bool result) {
        return holders[addr].payee != address(0);
    }

    /// @notice Withdraw the CSR funds claimed internally at user's $csrCANTO balance change
    /// @dev    Withdraw the available funds, reset user states related to their funds
    ///         and burn the $csrCANTO equivalent
    function withdrawClaimed() external nonReentrant {
        require(claimersTotalSupply > 0, "No claimers yet.");
        require(payees[msg.sender] != address(0), "Not in the payees list.");

        Holder storage holder = holders[payees[msg.sender]];
        uint256 withdrawnClaim = availableFunds(payees[msg.sender]);
        holder.processedFunds = receivedFunds;
        holder.claimedFunds = 0;

        payable(msg.sender).transfer(withdrawnClaim);

        _burn(address(this), withdrawnClaim);

        emit Claim(msg.sender, withdrawnClaim);
    }

    /*=======================================
    =            ADMIN FUNCTIONS            =
    =======================================*/
    function setAdmin(address addr) public {
        require(msg.sender == ADMIN, "Only admin can set a new ADMIN address.");
        ADMIN = addr;
    }

    function addClaimer(address addr, address payee) public {
        require(
            msg.sender == ADMIN,
            "Only admin can add an address as a claimer."
        );
        require(
            holders[addr].payee == address(0),
            "Address already in the claimers list."
        );

        holders[addr].payee = payee;
        payees[payee] = addr;
        claimersTotalSupply += balanceOf(addr);
    }

    function delClaimer(address addr) public {
        require(
            msg.sender == ADMIN,
            "Only admin can delete an address from the claimers list."
        );
        require(
            holders[addr].payee != address(0),
            "Address already not in the claimers list."
        );

        delete holders[addr].payee;
        delete payees[addr];
        claimersTotalSupply -= balanceOf(addr);
    }
}
