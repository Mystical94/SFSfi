import { useEffect, useState } from "react";
import { ERC20__factory as Erc20ContractFactory } from "../abis";
import { useWalletContext } from "../context/WalletContext";

const useErc20Allowance = (erc20Address: string, spenderAddress: string) => {
  const { signer, address } = useWalletContext();
  const [allowance, setAllowance] = useState<bigint | null>(null);

  useEffect(() => {
    const fetchAllowance = async () => {
      if (!signer || !address) {
        return;
      }
      const erc20Contract = Erc20ContractFactory.connect(erc20Address, signer);

      const loadedAllowance = await erc20Contract.allowance(
        address,
        spenderAddress
      );
      setAllowance(loadedAllowance);
    };

    fetchAllowance();
  }, [signer, address, erc20Address, spenderAddress, setAllowance]);

  return allowance;
};

export default useErc20Allowance;
