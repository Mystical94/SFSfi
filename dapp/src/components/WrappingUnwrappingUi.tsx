import { FC, ChangeEvent, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
  Container,
  Grid,
  Paper,
  InputAdornment,
} from "@mui/material";
import CsrCantoLogo from "../static/csrcanto.png";
import CantoLogo from "../static/canto_logo.svg";
import WalletConnection from "./WalletConnection";
import WrapUnwrapDetails from "./WrapUnwrapDetails";
import { useWalletContext } from "../context/WalletContext";
import { OperationMode } from "../lib/types";
import useApproveSpendingErc20 from "../hooks/useApproveSpendingErc20";
import MinidenticonImg from "./MinidenticonImg";
import KNOWN_TOKENS from "../data/knownTokens";

interface WrappingUnwrappingPageViewProps {
  amount: string;
  handleAmountChange: (
    e: ChangeEvent<HTMLInputElement>,
    mode: OperationMode
  ) => void;
  setMaxAmount: (mode: OperationMode) => void;
  onSubmit: (mode: OperationMode) => Promise<void>;
  loading: boolean;
  amountError: string;
  tokenBalance: string | null;
  csrTokenBalance: string | null;
  price: number | null;
  wrapGasEstimate?: string;
  unwrapGasEstimate?: string;
  symbol?: string;
  requiresApproval: boolean;
  csrTokenAddress?: string;
  tokenAddress?: string;
}

const WrappingUnwrappingPageView: FC<WrappingUnwrappingPageViewProps> = ({
  amount,
  handleAmountChange,
  setMaxAmount,
  onSubmit,
  loading,
  amountError,
  tokenBalance,
  csrTokenBalance,
  price,
  wrapGasEstimate,
  unwrapGasEstimate,
  symbol,
  requiresApproval,
  csrTokenAddress,
  tokenAddress,
}) => {
  const { address, isCorrectNetwork } = useWalletContext();
  const [mode, setMode] = useState<OperationMode>("wrap");
  const { approveSpendingErc20, loading: approveLoading } =
    useApproveSpendingErc20();
  const [spendingApproved, setSpendingApproved] = useState<boolean>(false);

  const handleApproveClick = async () => {
    if (!csrTokenAddress || !tokenAddress) return;
    await approveSpendingErc20(tokenAddress, csrTokenAddress);
    setSpendingApproved(true);
  };

  const logoImg = useMemo(() => {
    if (symbol === "CANTO") {
      return mode === "wrap" ? CantoLogo : CsrCantoLogo;
    }

    const knownLogo = KNOWN_TOKENS.find(
      (t) => t.csrErc20Address === csrTokenAddress
    );

    if (knownLogo) {
      return mode === "wrap" ? knownLogo.erc20Icon : knownLogo.csrErc20Icon;
    }

    return null;
  }, [symbol, csrTokenAddress, mode]);

  const getButton = () => {
    if (requiresApproval && !spendingApproved) {
      return (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleApproveClick}
          disabled={loading || isCorrectNetwork === false || approveLoading}
          fullWidth
        >
          Approve CSR contract
        </Button>
      );
    }

    return address ? (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => onSubmit(mode)}
        disabled={
          loading ||
          !!amountError ||
          !amount ||
          isCorrectNetwork === false ||
          requiresApproval === null
        }
        fullWidth
      >
        {mode === "wrap" ? "Wrap" : "Unwrap"}
      </Button>
    ) : (
      <WalletConnection />
    );
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
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" gutterBottom align="center">
          Wrap & Unwrap
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: "2rem" }}>
              <form>
                <FormControl component="fieldset" fullWidth>
                  <ToggleButtonGroup
                    value={mode}
                    exclusive
                    aria-label="text alignment"
                    fullWidth
                  >
                    <ToggleButton
                      value="wrap"
                      aria-label="left aligned"
                      fullWidth
                      onClick={() => setMode("wrap")}
                    >
                      Wrap
                    </ToggleButton>
                    <ToggleButton
                      value="unwrap"
                      aria-label="left aligned"
                      fullWidth
                      onClick={() => setMode("unwrap")}
                    >
                      Unwrap
                    </ToggleButton>
                  </ToggleButtonGroup>
                </FormControl>
                <TextField
                  id="amount"
                  label="Amount"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          onClick={() => setMaxAmount(mode)}
                          disabled={!address}
                        >
                          Max
                        </Button>
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        {logoImg ? (
                          <img
                            src={logoImg}
                            alt="csrCANTO logo"
                            style={{
                              height: "30px",
                            }}
                          />
                        ) : (
                          <MinidenticonImg
                            value={csrTokenAddress || ""}
                            alt={`${symbol} logo`}
                            style={{
                              height: "30px",
                            }}
                            color={mode === "wrap" ? "#06FC99" : "#FCDD50"}
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={amount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleAmountChange(e, mode)
                  }
                  error={!!amountError}
                  helperText={amountError}
                />
                {getButton()}
              </form>
              <WrapUnwrapDetails
                mode={mode}
                csrTokenBalance={csrTokenBalance}
                baseTokenBalance={tokenBalance}
                amount={amount}
                price={price}
                wrapGasEstimate={wrapGasEstimate}
                unwrapGasEstimate={unwrapGasEstimate}
                symbol={symbol}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default WrappingUnwrappingPageView;
