import {
  createContext,
  useState,
  useContext,
  useEffect,
  FC,
  ReactElement,
  useCallback,
  useMemo,
} from "react";
import { ContractTransaction, ethers } from "ethers";
import env from "../env";
import { useStatusContext } from "./StatusContext";

type WalletContextType = {
  signer: ethers.Signer | null;
  provider: ethers.BrowserProvider | null;
  defaultMainnetProvider: ethers.JsonRpcProvider;
  defaultProvider: ethers.JsonRpcProvider;
  address: string | null;
  connectWallet: () => Promise<void>;
  checkAndSwitchToCanto: () => Promise<void>;
  sendTransaction: (
    populatedTx: ContractTransaction,
    inProgressMsg: string,
    successMsg: string
  ) => Promise<string | null>;
  isCorrectNetwork: boolean | null;
};

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export const WalletProvider: FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean | null>(
    null
  );
  const { setStatus, resetStatus } = useStatusContext();

  const handleNewProvider = useCallback(async () => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const providerNetwork = await newProvider.getNetwork();
      if (providerNetwork.chainId.toString() === env.CHAIN.ID.toString()) {
        setProvider(newProvider);
      } else {
        setProvider(null);
      }
    }
  }, [setProvider]);

  const handleChainChanged = useCallback(
    (newChainId: string) => {
      setIsCorrectNetwork(parseInt(newChainId, 16) === env.CHAIN.ID);
      handleNewProvider();
    },
    [setIsCorrectNetwork]
  );

  useEffect(() => {
    handleNewProvider();
  }, [setProvider]);

  useEffect(() => {
    const handleAccountsChanged = (newAccounts: string[]) => {
      setAddress(newAccounts[0]);
    };

    if (window.ethereum) {
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      // Clean up the event listener on component unmount
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [handleChainChanged, setProvider, setAddress]);

  useEffect(() => {
    if (!address || isCorrectNetwork === null) {
      return;
    }
    if (!isCorrectNetwork) {
      setStatus({
        msg: `You are connected to the wrong network. Please switch to the ${env.CHAIN.NAME}.`,
        severity: "error",
        duration: null,
      });
    }
    if (isCorrectNetwork) {
      resetStatus();
    }
  }, [isCorrectNetwork, address]);

  const checkAndSwitchToCanto = useCallback(async (): Promise<void> => {
    if (!window.ethereum) {
      alert("Please install MetaMask or another web3-enabled browser.");
      return;
    }

    const currentChainId = parseInt(window.ethereum.chainId, 10);
    if (currentChainId !== env.CHAIN.ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${env.CHAIN.ID.toString(16)}` }],
        });
      } catch (switchError) {
        if ((switchError as any).code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${env.CHAIN.ID.toString(16)}`,
                  chainName: env.CHAIN.NAME,
                  nativeCurrency: {
                    name: "Canto",
                    symbol: "CANTO",
                    decimals: 18,
                  },
                  rpcUrls: env.CHAIN.RPC_URL,
                  blockExplorerUrls: env.CHAIN.EXPLORER_URL,
                },
              ],
            });
          } catch (addError) {
            console.error("Failed to add Canto Testnet:", addError);
          }
        } else {
          console.error("Failed to switch to Canto Testnet:", switchError);
        }
      }
    }
  }, [window.ethereum]);

  const connectWallet = async (): Promise<void> => {
    if (!window.ethereum) {
      alert(
        "Please install a web3-enabled browser like MetaMask to use this feature."
      );
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
      const newSigner = await newProvider.getSigner();
      setSigner(newSigner);
      const { chainId } = await newProvider.getNetwork();
      handleChainChanged(chainId.toString(16));
      await checkAndSwitchToCanto();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const sendTransaction = useCallback(
    async (
      populatedTx: ContractTransaction,
      inProgressMsg: string,
      successMsg: string
    ) => {
      await checkAndSwitchToCanto();
      if (!signer) {
        // In theory this should never happen, but just in case
        setStatus({
          msg: "Please connect your wallet first.",
          severity: "error",
        });
        return null;
      }
      const tx = await signer.sendTransaction(populatedTx);
      const explorerLink = `${env.CHAIN.EXPLORER_URL[0]}/tx/${tx.hash}`;
      setStatus({
        msg: inProgressMsg,
        severity: "info",
        link: explorerLink,
        linkText: "View on Tuber",
        duration: null,
      });
      await tx.wait();
      setStatus({
        msg: successMsg,
        severity: "success",
        link: explorerLink,
        linkText: "View on Tuber",
      });
      return tx.hash;
    },
    [signer]
  );

  const defaultMainnetProvider = useMemo(
    () =>
      new ethers.JsonRpcProvider(env.MAINNET.CHAIN.RPC_URL[0], {
        name: env.MAINNET.CHAIN.NAME,
        chainId: env.MAINNET.CHAIN.ID,
      }),
    []
  );

  const defaultProvider = useMemo(
    () =>
      new ethers.JsonRpcProvider(env.CHAIN.RPC_URL[0], {
        name: env.CHAIN.NAME,
        chainId: env.CHAIN.ID,
      }),
    []
  );

  return (
    <WalletContext.Provider
      value={{
        signer,
        provider,
        address,
        connectWallet,
        checkAndSwitchToCanto,
        defaultMainnetProvider,
        isCorrectNetwork,
        sendTransaction,
        defaultProvider,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};
