import { Button, Typography, Box } from "@mui/material";
import { FC } from "react";
import formatNumber from "../lib/formatNumber";
import WalletConnection from "./WalletConnection";
import gasToUsd from "../lib/gasToUsd";
import useRewardsAmount from "../hooks/useRewardsAmount";
import { useWalletContext } from "../context/WalletContext";
import useClaimRewards from "../hooks/useClaimRewards";
import { useTokenPrice } from "../hooks/useTokenPrice";
import ItemLine from "./DetailsLineItem";
import env from "../env";

interface Props {
  csrErc20TokenAddress: string;
}

const ClaimRewards: FC<Props> = ({ csrErc20TokenAddress }) => {
  const { rewards, isLoading, refetchRewardsAmount } =
    useRewardsAmount(csrErc20TokenAddress);
  const { address, isCorrectNetwork } = useWalletContext();

  const {
    claimRewards,
    loading: isClaimInProgress,
    gasEstimate,
  } = useClaimRewards(csrErc20TokenAddress);
  const cantoPrice = useTokenPrice(env.MAINNET.CONTRACTS.WCANTO);

  const handleClaimRewards = async (): Promise<void> => {
    await claimRewards();
    await refetchRewardsAmount();
  };

  return (
    <>
      <Typography
        variant="h6"
        color="text.primary"
        gutterBottom
        style={{ marginTop: "10px", marginBottom: "10px", lineHeight: 1.1 }}
      >
        {rewards ? formatNumber(rewards) : 0} <br /> $CANTO
      </Typography>
      {address ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClaimRewards}
          disabled={
            rewards === null ||
            parseFloat(rewards) === 0 ||
            isLoading ||
            isClaimInProgress ||
            isCorrectNetwork === false
          }
        >
          Claim Rewards
        </Button>
      ) : (
        <WalletConnection />
      )}
      {gasEstimate && cantoPrice !== null && (
        <Box style={{ marginTop: "10px" }}>
          <ItemLine
            label="Max gas fee"
            value={`${formatNumber(
              (parseInt(gasEstimate, 10) / 1e6).toString()
            )} | $${gasToUsd(gasEstimate, cantoPrice)}`}
          />
        </Box>
      )}
    </>
  );
};

export default ClaimRewards;
