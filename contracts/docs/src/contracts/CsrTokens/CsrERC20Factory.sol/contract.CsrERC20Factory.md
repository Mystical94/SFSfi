# CsrERC20Factory
[Git Source](https://gitlab.com/csrCANTO/contracts/blob/9e6fbddb480a4292129b35049a7179a5a11f8cfc/contracts/CsrTokens/CsrERC20Factory.sol)

**Inherits:**
[ICsrERC20Factory](/contracts/CsrTokens/ICsrERC20Factory.sol/interface.ICsrERC20Factory.md), Ownable


## State Variables
### turnstile

```solidity
ICanto_Turnstile immutable turnstile;
```


### cron

```solidity
address public cron;
```


### csc_stakers

```solidity
address public csc_stakers;
```


### tokenPairs

```solidity
TokenPair[] public tokenPairs;
```


### hasBeenCreated

```solidity
mapping(address => bool) public hasBeenCreated;
```


## Functions
### constructor


```solidity
constructor(address turnstileAddr, address csrCANTOaddr, address _csc_stakers);
```

### create

Create a CSR enabled wrapped ERC20 token of an existing ERC20 token.

*The caller of this function will become the admin of the CSR ERC20 token.*


```solidity
function create(address payable erc20) public returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`erc20`|`address payable`|      The ERC20 token contract address.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|csrERC20    The contract address of the newly created csrERC token contract.|


### isCsrERC20

Verify if a contract address is a CSR enabled ERC20 token created
by this factory contract.


```solidity
function isCsrERC20(address addr) public view returns (bool result);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`addr`|`address`|       The contract address to be verified.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`result`|`bool`|     True if the contract address is a CSR enabled ERC20 token.|


### getCsrERC20

Get CSR enabled ERC20 token addrress of ERC20 token.


```solidity
function getCsrERC20(address erc20) public view returns (address csrERC20);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`erc20`|`address`|      The contract address of the ERC20 token.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`csrERC20`|`address`|   The CSR enabled ERC20 token contract address. Return address(0) if the given contract address has not a CSR enabled ERC20 token.|


### getERC20

Get the ERC20 token address of a CSR enabled ERC20 token.


```solidity
function getERC20(address csrERC20) public view returns (address erc20);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`csrERC20`|`address`|   The contract address of the CSR enabled ERC20 token.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`erc20`|`address`|      The ERC20 token contract address. Return address(0) if the given contract address is not a CSR enabled ERC20 token.|


### getTokenPairsCount

Get the number of CSR enabled ERC20 tokens created by this factory contract.


```solidity
function getTokenPairsCount() public view returns (uint256 count);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`count`|`uint256`|      The number of CSR enabled ERC20 tokens created by this factory contract.|


### getTokenPairById

Get the ERC20 token address and CSR enabled ERC20 token address by tokens pair id.


```solidity
function getTokenPairById(uint256 i) public view returns (address erc20, address csrERC20);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`i`|`uint256`|          The index of the CSR enabled ERC20 token.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`erc20`|`address`|      The ERC20 token contract address.|
|`csrERC20`|`address`|   The CSR enabled ERC20 token contract address.|


### getCSCstakersAddress

Get the address of the CSC stakers contract.


```solidity
function getCSCstakersAddress() public view returns (address cscStakers);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`cscStakers`|`address`| The address of the CSC stakers contract.|


### pullFundsFromTurnstile


```solidity
function pullFundsFromTurnstile(address csrERC20) public;
```

### transferOwnership

Original function from Ownable.sol by OpenZeppelin.

*This make the doc more explicit to have this func here.*


```solidity
function transferOwnership(address newOwner) public override(Ownable, ICsrERC20Factory) onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newOwner`|`address`|   The new owner address|


### setCron

Set the address allowed to pull the CSR with gas cost refunds.

*Set the address allowed to call the `pullFundsFromTurnstile`
function.*


```solidity
function setCron(address newCron) public onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newCron`|`address`|       The cron wallet address|


### setCscStakers

Set the address of the CSC stakers contract.


```solidity
function setCscStakers(address newCscStakers) public onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newCscStakers`|`address`|   The new address of the CSC stakers contract.|


### addClaimer


```solidity
function addClaimer(address claimer, address payee, address csrERC20) public onlyOwner;
```

### delClaimer


```solidity
function delClaimer(address claimer, address csrERC20) public onlyOwner;
```

### setAdmin


```solidity
function setAdmin(address admin, address csrERC20) public onlyOwner;
```

## Events
### Created

```solidity
event Created(address indexed erc20, address indexed csrERC20);
```

## Structs
### TokenPair

```solidity
struct TokenPair {
    address erc20;
    address csrErc20;
}
```

