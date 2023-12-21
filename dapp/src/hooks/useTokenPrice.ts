import { useState, useEffect } from "react";
import { useWalletContext } from "../context/WalletContext";
import env from "../env";
import { BaseV1Router__factory as BaseV1RouterContractFactory } from "../abis";

const amountIn = 100000;

export const useTokenPrice = (tokenAddress: string): number | null => {
  const { defaultMainnetProvider: provider } = useWalletContext();
  const [price, setPrice] = useState<number | null>(null);

  useEffect((): void => {
    const fetchPrice = async (): Promise<void> => {
      if (!provider) return;
      const contract = BaseV1RouterContractFactory.connect(
        env.MAINNET.CONTRACTS.BASE_V1_ROUTER,
        provider
      );

      try {
        const { amount } = await contract.getAmountOut(
          amountIn,
          tokenAddress,
          env.MAINNET.CONTRACTS.NOTE
        );
        setPrice(Number(amount) / amountIn);
      } catch (error) {
        //
      }
    };

    fetchPrice();
  }, [provider, tokenAddress, setPrice]);

  return price;
};
