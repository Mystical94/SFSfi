import { useCallback, useEffect, useMemo, useState } from "react";
import { parseUnits } from "ethers";
import { useWalletContext } from "../context/WalletContext";
import { useStatusContext } from "../context/StatusContext";
import {
  CsrERC20__factory as CsrErc20ContractFactory,
  ERC20__factory as Erc20ContractFactory,
} from "../abis";
import useErc20Info from "./useErc20Info";
import useCsrErc20FactoryContract from "./useCsrErc20FactoryContract";
import useApproveSpendingErc20 from "./useApproveSpendingErc20";
import useErc20Allowance from "./useErc20Allowance";

const useWrapErc20 = (csrTokenAddress: string, erc20TokenAddress: string) => {
  const { signer, sendTransaction, defaultMainnetProvider, address } =
    useWalletContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [gasEstimate, setGasEstimate] = useState<string | undefined>(undefined);
  const { setStatus } = useStatusContext();
  const erc20Info = useErc20Info(csrTokenAddress);

  const { verifyCsrErc20, getErc20Address } = useCsrErc20FactoryContract();
  const { approveSpendingErc20 } = useApproveSpendingErc20();
  const allowance = useErc20Allowance(erc20TokenAddress, csrTokenAddress);

  const csrErc20Contract = useMemo(() => {
    return CsrErc20ContractFactory.connect(
      csrTokenAddress,
      signer || defaultMainnetProvider
    );
  }, [signer, defaultMainnetProvider, csrTokenAddress]);

  useEffect(() => {
    const fetchGasPrice = async () => {
      if (!signer) return;
      if (allowance === null || allowance === BigInt("0")) {
        return;
      }

      try {
        const estimatedGas = await csrErc20Contract.deposit.estimateGas(1);
        setGasEstimate(estimatedGas.toString());
      } catch (error) {
        // this can happen when the wallet has no erc20
      }
    };

    fetchGasPrice();
  }, [signer, csrErc20Contract, allowance, erc20TokenAddress]);

  const wrapErc20 = useCallback(
    async (amount: string): Promise<void> => {
      if (!signer || !address) {
        alert("Please connect your wallet first.");
        return;
      }
      if (!erc20Info) {
        alert("Unexpected error, please try again later.");
        return;
      }

      const { decimals, symbol } = erc20Info;
      setLoading(true);
      setStatus({ msg: "Verifying CSR ERC20...", severity: "info" });
      try {
        const parsedAmount = parseUnits(amount, decimals);
        const isVerified = await verifyCsrErc20(csrTokenAddress);
        if (!isVerified) {
          setStatus({
            msg: "This is not CSR enabled ERC20 token",
            severity: "error",
          });
          return;
        }
        const erc20Address = await getErc20Address(csrTokenAddress);

        const erc20Allowence = await Erc20ContractFactory.connect(
          erc20Address,
          signer
        ).allowance(address, csrTokenAddress);

        if (erc20Allowence < BigInt(parsedAmount)) {
          await approveSpendingErc20(erc20Address, csrTokenAddress);
        }

        const tx = await csrErc20Contract.deposit.populateTransaction(
          parsedAmount
        );
        await sendTransaction(
          tx,
          `Wrapping $${symbol}...`,
          `$${symbol} wrapped successfully!`
        );
        setLoading(false);
      } catch (error) {
        setStatus({ msg: `Error wrapping ${symbol}:`, severity: "error" });
        setLoading(false);
      }
    },
    [
      signer,
      address,
      erc20Info,
      verifyCsrErc20,
      getErc20Address,
      approveSpendingErc20,
      sendTransaction,
      setLoading,
      setStatus,
    ]
  );

  return { wrapErc20, loading, gasEstimate };
};

export default useWrapErc20;
