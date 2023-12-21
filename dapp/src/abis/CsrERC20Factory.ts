/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface CsrERC20FactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addClaimer"
      | "create"
      | "cron"
      | "csc_stakers"
      | "delClaimer"
      | "getCSCstakersAddress"
      | "getCsrERC20"
      | "getERC20"
      | "getTokenPairById"
      | "getTokenPairsCount"
      | "hasBeenCreated"
      | "isCsrERC20"
      | "owner"
      | "pullFundsFromTurnstile"
      | "renounceOwnership"
      | "setAdmin"
      | "setCron"
      | "setCscStakers"
      | "tokenPairs"
      | "transferOwnership"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "Created" | "OwnershipTransferred"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addClaimer",
    values: [AddressLike, AddressLike, AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "create", values: [AddressLike]): string;
  encodeFunctionData(functionFragment: "cron", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "csc_stakers",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "delClaimer",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getCSCstakersAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getCsrERC20",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getERC20",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenPairById",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenPairsCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "hasBeenCreated",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isCsrERC20",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pullFundsFromTurnstile",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setAdmin",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setCron",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setCscStakers",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenPairs",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "addClaimer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "create", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "cron", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "csc_stakers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "delClaimer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCSCstakersAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCsrERC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getERC20", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTokenPairById",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokenPairsCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasBeenCreated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isCsrERC20", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pullFundsFromTurnstile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setCron", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setCscStakers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenPairs", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
}

export namespace CreatedEvent {
  export type InputTuple = [erc20: AddressLike, csrERC20: AddressLike];
  export type OutputTuple = [erc20: string, csrERC20: string];
  export interface OutputObject {
    erc20: string;
    csrERC20: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface CsrERC20Factory extends BaseContract {
  connect(runner?: ContractRunner | null): CsrERC20Factory;
  waitForDeployment(): Promise<this>;

  interface: CsrERC20FactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  addClaimer: TypedContractMethod<
    [claimer: AddressLike, payee: AddressLike, csrERC20: AddressLike],
    [void],
    "nonpayable"
  >;

  create: TypedContractMethod<[erc20: AddressLike], [string], "nonpayable">;

  cron: TypedContractMethod<[], [string], "view">;

  csc_stakers: TypedContractMethod<[], [string], "view">;

  delClaimer: TypedContractMethod<
    [claimer: AddressLike, csrERC20: AddressLike],
    [void],
    "nonpayable"
  >;

  getCSCstakersAddress: TypedContractMethod<[], [string], "view">;

  getCsrERC20: TypedContractMethod<[erc20: AddressLike], [string], "view">;

  getERC20: TypedContractMethod<[csrERC20: AddressLike], [string], "view">;

  getTokenPairById: TypedContractMethod<
    [i: BigNumberish],
    [[string, string] & { erc20: string; csrERC20: string }],
    "view"
  >;

  getTokenPairsCount: TypedContractMethod<[], [bigint], "view">;

  hasBeenCreated: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  isCsrERC20: TypedContractMethod<[addr: AddressLike], [boolean], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  pullFundsFromTurnstile: TypedContractMethod<
    [csrERC20: AddressLike],
    [void],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  setAdmin: TypedContractMethod<
    [admin: AddressLike, csrERC20: AddressLike],
    [void],
    "nonpayable"
  >;

  setCron: TypedContractMethod<[newCron: AddressLike], [void], "nonpayable">;

  setCscStakers: TypedContractMethod<
    [newCscStakers: AddressLike],
    [void],
    "nonpayable"
  >;

  tokenPairs: TypedContractMethod<
    [arg0: BigNumberish],
    [[string, string] & { erc20: string; csrErc20: string }],
    "view"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addClaimer"
  ): TypedContractMethod<
    [claimer: AddressLike, payee: AddressLike, csrERC20: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "create"
  ): TypedContractMethod<[erc20: AddressLike], [string], "nonpayable">;
  getFunction(
    nameOrSignature: "cron"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "csc_stakers"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "delClaimer"
  ): TypedContractMethod<
    [claimer: AddressLike, csrERC20: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getCSCstakersAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getCsrERC20"
  ): TypedContractMethod<[erc20: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "getERC20"
  ): TypedContractMethod<[csrERC20: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "getTokenPairById"
  ): TypedContractMethod<
    [i: BigNumberish],
    [[string, string] & { erc20: string; csrERC20: string }],
    "view"
  >;
  getFunction(
    nameOrSignature: "getTokenPairsCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "hasBeenCreated"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isCsrERC20"
  ): TypedContractMethod<[addr: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "pullFundsFromTurnstile"
  ): TypedContractMethod<[csrERC20: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setAdmin"
  ): TypedContractMethod<
    [admin: AddressLike, csrERC20: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setCron"
  ): TypedContractMethod<[newCron: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setCscStakers"
  ): TypedContractMethod<[newCscStakers: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "tokenPairs"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [[string, string] & { erc20: string; csrErc20: string }],
    "view"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "Created"
  ): TypedContractEvent<
    CreatedEvent.InputTuple,
    CreatedEvent.OutputTuple,
    CreatedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;

  filters: {
    "Created(address,address)": TypedContractEvent<
      CreatedEvent.InputTuple,
      CreatedEvent.OutputTuple,
      CreatedEvent.OutputObject
    >;
    Created: TypedContractEvent<
      CreatedEvent.InputTuple,
      CreatedEvent.OutputTuple,
      CreatedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
  };
}
