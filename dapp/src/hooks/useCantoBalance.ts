import { useState, useEffect, useCallback } from "react";
import { formatEther } from "ethers";
import { useWalletContext } from "../context/WalletContext";

const useCantoBalance = (): {
  balance: string | null;
  refetchBalance: () => Promise<void>;
} => {
  const [balance, setBalance] = useState<string | null>(null);
  const { address, provider } = useWalletContext();

  const fetchBalance = useCallback(async () => {
    if (!address || !provider) return;
    try {
      const fetchedBalance = await provider.getBalance(address);
      const formattedBalance = formatEther(fetchedBalance);
      setBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, [address, provider]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, refetchBalance: fetchBalance };
};

export default useCantoBalance;
