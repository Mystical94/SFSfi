import { useCallback, useEffect, useState } from "react";
import { formatUnits } from "ethers";
import { useWalletContext } from "../context/WalletContext";
import { getCsrContract } from "../lib/getCsrContract";

const useRewardsAmount = (
  csrErc20Address: string
): {
  rewards: null | string;
  isLoading: boolean;
  refetchRewardsAmount: () => Promise<void>;
} => {
  const [rewards, setRewards] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { provider, address } = useWalletContext();

  const loadRewardsAmount = useCallback(async (): Promise<void> => {
    if (!provider || !address) return;

    try {
      setIsLoading(true);
      const contract = getCsrContract(csrErc20Address, provider);
      const rewardsAmount = await contract.earned(address);
      setRewards(formatUnits(rewardsAmount, 18));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [setRewards, setIsLoading, provider, address]);

  useEffect(() => {
    loadRewardsAmount();
  }, [loadRewardsAmount]);

  return {
    rewards,
    isLoading,
    refetchRewardsAmount: loadRewardsAmount,
  };
};

export default useRewardsAmount;
