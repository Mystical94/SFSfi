import { ChangeEvent, FC, useState } from "react";
import useCantoBalance from "../hooks/useCantoBalance";
import useCsrCantoBalance from "../hooks/useCsrCantoBalance";
import useWrapCanto from "../hooks/useWrapCanto";
import useUnwrapCanto from "../hooks/useUnwrapCanto";
import WrappingUnwrappingPageView from "../components/WrappingUnwrappingUi";
import { OperationMode } from "../lib/types";
import { useTokenPrice } from "../hooks/useTokenPrice";
import env from "../env";

const WrappingUnwrappingCantoPage: FC = () => {
  const { balance: cantoBalance, refetchBalance: refetchCantoBalance } =
    useCantoBalance();
  const { balance: csrCantoBalance, refetchBalance: refetchCsrCantoBalance } =
    useCsrCantoBalance();

  const { wrapCanto, loading: wrappingInProgress } = useWrapCanto();
  const { unwrapCanto, loading: unwrappingInProgress } = useUnwrapCanto();
  const [amount, setAmount] = useState<string>("");

  const [amountError, setAmountError] = useState<string>("");

  const cantoPrice = useTokenPrice(env.MAINNET.CONTRACTS.WCANTO);

  const { gasEstimate: wrapGasEstimate } = useWrapCanto();
  const { gasEstimate: unwrapGasEstimate } = useUnwrapCanto();

  const validateAmount = (value: string, mode: OperationMode) => {
    const numValue = parseFloat(value);
    const maxAmount = mode === "wrap" ? cantoBalance : csrCantoBalance;
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
  };

  const handleAmountChange = (
    e: ChangeEvent<HTMLInputElement>,
    mode: OperationMode
  ): void => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    validateAmount(newAmount, mode);
  };

  const onSubmit = async (mode: OperationMode): Promise<void> => {
    await (mode === "wrap" ? wrapCanto(amount) : unwrapCanto(amount));
    await Promise.allSettled([refetchCantoBalance(), refetchCsrCantoBalance()]);
  };

  const setMaxAmount = (mode: OperationMode) => {
    const maxAmount = mode === "wrap" ? cantoBalance : csrCantoBalance;
    setAmount(maxAmount || "");
  };

  const loading = wrappingInProgress || unwrappingInProgress;

  return (
    <WrappingUnwrappingPageView
      amount={amount}
      handleAmountChange={handleAmountChange}
      setMaxAmount={setMaxAmount}
      onSubmit={onSubmit}
      loading={loading}
      amountError={amountError}
      tokenBalance={cantoBalance}
      csrTokenBalance={csrCantoBalance}
      wrapGasEstimate={wrapGasEstimate}
      unwrapGasEstimate={unwrapGasEstimate}
      price={cantoPrice}
      symbol="CANTO"
      requiresApproval={false}
    />
  );
};

export default WrappingUnwrappingCantoPage;
