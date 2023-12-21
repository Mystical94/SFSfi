import { ChangeEvent, FC, useState } from "react";
import { getAddress } from "ethers";
import { Box, Button, TextField, Typography } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { Link as RouterLink } from "react-router-dom";
import WalletConnection from "../../components/WalletConnection";
import { useWalletContext } from "../../context/WalletContext";
import { DeployedContract } from "../../lib/types";
import useCsrErc20FactoryContract from "../../hooks/useCsrErc20FactoryContract";

interface Props {
  onCompleted: (data: DeployedContract) => void;
}
const CreateCsrErc20Form: FC<Props> = ({ onCompleted }) => {
  const [erc20ContractAddress, SetErc20ContractAddress] = useState("");
  const [csrErc20ContractAddress, SetCsrErc20ContractAddress] = useState("");
  const { address, isCorrectNetwork } = useWalletContext();
  const [addressError, setAddressError] = useState<string>("");
  const [csrExists, setCsrExists] = useState(false);
  const {
    loading: creatingCsrErc20,
    createCsrErc20,
    getCsrErc20Address,
  } = useCsrErc20FactoryContract();

  const onSubmit = async () => {
    if (csrExists) {
      return;
    }
    await createCsrErc20(erc20ContractAddress);
    const data = await getCsrErc20Address(erc20ContractAddress);
    if (!data) {
      return;
    }
    SetCsrErc20ContractAddress(data.address);
    onCompleted(data);
  };

  const handleAddressChange = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setCsrExists(false);
    const newAddress = e.target.value.trim();
    SetErc20ContractAddress(newAddress);
    if (newAddress === "") {
      setAddressError("");
      return;
    }
    try {
      getAddress(newAddress);
      setAddressError("");
    } catch (error) {
      setAddressError("Invalid address");
      return;
    }

    const data = await getCsrErc20Address(newAddress);
    if (data) {
      SetCsrErc20ContractAddress(data.address);
      setCsrExists(true);
    }
  };

  const getButtonText = () => {
    if (creatingCsrErc20) {
      return "Deploying...";
    }
    if (csrExists) {
      return "This csrERC20 already exists. Click here to see details";
    }
    return "Deploy CSR wrapper contract";
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h3" gutterBottom align="center">
          Create your own CSR&#x2011;enabled token!
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="center">
          <HelpIcon />
          <Box ml={1}>
            <Typography fontSize={"24px"}>What are csrTokens?</Typography>
          </Box>
        </Box>
        <div>
          <Typography color="text.secondary" component="p">
            Just as csrCANTO created a revenue&#x2011;generating version of
            CANTO, the csrToken Factory lets you do this for ANY token!
          </Typography>
          <br />
          <Typography color="text.secondary" component="p">
            You can deploy a CSR wrapper for your favorite token, or use an
            existing one if someone else has already deployed it.
          </Typography>
          <br />
          <Typography color="text.secondary" component="p">
            You can wrap and unwrap at any time, with no fees. You can also
            claim CSR rewards for the csrTokens that you hold! Check out the
            docs for further details
          </Typography>
        </div>
      </Box>
      <Box sx={{ width: "100%" }} style={{ marginTop: "20px" }}>
        <Typography variant="h6" gutterBottom align="center">
          Paste the token contract address for the token you want to create a
          CSR version for
        </Typography>
        <form>
          <TextField
            error={!!addressError}
            helperText={addressError}
            id="contractAddress"
            label="erc20 contract address"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            placeholder="0x..."
            onChange={handleAddressChange}
            value={erc20ContractAddress}
          />
          {address ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={onSubmit}
              disabled={
                !isCorrectNetwork ||
                !erc20ContractAddress ||
                !!addressError ||
                creatingCsrErc20
              }
              fullWidth
              {...(csrExists && {
                component: RouterLink,
                to: `/csr-erc20/${csrErc20ContractAddress}`,
              })}
            >
              {getButtonText()}
            </Button>
          ) : (
            <WalletConnection />
          )}
        </form>
      </Box>
    </>
  );
};

export default CreateCsrErc20Form;
