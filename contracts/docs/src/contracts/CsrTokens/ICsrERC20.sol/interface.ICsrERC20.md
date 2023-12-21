# ICsrERC20
[Git Source](https://gitlab.com/csrCANTO/contracts/blob/9e6fbddb480a4292129b35049a7179a5a11f8cfc/contracts/CsrTokens/ICsrERC20.sol)

**Inherits:**
IERC20


## Functions
### deposit

Wrap `amount` ERC20 to csrERC20.Requires approval for spending allowance by this contract.

*Call super.depositFor(msg.sender, amount) from ERC20Wrapper: Allow a user to deposit underlying
tokens and mint the corresponding number of wrapped tokens.*


```solidity
function deposit(uint256 amount) external returns (bool success);
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
function withdraw(uint256 amount) external returns (bool success);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`| The amount of underlying csrERC20 token to unwrap.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`success`|`bool`|True if the operation was successful.|


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

Withdraw the CSR funds claimed internally at user's csrERC20 balance change

*Withdraw the available funds, reset user states related to their funds
and burn the csrERC20 amount equivalent*


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
function pullFundsFromTurnstileWithGasRefund() external;
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

