# CsrERC20
[Git Source](https://gitlab.com/csrCANTO/contracts/blob/9e6fbddb480a4292129b35049a7179a5a11f8cfc/contracts/CsrTokens/CsrERC20.sol)

**Inherits:**
[ICsrERC20](/contracts/CsrTokens/ICsrERC20.sol/interface.ICsrERC20.md), ERC20Wrapper, ReentrancyGuard


## State Variables
### turnstile

```solidity
ICanto_Turnstile immutable turnstile;
```


### factoryContract

```solidity
ICsrERC20Factory immutable factoryContract;
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
### constructor


```solidity
constructor(ERC20 erc20, address turnstileAddr, address admin)
    ERC20(string.concat("CSR enabled ", erc20.name()), string.concat("csr", erc20.symbol()))
    ERC20Wrapper(erc20);
```

### deposit

Wrap `amount` ERC20 to csrERC20.Requires approval for spending allowance by this contract.

*Call super.depositFor(msg.sender, amount) from ERC20Wrapper: Allow a user to deposit underlying
tokens and mint the corresponding number of wrapped tokens.*


```solidity
function deposit(uint256 amount) public returns (bool success);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`| The amount of underlying ERC20 token to wrap.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`success`|`bool`|True if the operation was successful.|


### withdraw

Unwrap `amount` csrERC20 to ERC20.

*Call super.withdrawTo(msg.sender, amount) from ERC20Wrapper: Allow a user to burn a number of
wrapped tokens and withdraw the corresponding number of underlying tokens.*


```solidity
function withdraw(uint256 amount) public returns (bool success);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`| The amount of underlying csrERC20 token to unwrap.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`success`|`bool`|True if the operation was successful.|


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
function transfer(address _to, uint256 _value) public override(IERC20, ERC20) returns (bool);
```

### transferFrom


```solidity
function transferFrom(address _from, address _to, uint256 _value) public override(IERC20, ERC20) returns (bool);
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
function pullFundsFromTurnstile() public nonReentrant;
```

### pullFundsFromTurnstileWithGasRefund

Special function callable only by the factory contract which
pull and distribute the CSR among token holders. The purpose
of this function is to ensure the CSR gets pulled frequently
out of the box while maintaining low running cost for the team.

*Pull the CSR, refund `msg.sender` the gas cost for calling this
function and distribute the rest among token holders.
If the gas cost is higher than the amount of the CSR available,
`msg.sender` will not be refunded and the full CSR amount will be
distributed.*


```solidity
function pullFundsFromTurnstileWithGasRefund() public nonReentrant;
```

### availableFunds

Get the amount of claimed funds available for withdrawal for a given
account

*The amount of claimed funds available is calculated from the CSR
that has been received by the contract*


```solidity
function availableFunds(address _forAddress) public view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_forAddress`|`address`|    The address to check|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of claimed funds available for withdrawal by `_forAddress`|


### register

Register to be able to claim Turnstile revenue (EOA only)

*Update the claimersTotalSupply state used to calculate the unprocessed
funds pull from the Turnstile contract (CSR)*


```solidity
function register() public;
```

### isClaimer

Check if an address is registered as a claimer


```solidity
function isClaimer(address addr) public view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`addr`|`address`|The address to check|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the address is registered as a claimer, false otherwise|


### withdrawClaimed

Withdraw the CSR funds claimed internally at user's $csrCANTO balance change

*Withdraw the available funds, reset user states related to their funds
and burn the $csrCANTO equivalent*


```solidity
function withdrawClaimed() public nonReentrant;
```

### addClaimer


```solidity
function addClaimer(address addr, address payee) public;
```

### delClaimer


```solidity
function delClaimer(address addr) public;
```

### setAdmin


```solidity
function setAdmin(address addr) public;
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

