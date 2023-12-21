import { useEffect, useState } from "react";
import { parseEther } from "ethers";
import { useWalletContext } from "../context/WalletContext";
import env from "../env";
import { useStatusContext } from "../context/StatusContext";
import { CsrCANTO__factory as CsrCantoContractFactory } from "../abis";

const useUnwrapCanto = (): {
  loading: boolean;
  unwrapCanto: (amount: string) => Promise<void>;
  gasEstimate: string | undefined;
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
        const estimatedGas = await contract.withdraw.estimateGas(1);
        setGasEstimate(estimatedGas.toString());
      } catch (error) {
        // This can happen if the wallet had no csrCanto
      }
    };

    fetchGasPrice();
  }, [signer]);

  const unwrapCanto = async (amount: string): Promise<void> => {
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
      setStatus({ msg: "", severity: "info", duration: null });
      const tx = await contract.withdraw.populateTransaction(weiAmount);
      await sendTransaction(
        tx,
        "Unwrapping $scrCANTO...",
        "$scrCANTO unwrapped successfully!"
      );
      setLoading(false);
    } catch (error) {
      setStatus({ msg: "Error unwrapping CsrCanto:", severity: "error" });
      setLoading(false);
    }
  };

  return { unwrapCanto, loading, gasEstimate };
};

export default useUnwrapCanto;
