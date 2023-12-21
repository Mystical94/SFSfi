// mainnet

const mainnet = {
  CHAIN: {
    ID: 7700,
    NAME: "Canto",
    RPC_URL: ["https://canto.gravitychain.io"],
    EXPLORER_URL: ["https://tuber.build"],
  },
  CONTRACTS: {
    CSRCANTO: "0x33544082114fF42974B2965e057e24AC52b75871",
    NOTE: "0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503",
    WCANTO: "0x826551890Dc65655a0Aceca109aB11AbDbD7a07B",
    BASE_V1_ROUTER: "0xa252eEE9BDe830Ca4793F054B506587027825a8e",
    CSR_ERC20_FACTORY: "0x573e65f38c92a68ab7455795ad4acbd116c6e627",
  },
} as const;

// testnet

// const testnet = {
//   CHAIN: {
//     ID: 7701,
//     NAME: "Canto Testnet",
//     RPC_URL: ["https://canto-testnet.plexnode.wtf"],
//     EXPLORER_URL: ["https://testnet.tuber.build"],
//   },
//   CONTRACTS: {
//     CSRCANTO: "0xdBFb2E6c1165449Be5BA54118e26E4d280f79579",
//     NOTE: "0xc51534568489f47949A828C8e3BF68463bdF3566",
//     WCANTO: "0x04a72466De69109889Db059Cb1A4460Ca0648d9D",
//     BASE_V1_ROUTER: "0x463e7d4DF8fE5fb42D024cb57c77b76e6e74417a",
//     CSR_ERC20_FACTORY: "0x766B61B60B86a5F94766c3c8f85868c345F41a7A",
//   },
// } as const;

export default {
  ...mainnet, // switch mainnet / testnet here
  MAINNET: mainnet, // used to get Canto price as it gives goofy values on testnet
};
