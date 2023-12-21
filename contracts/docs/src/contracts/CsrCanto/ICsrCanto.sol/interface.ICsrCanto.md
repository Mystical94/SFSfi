# ICsrCanto
[Git Source](https://gitlab.com/csrCANTO/contracts/blob/9e6fbddb480a4292129b35049a7179a5a11f8cfc/contracts/CsrCanto/ICsrCanto.sol)


## Functions
### deposit

Wrap CANTO into csrCANTO

*Deposit CANTO and mint $csrCANTO, then claim the funds pulled from the turnstile*


```solidity
function deposit() external payable;
```

### withdraw

Unwrap csrCANTO to CANTO

*Withdraw CANTO and burn csrCANTO*


```solidity
function withdraw(uint256 amount) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`|The amount of csrCANTO to withdraw|


### register

Register to be able to claim Turnstile revenue (EOA only)

*Update the claimersTotalSupply state used to calculate the unprocessed
funds pull from the Turnstile contract (CSR)*


```solidity
function register() external;
```

### isClaimer

Check if an address is registered as a claimer


```solidity
function isClaimer(address addr) external view returns (bool result);
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
function withdrawClaimed() external;
```

### availableFunds

Get the amount of claimed funds available for withdrawal for a given
account

*The amount of claimed funds available is calculated from the CSR
that has been received by the contract*


```solidity
function availableFunds(address _forAddress) external view returns (uint256 amount);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_forAddress`|`address`|    The address to check|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`|         The amount of claimed funds available for withdrawal by `_forAddress`|


### pullFundsFromTurnstile

Pull and distribute the CSR among token holders

*Pull CANTO from the turnstile contract and register the funds by
incrementing the receivedFunds state*


```solidity
function pullFundsFromTurnstile() external;
```

### setAdmin


```solidity
function setAdmin(address addr) external;
```

### addClaimer


```solidity
function addClaimer(address addr, address payee) external;
```

### delClaimer


```solidity
function delClaimer(address addr) external;
```

