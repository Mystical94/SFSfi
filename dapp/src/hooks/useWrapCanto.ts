import { useState, useEffect } from "react";
import { parseEther } from "ethers";
import { useWalletContext } from "../context/WalletContext";
import env from "../env";
import { useStatusContext } from "../context/StatusContext";
import { CsrCANTO__factory as CsrCantoContractFactory } from "../abis";

const useWrapCanto = (): {
  loading: boolean;
  wrapCanto: (amount: string) => Promise<void>;
  gasEstimate?: string;
} => {
  const { signer, sendTransaction } = useWalletContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [gasEstimate, setGasEstimate] = useState<string | undefined>(undefined);
  const { setStatus } = useStatusContext();

  useEffect(() => {
    const fetchGasPrice = async () => {
      if (!signer) return;

      try {
        const contract = CsrCantoContractFactory.connect(
          env.CONTRACTS.CSRCANTO,
          signer
        );
        const estimatedGas = await contract.deposit.estimateGas({ value: 100 });
        setGasEstimate(estimatedGas.toString());
      } catch (error) {
        // this can happen when the wallet has no ETH
      }
    };

    fetchGasPrice();
  }, [signer]);

  const wrapCanto = async (amount: string): Promise<void> => {
    if (!signer) {
      alert("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    try {
      const contract = CsrCantoContractFactory.connect(
        env.CONTRACTS.CSRCANTO,
        signer
      );
      const weiAmount = parseEther(amount);
      const tx = await contract.deposit.populateTransaction({
        value: weiAmount,
      });
      await sendTransaction(
        tx,
        "Wrapping $ETH...",
        "$ETH wrapped successfully!"
      );
      setLoading(false);
    } catch (error) {
      setStatus({ msg: "", severity: "error" });
      setLoading(false);
    }
  };

  return { wrapCanto, loading, gasEstimate };
};

export default useWrapCanto;
