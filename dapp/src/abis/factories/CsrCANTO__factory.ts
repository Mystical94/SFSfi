/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../common";
import type { CsrCANTO, CsrCANTOInterface } from "../CsrCANTO";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_turnstile",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RewardsClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RewardsDelivered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "TURNSTILE",
    outputs: [
      {
        internalType: "contract TurnstileInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "csrID",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "earned",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isRewardEligible",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "rewardEligibleBalanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "scalar",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRewardEligibleSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "turnstileBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawFromTurnstile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620018d6380380620018d6833981016040819052620000349162000187565b602481806040518060400160405280600881526020016763737243414e544f60c01b8152506040518060400160405280600881526020016763737243414e544f60c01b81525081600390816200008b91906200025e565b5060046200009a82826200025e565b5050506001600160a01b038116620000d857600680546001600160a01b03191673ecf044c5b4b867cfda001101c617ecd347095b44179055620000f4565b600680546001600160a01b0319166001600160a01b0383161790555b600654604051632210724360e11b81523060048201526001600160a01b0390911690634420e486906024016020604051808303816000875af11580156200013f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200016591906200032a565b600555506200017682600a62000459565b600d5550506001600e55506200046a565b6000602082840312156200019a57600080fd5b81516001600160a01b0381168114620001b257600080fd5b9392505050565b634e487b7160e01b600052604160045260246000fd5b600181811c90821680620001e457607f821691505b6020821081036200020557634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200025957600081815260208120601f850160051c81016020861015620002345750805b601f850160051c820191505b81811015620002555782815560010162000240565b5050505b505050565b81516001600160401b038111156200027a576200027a620001b9565b62000292816200028b8454620001cf565b846200020b565b602080601f831160018114620002ca5760008415620002b15750858301515b600019600386901b1c1916600185901b17855562000255565b600085815260208120601f198616915b82811015620002fb57888601518255948401946001909101908401620002da565b50858210156200031a5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6000602082840312156200033d57600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b600181815b808511156200039b5781600019048211156200037f576200037f62000344565b808516156200038d57918102915b93841c93908002906200035f565b509250929050565b600082620003b45750600162000453565b81620003c35750600062000453565b8160018114620003dc5760028114620003e75762000407565b600191505062000453565b60ff841115620003fb57620003fb62000344565b50506001821b62000453565b5060208310610133831016604e8410600b84101617156200042c575081810a62000453565b6200043883836200035a565b80600019048211156200044f576200044f62000344565b0290505b92915050565b6000620001b260ff841683620003a3565b61145c806200047a6000396000f3fe6080604052600436106101435760003560e01c80633d18b912116100b6578063a04af4bb1161006f578063a04af4bb146103c6578063a457c2d7146103db578063a9059cbb146103fb578063d0e30db01461041b578063dd62ed3e14610423578063f45e65d81461044357600080fd5b80633d18b912146102e257806370a08231146102f75780637bd5cbde1461032d57806389a6acc01461034257806395d89b4114610378578063a03d76d81461038d57600080fd5b80631d888021116101085780631d88802114610218578063201dcfb31461022e57806323b872dd146102665780632e1a7d4d14610286578063313ce567146102a657806339509351146102c257600080fd5b80628cc26214610169578063023b4f5f1461019c57806306fdde03146101b1578063095ea7b3146101d357806318160ddd1461020357600080fd5b36610164576006546001600160a01b0316331461016257610162610459565b005b600080fd5b34801561017557600080fd5b5061018961018436600461123c565b6104ac565b6040519081526020015b60405180910390f35b3480156101a857600080fd5b5061016261052e565b3480156101bd57600080fd5b506101c6610548565b604051610193919061125e565b3480156101df57600080fd5b506101f36101ee3660046112ac565b6105da565b6040519015158152602001610193565b34801561020f57600080fd5b50600254610189565b34801561022457600080fd5b5061018960055481565b34801561023a57600080fd5b5060065461024e906001600160a01b031681565b6040516001600160a01b039091168152602001610193565b34801561027257600080fd5b506101f36102813660046112d6565b6105f2565b34801561029257600080fd5b506101626102a1366004611312565b610616565b3480156102b257600080fd5b5060405160128152602001610193565b3480156102ce57600080fd5b506101f36102dd3660046112ac565b610674565b3480156102ee57600080fd5b50610162610696565b34801561030357600080fd5b5061018961031236600461123c565b6001600160a01b031660009081526020819052604090205490565b34801561033957600080fd5b506101896106a6565b34801561034e57600080fd5b5061018961035d36600461123c565b6001600160a01b03166000908152600b602052604090205490565b34801561038457600080fd5b506101c661071d565b34801561039957600080fd5b506101f36103a836600461123c565b6001600160a01b03166000908152600c602052604090205460ff1690565b3480156103d257600080fd5b50600a54610189565b3480156103e757600080fd5b506101f36103f63660046112ac565b61072c565b34801561040757600080fd5b506101f36104163660046112ac565b6107ac565b610162610459565b34801561042f57600080fd5b5061018961043e36600461132b565b6107ba565b34801561044f57600080fd5b50610189600d5481565b6104616107e5565b61046b333461083e565b60405134815233907fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c9060200160405180910390a26104aa6001600e55565b565b600d546001600160a01b0382166000908152600860205260408120546007549192916104d89190611374565b6001600160a01b0384166000908152600b60205260409020546104fb9190611387565b610505919061139e565b6001600160a01b03831660009081526009602052604090205461052891906113c0565b92915050565b6105366107e5565b61053e610909565b6104aa6001600e55565b606060038054610557906113d3565b80601f0160208091040260200160405190810160405280929190818152602001828054610583906113d3565b80156105d05780601f106105a5576101008083540402835291602001916105d0565b820191906000526020600020905b8154815290600101906020018083116105b357829003601f168201915b5050505050905090565b6000336105e8818585610a5d565b5060019392505050565b600033610600858285610b81565b61060b858585610bfb565b506001949350505050565b61061e6107e5565b6106283382610da5565b6106323382610ee3565b60405181815233907f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a94243649060200160405180910390a26106716001600e55565b50565b6000336105e881858561068783836107ba565b61069191906113c0565b610a5d565b61069e6107e5565b61053e610fbb565b600654600554604051634903b0d160e01b815260048101919091526000916001600160a01b031690634903b0d190602401602060405180830381865afa1580156106f4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610718919061140d565b905090565b606060048054610557906113d3565b6000338161073a82866107ba565b90508381101561079f5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b61060b8286868403610a5d565b6000336105e8818585610bfb565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6002600e54036108375760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610796565b6002600e55565b6001600160a01b0382166108945760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610796565b80600260008282546108a691906113c0565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a361090560008383611031565b5050565b60006109136106a6565b9050600081116109655760405162461bcd60e51b815260206004820181905260248201527f4373725265776172647345524332303a204e6f2043535220746f20636c61696d6044820152606401610796565b3332146109d35760405162461bcd60e51b815260206004820152603660248201527f4373725265776172647345524332303a204f6e6c7920454f41732063616e2077604482015275697468647261772066726f6d205475726e7374696c6560501b6064820152608401610796565b600654600554604051631cc6d2f960e31b81526004810191909152306024820152604481018390526001600160a01b039091169063e63697c8906064016020604051808303816000875af1158015610a2f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a53919061140d565b506106718161103c565b6001600160a01b038316610abf5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610796565b6001600160a01b038216610b205760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610796565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6000610b8d84846107ba565b90506000198114610bf55781811015610be85760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610796565b610bf58484848403610a5d565b50505050565b6001600160a01b038316610c5f5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610796565b6001600160a01b038216610cc15760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610796565b6001600160a01b03831660009081526020819052604090205481811015610d395760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610796565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610bf5848484611031565b6001600160a01b038216610e055760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610796565b6001600160a01b03821660009081526020819052604090205481811015610e795760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610796565b6001600160a01b0383166000818152602081815260408083208686039055600280548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610ede83600084611031565b505050565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114610f30576040519150601f19603f3d011682016040523d82523d6000602084013e610f35565b606091505b5050905080610ede5760405162461bcd60e51b815260206004820152604660248201527f4373725265776172647345524332303a20556e61626c6520746f207472616e7360448201527f6665722043414e544f2c20726563697069656e74206d617920686176652072656064820152651d995c9d195960d21b608482015260a401610796565b6000610fc6336104ac565b9050801561067157336000818152600960209081526040808320839055600754600890925290912055610ff99082610ee3565b60405181815233907ffc30cddea38e2bf4d6ea7d3f9ed3b6ad7f176419f4963bd81318067a4aee73fe9060200160405180910390a250565b610ede8383836110a2565b600a54600d5461104c9083611387565b611056919061139e565b6007600082825461106791906113c0565b90915550506040518181527f3c67104483541e0784de45745293680ec52e10daeb4b03c61846b1002298a38f9060200160405180910390a150565b6001600160a01b0382166000908152600c602052604090205460ff16156110d2576110cd8282611198565b611125565b6001600160a01b0382163b1580156110f257506001600160a01b03821615155b15611125576111018282611198565b6001600160a01b0382166000908152600c60205260409020805460ff191660011790555b6001600160a01b0383166000908152600c602052604090205460ff1615610ede5761114f836111e9565b80600a60008282546111619190611374565b90915550506001600160a01b0383166000908152600b60205260408120805483929061118e908490611374565b9091555050505050565b6111a1826111e9565b80600a60008282546111b391906113c0565b90915550506001600160a01b0382166000908152600b6020526040812080548392906111e09084906113c0565b90915550505050565b6111f2816104ac565b6001600160a01b03909116600090815260096020908152604080832093909355600754600890915291902055565b80356001600160a01b038116811461123757600080fd5b919050565b60006020828403121561124e57600080fd5b61125782611220565b9392505050565b600060208083528351808285015260005b8181101561128b5785810183015185820160400152820161126f565b506000604082860101526040601f19601f8301168501019250505092915050565b600080604083850312156112bf57600080fd5b6112c883611220565b946020939093013593505050565b6000806000606084860312156112eb57600080fd5b6112f484611220565b925061130260208501611220565b9150604084013590509250925092565b60006020828403121561132457600080fd5b5035919050565b6000806040838503121561133e57600080fd5b61134783611220565b915061135560208401611220565b90509250929050565b634e487b7160e01b600052601160045260246000fd5b818103818111156105285761052861135e565b80820281158282048414176105285761052861135e565b6000826113bb57634e487b7160e01b600052601260045260246000fd5b500490565b808201808211156105285761052861135e565b600181811c908216806113e757607f821691505b60208210810361140757634e487b7160e01b600052602260045260246000fd5b50919050565b60006020828403121561141f57600080fd5b505191905056fea2646970667358221220a1dc8d78865f06604152042055d5a9ea58e4c1d27a6bf6db978f38577465a6e364736f6c63430008120033";

type CsrCANTOConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CsrCANTOConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CsrCANTO__factory extends ContractFactory {
  constructor(...args: CsrCANTOConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _turnstile: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_turnstile, overrides || {});
  }
  override deploy(
    _turnstile: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_turnstile, overrides || {}) as Promise<
      CsrCANTO & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): CsrCANTO__factory {
    return super.connect(runner) as CsrCANTO__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CsrCANTOInterface {
    return new Interface(_abi) as CsrCANTOInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): CsrCANTO {
    return new Contract(address, _abi, runner) as unknown as CsrCANTO;
  }
}