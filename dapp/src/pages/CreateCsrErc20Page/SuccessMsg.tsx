import { FC } from "react";
import { Box, Typography, Link, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { DeployedContract } from "../../lib/types";
import env from "../../env";

const SuccessMsg: FC<DeployedContract> = ({ symbol, address, name }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h1" align="center">
        🎊
      </Typography>
      <Typography variant="h2" align="center">
        Congratulations!
      </Typography>
      <Typography align="center" style={{ marginTop: "20px" }}>
        You have successfully deployed {name} ${symbol} at{" "}
        <Link href={`${env.CHAIN.EXPLORER_URL}/address/${address}`}>
          {address}
        </Link>
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        component={RouterLink}
        to={address}
        fullWidth
        style={{ marginTop: "20px" }}
      >
        Try it now!
      </Button>
    </Box>
  );
};

export default SuccessMsg;
