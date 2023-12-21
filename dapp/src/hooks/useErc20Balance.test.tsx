import { renderHook, waitFor } from "@testing-library/react";
import { ReactElement } from "react";
import { WalletContext } from "../context/WalletContext";
import useErc20Balance from "./useErc20Balance";
import {
  CsrCanto__factory as CsrCantoContractFactory,
  CsrERC20__factory as CsrErc20ContractFactory,
} from "../abis";

describe("useErc20Balance", () => {
  test("should return the correct token balance", async () => {
    const contractInstance = {
      balanceOf: jest.fn().mockResolvedValue("2000000000000000000"),
    };

    jest
      .spyOn(CsrCantoContractFactory, "connect")
      .mockReturnValue(contractInstance as any);
    jest
      .spyOn(CsrErc20ContractFactory, "connect")
      .mockReturnValue(contractInstance as any);

    const mockedProvider = {
      getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
    } as any;

    const wrapper = ({ children }: { children: ReactElement }) => (
      <WalletContext.Provider
        value={{ address: "0x123", provider: mockedProvider } as any}
      >
        {children}
      </WalletContext.Provider>
    );

    const { result } = renderHook(() => useErc20Balance("0xTokenAddress"), {
      wrapper,
    });

    expect(result.current.balance).toBe(null);
    await waitFor(() => expect(result.current.balance).toBe("2.0"));
  });
});
