import { renderHook, act } from "@testing-library/react";
import { ReactElement } from "react";
import { WalletContext } from "../context/WalletContext";
import useUnwrapCanto from "./useUnwrapCanto";
import { CsrCanto__factory as CsrCantoContractFactory } from "../abis";

describe("useUnwrapCanto", () => {
  test("should unwrap Canto successfully", async () => {
    const contractInstance = {
      withdraw: {
        estimateGas: jest.fn().mockResolvedValue(100000),
        populateTransaction: jest.fn(),
      },
    };

    jest
      .spyOn(CsrCantoContractFactory, "connect")
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

    const { result } = renderHook(() => useUnwrapCanto(), { wrapper });

    await act(async () => {
      await result.current.unwrapCanto("1");
    });

    expect(sendTransactionMock).toHaveBeenCalled();
  });
});
