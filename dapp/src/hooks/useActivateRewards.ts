import { useCallback, useState } from "react";
import { useWalletContext } from "../context/WalletContext";
import { getCsrContract } from "../lib/getCsrContract";

const useActivateRewards = (csrErc20TokenAddress: string) => {
  const { signer, sendTransaction } = useWalletContext();
  const [loading, setLoading] = useState<boolean>(false);

  const activateRewards = useCallback(async () => {
    if (!signer) return;

    try {
      const contract = getCsrContract(csrErc20TokenAddress, signer);
      setLoading(true);
      const tx = await contract.register.populateTransaction();
      await sendTransaction(tx, "Activating rewards...", "Rewards activated!");
    } finally {
      setLoading(false);
    }
  }, [signer, csrErc20TokenAddress]);

  return { activateRewards, loading };
};

export default useActivateRewards;
