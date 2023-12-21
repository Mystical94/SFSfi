import { Box } from "@mui/material";
import { FC } from "react";
import gasToUsd from "../lib/gasToUsd";
import ItemLine from "./DetailsLineItem";
import formatNumber from "../lib/formatNumber";
import { useTokenPrice } from "../hooks/useTokenPrice";
import env from "../env";

interface Props {
  baseTokenBalance: string | null;
  csrTokenBalance: string | null;
  amount: string;
  mode: "wrap" | "unwrap";
  price: number | null;
  wrapGasEstimate?: string;
  unwrapGasEstimate?: string;
  symbol?: string;
}
// TODO: Update this component
const WrapUnwrapDetails: FC<Props> = ({
  baseTokenBalance,
  csrTokenBalance,
  amount,
  mode,
  price,
  wrapGasEstimate,
  unwrapGasEstimate,
  symbol,
}) => {
  const gasEstimate = mode === "wrap" ? wrapGasEstimate : unwrapGasEstimate;
  const cantoPrice = useTokenPrice(env.MAINNET.CONTRACTS.WCANTO);

  if (!symbol) {
    return null;
  }

  return (
    <Box mt={2}>
      {gasEstimate && cantoPrice !== null && cantoPrice !== 0 && (
        <ItemLine
          label="Max gas fee:"
          value={`${formatNumber(
            (parseInt(gasEstimate, 10) / 1e6).toString()
          )} | $${gasToUsd(gasEstimate, cantoPrice)}`}
        />
      )}
      {price !== null && price !== 0 && (
        <ItemLine
          label="USD Value:"
          value={`$${(parseInt(amount || "0", 10) * price).toFixed(2)}`}
        />
      )}
      {baseTokenBalance !== null && (
        <ItemLine
          label={`$${symbol} balance:`}
          value={formatNumber(baseTokenBalance)}
        />
      )}
      {csrTokenBalance !== null && (
        <ItemLine
          label={`$csr${symbol} balance:`}
          value={formatNumber(csrTokenBalance)}
        />
      )}
      <ItemLine label="" value={`1 $${symbol} = 1 $csr${symbol}`} />
    </Box>
  );
};

export default WrapUnwrapDetails;
