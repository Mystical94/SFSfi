import { ContractRunner } from "ethers";
import env from "../env";
import {
  CsrCANTO__factory as CsrCantoContractFactory,
  CsrERC20__factory as CsrErc20ContractFactory,
} from "../abis";

// Overriding type checking here, should revert back when new Assets are included
export const getCsrContract: any = (
  csrErc20Address: string,
  runner: ContractRunner
) => {
  return csrErc20Address === env.CONTRACTS.CSRCANTO
    ? CsrCantoContractFactory.connect(csrErc20Address, runner)
    : CsrErc20ContractFactory.connect(csrErc20Address, runner);
};
