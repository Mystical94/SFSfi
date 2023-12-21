import { useState, useEffect, useCallback } from "react";
import { formatUnits } from "ethers";
import { useWalletContext } from "../context/WalletContext";
import { ERC20__factory as Erc20ContractFactory } from "../abis";

const useErc20Balance = (
  tokenAddress: string
): { balance: string | null; refetchBalance: () => Promise<void> } => {
  const { address, provider } = useWalletContext();
  const [balance, setbalance] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address || !provider || !tokenAddress) return;

    try {
      const contract = Erc20ContractFactory.connect(tokenAddress, provider);
      const fetchedBalance = await contract.balanceOf(address);
      const decimals = Number(await contract.decimals());
      setbalance(formatUnits(fetchedBalance, decimals));
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  }, [address, provider, tokenAddress]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, refetchBalance: fetchBalance };
};

export default useErc20Balance;
