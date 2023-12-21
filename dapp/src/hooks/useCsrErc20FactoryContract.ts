import { useCallback, useMemo, useState } from "react";
import { useWalletContext } from "../context/WalletContext";
import { CsrERC20Factory__factory as CsrERC20FactoryContractFactory } from "../abis";
import env from "../env";
import { useStatusContext } from "../context/StatusContext";
import { DeployedContract } from "../lib/types";
import useGetErc20Info from "./useGetErc20Info";

const useCsrErc20FactoryContract = (): {
  createCsrErc20: (erc20Address: string) => Promise<void>;
  getCsrErc20Address: (
    erc20Address: string
  ) => Promise<DeployedContract | null>;
  loading: boolean;
  getErc20Address: (csrErc20Address: string) => Promise<string>;
  verifyCsrErc20: (contractAddress: string) => Promise<boolean>;
} => {
  const { sendTransaction, defaultProvider, provider } = useWalletContext();
  const [loading, setLoading] = useState<boolean>(false);
  const { setStatus } = useStatusContext();
  const { getErc20Info } = useGetErc20Info();

  const factoryContract = useMemo(() => {
    return CsrERC20FactoryContractFactory.connect(
      env.CONTRACTS.CSR_ERC20_FACTORY,
      defaultProvider || provider
    );
  }, [defaultProvider, provider]);

  const getCsrErc20Address = async (
    erc20Address: string
  ): Promise<DeployedContract | null> => {
    let csrErc20Address: string;
    try {
      csrErc20Address = await factoryContract.getCsrERC20(erc20Address);
    } catch (error) {
      return null;
    }
    if (
      !csrErc20Address ||
      csrErc20Address === "0x0000000000000000000000000000000000000000"
    ) {
      return null;
    }
    return getErc20Info(csrErc20Address);
  };

  const verifyCsrErc20 = useCallback(
    async (contractAddress: string): Promise<boolean> => {
      return factoryContract.isCsrERC20(contractAddress);
    },
    []
  );

  const getErc20Address = async (csrErc20Address: string): Promise<string> => {
    const erc20Address = factoryContract.getERC20(csrErc20Address);
    if (!erc20Address) {
      throw new Error("No ERC20 address found");
    }
    return erc20Address;
  };

  const createCsrErc20 = async (erc20Address: string): Promise<void> => {
    setLoading(true);

    try {
      const { name } = await getErc20Info(erc20Address);
      const tx = await factoryContract.create.populateTransaction(erc20Address);
      await sendTransaction(
        tx,
        `Creating csr${name}...`,
        `Csr${name} Created as !`
      );
    } catch (error) {
      setStatus({ msg: `Error creating csr enabled token`, severity: "error" });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCsrErc20,
    loading,
    getCsrErc20Address,
    getErc20Address,
    verifyCsrErc20,
  };
};

export default useCsrErc20FactoryContract;
