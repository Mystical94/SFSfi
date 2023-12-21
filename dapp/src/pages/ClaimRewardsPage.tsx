// import { FC, useCallback, useEffect, useState } from "react";
import { FC } from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import ClaimRewards from "../components/ClaimRewards";
// import ActivateRewards from "../components/ActivateRewards";
import { useWalletContext } from "../context/WalletContext";
import WalletConnection from "../components/WalletConnection";
// import fetchHoldersData from "../lib/getIsClaimer";
import useErc20Info from "../hooks/useErc20Info";
import env from "../env";
import withTokenAddresses from "../components/withTokenAddresses";

interface Props {
  csrErc20TokenAddress: string;
  erc20TokenAddress: string;
}

const ClaimRewardsPage: FC<Props> = ({ csrErc20TokenAddress }) => {
  // const { address, provider } = useWalletContext();
  const { address } = useWalletContext();
  // const [isClaimer, setIsClaimer] = useState<boolean | null>(null);
  const erc20Info = useErc20Info(csrErc20TokenAddress);

  // const fetchIsClaimer = useCallback(async () => {
  //   if (!address || !provider) {
  //     return;
  //   }
  //   const isClaimerResponse = await fetchHoldersData(
  //     provider,
  //     address,
  //     csrErc20TokenAddress
  //   );
  //   setIsClaimer(isClaimerResponse);
  // }, [provider, address]);

  // useEffect(() => {
  //   fetchIsClaimer();
  // }, [address, provider, csrErc20TokenAddress]);

  const getContent = () => {
    if (!address) {
      return <WalletConnection />;
    }

    // if (isClaimer === null || !erc20Info?.symbol) {
    //   return <div>loading...</div>;
    // }
    // if (isClaimer) {
    //   return (
    //     <ClaimRewards
    //       csrErc20TokenAddress={csrErc20TokenAddress}
    //     />
    //   );
    // }
    return (
      <ClaimRewards
        csrErc20TokenAddress={csrErc20TokenAddress}
      />
    );
    // return (
    //   <ActivateRewards
    //     csrErc20TokenAddress={csrErc20TokenAddress}
    //     onActivated={fetchIsClaimer}
    //   />
    // );
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        marginTop: "40px",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        style={{ marginBottom: 0, fontWeight: "600" }}
      >
        Claim Rewards
      </Typography>
      <Typography
        variant="subtitle2"
        gutterBottom
        align="center"
        style={{ marginBottom: "10px" }}
      >
        Contract Secured Revenue from your ${erc20Info?.symbol} holding
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: "2rem", textAlign: "center" }}>
            {getContent()}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export const ClaimRewardsCantoPage: FC = () => (
  <ClaimRewardsPage
    csrErc20TokenAddress={env.CONTRACTS.CSRCANTO}
    erc20TokenAddress={""}
  />
);

export const ClaimRewardsErc20Page = withTokenAddresses(ClaimRewardsPage);
