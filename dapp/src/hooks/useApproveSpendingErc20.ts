import { useState } from "react";
import { useWalletContext } from "../context/WalletContext";
import { ERC20__factory as Erc20ContractFactory } from "../abis";
import { useStatusContext } from "../context/StatusContext";

const useApproveSpendingErc20 = () => {
  const { signer, sendTransaction } = useWalletContext();
  const { setStatus } = useStatusContext();
  const [loading, setLoading] = useState<boolean>(false);

  const approveSpendingErc20 = async (
    erc20Address: string,
    spenderAddress: string,
    amount?: bigint
  ) => {
    if (!signer) return;
    setLoading(true);
    const erc20Contract = Erc20ContractFactory.connect(erc20Address, signer);
    try {
      const tx = await erc20Contract.approve.populateTransaction(
        spenderAddress,
        amount ||
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      );
      await sendTransaction(
        tx,
        `Approving CSR enabled contract...`,
        `CSR enabled contract approved!`
      );
    } catch (e) {
      setStatus({
        severity: "error",
        msg: `Error approving CSR enabled contract.`,
      });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { approveSpendingErc20, loading };
};

export default useApproveSpendingErc20;
