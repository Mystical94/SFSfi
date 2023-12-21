import { ChangeEvent, FC, useCallback, useState } from "react";
import WrappingUnwrappingPageView from "../components/WrappingUnwrappingUi";
import { OperationMode } from "../lib/types";

import useErc20Balance from "../hooks/useErc20Balance";
import useWrapErc20 from "../hooks/useWrapErc20";
import useUnwrapErc20 from "../hooks/useUnwrapErc20";
import useErc20Info from "../hooks/useErc20Info";
import useErc20Allowance from "../hooks/useErc20Allowance";
import { useTokenPrice } from "../hooks/useTokenPrice";
import withTokenAddresses from "../components/withTokenAddresses";

const WrappingUnwrappingErc20Page: FC<{
  erc20TokenAddress: string;
  csrErc20TokenAddress: string;
}> = ({ erc20TokenAddress, csrErc20TokenAddress }) => {
  const [amount, setAmount] = useState<string>("");
  const { balance: erc20Balance, refetchBalance: refetchErc20Balance } =
    useErc20Balance(erc20TokenAddress);
  const { balance: csrErc20Balance, refetchBalance: refetchCsrErc20Balance } =
    useErc20Balance(csrErc20TokenAddress);
  const [amountError, setAmountError] = useState<string>("");
  const {
    wrapErc20,
    loading: wrappingInProgress,
    gasEstimate: wrapGasEstimate,
  } = useWrapErc20(csrErc20TokenAddress, erc20TokenAddress);
  const {
    unwrapErc20,
    loading: unwrappingInProgress,
    gasEstimate: unwrapGasEstimate,
  } = useUnwrapErc20(csrErc20TokenAddress);
  const allowance = useErc20Allowance(erc20TokenAddress, csrErc20TokenAddress);
  const erc20Info = useErc20Info(erc20TokenAddress);
  const price = useTokenPrice(erc20TokenAddress);

  const validateAmount = useCallback(
    (value: string, mode: OperationMode) => {
      const numValue = parseFloat(value);
      const maxAmount = mode === "wrap" ? erc20Balance : csrErc20Balance;
      if (maxAmount === null) {
        return;
      }

      if (numValue <= 0) {
        setAmountError("Amount must be greater than 0");
      } else if (numValue > parseFloat(maxAmount)) {
        setAmountError("Amount cannot be more than your balance");
      } else {
        setAmountError("");
      }
    },
    [erc20Balance, csrErc20Balance, setAmountError]
  );

  const handleAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, mode: OperationMode): void => {
      const newAmount = e.target.value;
      setAmount(newAmount);
      validateAmount(newAmount, mode);
    },
    [validateAmount, setAmount]
  );

  const onSubmit = useCallback(
    async (mode: OperationMode): Promise<void> => {
      await (mode === "wrap" ? wrapErc20(amount) : unwrapErc20(amount));
      await Promise.allSettled([
        refetchErc20Balance(),
        refetchCsrErc20Balance(),
      ]);
    },
    [
      wrapErc20,
      unwrapErc20,
      amount,
      refetchErc20Balance,
      refetchCsrErc20Balance,
    ]
  );

  const setMaxAmount = useCallback(
    (mode: OperationMode) => {
      const maxAmount = mode === "wrap" ? erc20Balance : csrErc20Balance;
      setAmount(maxAmount || "");
    },
    [erc20Balance, csrErc20Balance]
  );

  return (
    <WrappingUnwrappingPageView
      amount={amount}
      handleAmountChange={handleAmountChange}
      setMaxAmount={setMaxAmount}
      onSubmit={onSubmit}
      loading={wrappingInProgress || unwrappingInProgress || allowance === null}
      amountError={amountError}
      tokenBalance={erc20Balance}
      csrTokenBalance={csrErc20Balance}
      wrapGasEstimate={wrapGasEstimate}
      unwrapGasEstimate={unwrapGasEstimate}
      price={price}
      symbol={erc20Info?.symbol}
      requiresApproval={allowance === BigInt("0")}
      csrTokenAddress={csrErc20TokenAddress}
      tokenAddress={erc20TokenAddress}
    />
  );
};

export default withTokenAddresses(WrappingUnwrappingErc20Page);
