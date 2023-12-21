import { useCallback } from "react";
import { useWalletContext } from "../context/WalletContext";
import { ERC20__factory as Erc20ContractFactory } from "../abis";
import { DeployedContract } from "../lib/types";

const useGetErc20Info = () => {
  const { provider, defaultProvider, address } = useWalletContext();

  const getErc20Info = useCallback(
    async (erc20Address: string): Promise<DeployedContract> => {
      const erc20Contract = Erc20ContractFactory.connect(
        erc20Address,
        provider || defaultProvider
      );
      const [name, symbol, decimals] = await Promise.all([
        erc20Contract.name(),
        erc20Contract.symbol(),
        erc20Contract.decimals(),
      ]);

      return {
        name,
        symbol,
        address: erc20Address,
        decimals: Number(decimals.toString()),
      };
    },
    [provider, defaultProvider, address]
  );

  return { getErc20Info };
};

export default useGetErc20Info;
