import { BrowserProvider } from "ethers";
import { getCsrContract } from "./getCsrContract";

const fetchHoldersData = async (
  provider: BrowserProvider,
  address: string,
  contractAddress: string
): Promise<boolean> => {
  try {
    // While its not require to differentiate here, it gives us nice type check
    const contract = getCsrContract(contractAddress, provider);
    return await contract.isClaimer(address);
  } catch (error) {
    console.error("Error fetching holders data:", error);
  }
  return false;
};

export default fetchHoldersData;
