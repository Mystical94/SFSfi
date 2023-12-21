import { useCallback, useEffect, useMemo, useState } from "react";
import { parseUnits } from "ethers";
import useErc20Info from "./useErc20Info";
import { useWalletContext } from "../context/WalletContext";
import { CsrERC20__factory as CsrErc20ContractFactory } from "../abis";
import { useStatusContext } from "../context/StatusContext";
import useErc20Balance from "./useErc20Balance";

const useUnwrapErc20 = (csrTokenAddress: string) => {
  const erc20Info = useErc20Info(csrTokenAddress);
  const { signer, sendTransaction, defaultMainnetProvider } =
    useWalletContext();
  const [gasEstimate, setGasEstimate] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { setStatus } = useStatusContext();

  const { balance } = useErc20Balance(csrTokenAddress);

  const csrErc20Contract = useMemo(() => {
    return CsrErc20ContractFactory.connect(
      csrTokenAddress,
      signer || defaultMainnetProvider
    );
  }, [signer, defaultMainnetProvider, csrTokenAddress]);

  useEffect(() => {
    const fetchGasPrice = async () => {
      if (!signer || !balance || parseInt(balance, 10) === 0) return;

      try {
        const estimatedGas = await csrErc20Contract.withdraw.estimateGas(1);
        setGasEstimate(estimatedGas.toString());
      } catch (error) {
        // this can happen when the wallet has no csrEr20
      }
    };

    fetchGasPrice();
  }, [signer, csrErc20Contract, balance]);
  const { symbol, decimals } = erc20Info || {};
  const unwrapErc20 = useCallback(
    async (amount: string) => {
      if (!signer) {
        alert("Please connect your wallet first.");
        return;
      }
      if (!symbol || !decimals) {
        alert("Unexpected error, please try again later.");
        return;
      }

      setLoading(true);
      try {
        const parsedAmount = parseUnits(amount, decimals);
        setStatus({ msg: "", severity: "info", duration: null });
        const tx = await csrErc20Contract.withdraw.populateTransaction(
          parsedAmount
        );
        await sendTransaction(
          tx,
          `Unwrapping $${symbol}...`,
          `$${symbol} unwrapped successfully!`
        );
        setLoading(false);
      } catch (error) {
        setStatus({ msg: `Error unwrapping $${symbol}:`, severity: "error" });
        setLoading(false);
      }
    },
    [signer, setLoading, setStatus, sendTransaction, symbol, decimals]
  );

  return { unwrapErc20, gasEstimate, loading };
};

export default useUnwrapErc20;
