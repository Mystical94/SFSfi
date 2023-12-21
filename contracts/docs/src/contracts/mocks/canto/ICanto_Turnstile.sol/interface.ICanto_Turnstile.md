# ICanto_Turnstile
[Git Source](https://gitlab.com/csrCANTO/contracts/blob/9e6fbddb480a4292129b35049a7179a5a11f8cfc/contracts/mocks/canto/ICanto_Turnstile.sol)

This interface is used as part of the csrCANTO related contracts

*This minimal interface can be reused for contracts registration to the CSR*


## Functions
### register

Mints ownership NFT that allows the owner to collect fees earned by the smart contract.
`msg.sender` is assumed to be a smart contract that earns fees. Only smart contract itself
can register a fee receipient.


```solidity
function register(address _recipient) external returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_recipient`|`address`|recipient of the ownership NFT|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|tokenId of the ownership NFT that collects fees|


### assign

Assigns smart contract to existing NFT. That NFT will collect fees generated by the smart contract.
Callable only by smart contract itself.


```solidity
function assign(uint256 _tokenId) external returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|tokenId which will collect fees|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|tokenId of the ownership NFT that collects fees|


### getTokenId

Returns tokenId that collects fees generated by the smart contract


```solidity
function getTokenId(address _smartContract) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_smartContract`|`address`|address of the smart contract|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|tokenId that collects fees generated by the smart contract|


### withdraw

Withdraws earned fees to `_recipient` address. Only callable by NFT owner.


```solidity
function withdraw(uint256 _tokenId, address _recipient, uint256 _amount) external returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|token Id|
|`_recipient`|`address`|recipient of fees|
|`_amount`|`uint256`|amount of fees to withdraw|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|amount of fees withdrawn|


### balances

maps tokenId to fees earned


```solidity
function balances(uint256 _tokenId) external view returns (uint256);
```
