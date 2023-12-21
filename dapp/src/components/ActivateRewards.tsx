import { FC } from "react";
import { Button } from "@mui/material";
import useActivateRewards from "../hooks/useActivateRewards";
import { useWalletContext } from "../context/WalletContext";

interface Props {
  csrErc20TokenAddress: string;
  onActivated: () => Promise<void>;
}
const ActivateRewards: FC<Props> = ({ csrErc20TokenAddress, onActivated }) => {
  const { activateRewards, loading } = useActivateRewards(csrErc20TokenAddress);
  const { isCorrectNetwork } = useWalletContext();

  const handleClick = async () => {
    await activateRewards();
    await onActivated();
  };

  return (
    <Button
      fullWidth={true}
      disabled={loading || isCorrectNetwork === false}
      onClick={handleClick}
      variant="contained"
      color="secondary"
    >
      Activate rewards
    </Button>
  );
};

export default ActivateRewards;
