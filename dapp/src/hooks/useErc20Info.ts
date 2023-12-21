import { useEffect, useState } from "react";
import useGetErc20Info from "./useGetErc20Info";
import { DeployedContract } from "../lib/types";

const useErc20Info = (address?: string): DeployedContract | null => {
  const [erc20Info, setErc20Info] = useState<DeployedContract | null>(null);

  const { getErc20Info } = useGetErc20Info();

  useEffect(() => {
    if (!address) return;
    const func = async () => {
      const info = await getErc20Info(address);
      setErc20Info(info);
    };
    func();
  }, [getErc20Info, setErc20Info, address]);

  return erc20Info;
};

export default useErc20Info;
