import { act, renderHook } from "@testing-library/react";
import { ReactElement } from "react";
import { WalletContext } from "../context/WalletContext";
import useClaimRewards from "./useClaimRewards";
import {
  CsrCanto__factory as CsrCantoContractFactory,
  CsrERC20__factory as CsrErc20ContractFactory,
} from "../abis";

describe("useClaimRewards", () => {
  test("should claim rewards successfully", async () => {
    const contractInstance = {
      claim: {
        estimateGas: jest.fn().mockResolvedValue(100000),
        populateTransaction: jest.fn(),
      },
    };
    jest
      .spyOn(CsrCantoContractFactory, "connect")
      .mockReturnValue(contractInstance as any);
    jest
      .spyOn(CsrErc20ContractFactory, "connect")
      .mockReturnValue(contractInstance as any);

    const mockedSigner = {
      getAddress: jest.fn().mockResolvedValue("0x123"),
    } as any;

    const sendTransactionMock = jest.fn();

    const wrapper = ({ children }: { children: ReactElement }) => (
      <WalletContext.Provider
        value={
          { signer: mockedSigner, sendTransaction: sendTransactionMock } as any
        }
      >
        {children}
      </WalletContext.Provider>
    );

    const { result } = renderHook(() => useClaimRewards("0x123"), { wrapper });

    await act(async () => {
      await result.current.claimRewards();
    });
    expect(sendTransactionMock).toHaveBeenCalled();
  });
});
