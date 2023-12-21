import { renderHook, waitFor } from "@testing-library/react";
import { ReactElement } from "react";
import { WalletContext } from "../context/WalletContext";
import useRewardsAmount from "./useRewardsAmount";
import {
  CsrCanto__factory as CsrCantoContractFactory,
  CsrERC20__factory as CsrErc20ContractFactory,
} from "../abis";

describe("useRewardsAmount", () => {
  test("should fetch the correct rewards amount", async () => {
    const contractInstance = {
      getAmountClaimable: jest.fn().mockResolvedValue("1000000000000000000"),
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

    const { result } = renderHook(() => useRewardsAmount("0x123"), {
      wrapper,
    });

    expect(result.current.rewards).toBe(null);

    await waitFor(() => expect(result.current.rewards).toBe("1.0"));
  });
});
