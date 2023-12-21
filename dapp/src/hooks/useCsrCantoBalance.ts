import useErc20Balance from "./useErc20Balance";
import env from "../env";

const useCsrCantoBalance = (): ReturnType<typeof useErc20Balance> => {
  return useErc20Balance(env.CONTRACTS.CSRCANTO);
};

export default useCsrCantoBalance;
