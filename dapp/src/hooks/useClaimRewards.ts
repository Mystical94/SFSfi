import { useEffect, useState } from "react";
import { useWalletContext } from "../context/WalletContext";
import { useStatusContext } from "../context/StatusContext";
import { getCsrContract } from "../lib/getCsrContract";

const useClaimRewards = (
  csrErc20Address: string
): {
  claimRewards: () => Promise<void>;
  loading: boolean;
  gasEstimate: string | undefined;
} => {
  const { signer, sendTransaction } = useWalletContext();
  const [loading, setLoading] = useState<boolean>(false);
  const { setStatus } = useStatusContext();
  const [gasEstimate, setGasEstimate] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchGasPrice = async () => {
      if (!signer) return;

      try {
        const contract = getCsrContract(csrErc20Address, signer);
        const estimatedGas = await contract.getReward.estimateGas();
        setGasEstimate(estimatedGas.toString());
      } catch (error) {
        // Can happen if no rewards are available
      }
    };

    fetchGasPrice();
  }, [signer]);

  const claimRewards = async (): Promise<void> => {
    if (!signer) {
      alert("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    try {
      const contract = getCsrContract(csrErc20Address, signer);
      const tx = await contract.getReward.populateTransaction();
      await sendTransaction(tx, "Claiming rewards...", "Rewards claimed!");
    } catch (error) {
      setStatus({ msg: "Error claiming rewards", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return { claimRewards, loading, gasEstimate };
};

export default useClaimRewards;
