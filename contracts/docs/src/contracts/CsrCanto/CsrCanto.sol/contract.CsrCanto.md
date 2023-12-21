# CsrCanto
[Git Source](https://gitlab.com/csrCANTO/contracts/blob/9e6fbddb480a4292129b35049a7179a5a11f8cfc/contracts/CsrCanto/CsrCanto.sol)

**Inherits:**
[ICsrCanto](/contracts/CsrCanto/ICsrCanto.sol/interface.ICsrCanto.md), ERC20, ReentrancyGuard

This is a wrapped CANTO token with a mechanism for token holders to
receive a share of the CSR generated

*An ERC-20 wrapper contract with an adaptation of ERC-1843 that
redistributes the CSR to the token holders*


## State Variables
### turnstile

```solidity
ICanto_Turnstile immutable turnstile;
```


### turnstileTokenId

```solidity
uint256 public immutable turnstileTokenId;
```


### ADMIN

```solidity
address public ADMIN;
```


### holders

```solidity
mapping(address => Holder) public holders;
```


### payees

```solidity
mapping(address => address) public payees;
```


### claimersTotalSupply

```solidity
uint256 public claimersTotalSupply = 0;
```


### receivedFunds

```solidity
uint256 public receivedFunds;
```


## Functions
### receive


```solidity
receive() external payable;
```

### _claimFunds


```solidity
function _claimFunds(address _forAddress) internal;
```

### _calcUnprocessedFunds


```solidity
function _calcUnprocessedFunds(address _forAddress) internal view returns (uint256);
```

### transfer


```solidity
function transfer(address _to, uint256 _value) public override returns (bool);
```

### transferFrom


```solidity
function transferFrom(address _from, address _to, uint256 _value) public override returns (bool);
```

### _afterTokenTransfer


```solidity
function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual override;
```

### pullFundsFromTurnstile

Pull and distribute the CSR among token holders

*Pull CANTO from the turnstile contract and register the funds by
incrementing the receivedFunds state*


```solidity
function pullFundsFromTurnstile() external nonReentrant;
```

### availableFunds

Get the amount of claimed funds available for withdrawal for a given
account

*The amount of claimed funds available is calculated from the CSR
that has been received by the contract*


```solidity
function availableFunds(address _forAddress) public view returns (uint256 amount);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_forAddress`|`address`|    The address to check|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`|         The amount of claimed funds available for withdrawal by `_forAddress`|


### constructor

*Set default admin role to the deployer, register
the contract with the turnstile and store its NFT ID*


```solidity
constructor(address turnstileAddr) ERC20("csrCANTO", "csrCANTO");
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`turnstileAddr`|`address`|The address of the turnstile contract|


### deposit

Wrap CANTO into $csrCANTO

*Deposit CANTO and mint $csrCANTO, then claim the funds pulled from the turnstile*


```solidity
function deposit() external payable;
```

### withdraw

Unwrap $csrCANTO into CANTO

*Withdraw CANTO and burn $csrCANTO*


```solidity
function withdraw(uint256 amount) public nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`|The amount of $csrCANTO to withdraw|


### register

Register to be able to claim Turnstile revenue (EOA only)

*Update the claimersTotalSupply state used to calculate the unprocessed*


```solidity
function register() external nonReentrant;
```

### isClaimer

Check if an address is registered as a claimer


```solidity
function isClaimer(address addr) public view returns (bool result);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`addr`|`address`|   The address to check|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`result`|`bool`| True if the address is registered as a claimer, false otherwise|


### withdrawClaimed

Withdraw the CSR funds claimed internally at user's $csrCANTO balance change

*Withdraw the available funds, reset user states related to their funds
and burn the $csrCANTO equivalent*


```solidity
function withdrawClaimed() external nonReentrant;
```

### setAdmin


```solidity
function setAdmin(address addr) public;
```

### addClaimer


```solidity
function addClaimer(address addr, address payee) public;
```

### delClaimer


```solidity
function delClaimer(address addr) public;
```

## Events
### Deposit

```solidity
event Deposit(address indexed account, uint256 amount);
```

### Withdraw

```solidity
event Withdraw(address indexed account, uint256 amount);
```

### Register

```solidity
event Register(address account);
```

### Claim

```solidity
event Claim(address indexed account, uint256 claimed);
```

### ContractReceived

```solidity
event ContractReceived(address from, uint256 amount);
```

### PullFundsFromTurnstile

```solidity
event PullFundsFromTurnstile(address from, uint256 amount);
```

## Structs
### Holder

```solidity
struct Holder {
    address payee;
    uint256 claimedFunds;
    uint256 processedFunds;
}
```

