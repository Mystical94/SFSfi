// WalletConnection.tsx
import { FC } from "react";
import { Button, Typography } from "@mui/material";
import { useWalletContext } from "../context/WalletContext";

const WalletConnection: FC = () => {
  const { address, connectWallet, checkAndSwitchToCanto } = useWalletContext();

  const formatAddress = (): string => {
    if (!address) {
      return "";
    }
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const onClick = async (): Promise<void> => {
    await checkAndSwitchToCanto();
    await connectWallet();
  };

  return (
    <div>
      {address ? (
        <Typography color="text.primary">{formatAddress()}</Typography>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={onClick}
          fullWidth
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default WalletConnection;
