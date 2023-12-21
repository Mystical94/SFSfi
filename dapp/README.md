![png logo](https://user-images.githubusercontent.com/132018856/235363871-51cf3241-f2dc-4498-910f-594133662bce.png)

# csrcanto.xyz

The official front-end to interact with the CsrCanto contract and the CsrERC20 contract.

## Links

- [Application](https://csrfi.xyz)
- [docs](https://csrcanto.gitbook.io/csrcanto/)
- [X](https://x.com/CSR_fi)
- [Discord](https://discord.com/invite/yTjpt9MNDZ)

## Contract addresses

- csrCANTO (v2): [0x33544082114fF42974B2965e057e24AC52b75871](https://tuber.build/address/0x33544082114fF42974B2965e057e24AC52b75871)
- csrERC20Factory: [0x573e65f38c92a68ab7455795ad4acbd116c6e627](https://tuber.build/address/0x573e65f38c92a68ab7455795ad4acbd116c6e627)

## Development

### Add your token to the tokens selector

The list of 'known' tokens is kept in [knownTokens.ts](src/data/knownTokens.ts) file. 
Simply add new entry in the `KNOWN_TOKENS` array. It has to include the following fields:
* `symbol` - symbol of the token eg. `NOTE`
* `csrErc20Address` - address of the csrERC20 contract
* `csrErc20Icon` - csrERC20 icon path (`""` emtpy string if no icon)
* `erc20Address` - address of the original Token ERC20 contract
* `erc20Icon` - ERC20 icon path (`""` emtpy string if no icon)

Additionally you can add an a logo to your token.
1. Add the logo file to the [logos](src/static/logos) folder. I've tested png and svg files.
2. Import a file in the [knownTokens.ts](src/data/knownTokens.ts) file. ```import NoteLogo from '../static/logos/NOTE.png';```
3. Add a new field to the token object: `icon: NoteLogo,`

Full example:
```
import csrYOURTOKEN from '../static/csrYOURTOKEN.png';
import YOURTOKEN from '../static/YOURTOKEN.png';
...

const KNOWN_TOKENS: KnownToken[] = [
  ...,
  {
    symbol: "YOURTOKEN",
    csrErc20Address: "0x...",
    csrErc20Icon: csrYOURTOKEN,
    erc20Address: "0x...",
    erc20Icon: YOURTOKEN
  }
];
```

### Factory contract interfaces

- [create](https://docs.csrcanto.xyz/contracts/CsrWrapper/ICsrERC20Factory.sol/interface.ICsrERC20Factory.html#create): Create a new csrERC20 from an existing ERC20 contract
- [isCsrERC20](https://docs.csrcanto.xyz/contracts/CsrWrapper/ICsrERC20Factory.sol/interface.ICsrERC20Factory.html#iscsrerc20): Verify if a given csrERC20 contract address is legit
- [getERC20](https://docs.csrcanto.xyz/contracts/CsrWrapper/ICsrERC20Factory.sol/interface.ICsrERC20Factory.html#geterc20): Get the ERC20 contract address corresponding to the given csrERC20 contract address

### csrERC20 contract interfaces

- [deposit](https://docs.csrcanto.xyz/contracts/CsrWrapper/ICsrERC20.sol/interface.ICsrERC20.html#deposit): Wrap ERC20 to csrERC20. Requires approval for spending allowance by this contract.

- [withdraw](https://docs.csrcanto.xyz/contracts/CsrWrapper/ICsrERC20.sol/interface.ICsrERC20.html#withdraw): Unwrap csrERC20 to ERC20.

__The following interfaces are the same than CsrCanto__

- [register](https://docs.csrcanto.xyz/contracts/CsrWrapper/ICsrERC20.sol/interface.ICsrERC20.html#register): Register to be able to claim Turnstile revenue (EOA only)

- [isClaimer](https://docs.csrcanto.xyz/contracts/CsrWrapper/ICsrERC20.sol/interface.ICsrERC20.html#isclaimer): Check if an address is registered as a claimer

- [availableFunds](https://docs.csrcanto.xyz/contracts/CsrWrapper/ICsrERC20.sol/interface.ICsrERC20.html#availablefunds): Get the amount of claimed funds available for withdrawal for a given account

- [withdrawClaimed](https://docs.csrcanto.xyz/contracts/CsrWrapper/ICsrERC20.sol/interface.ICsrERC20.html#withdrawclaimed): Withdraw the CSR funds claimed internally at user's csrERC20 balance change

