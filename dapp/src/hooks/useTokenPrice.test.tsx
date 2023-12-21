import { renderHook, waitFor } from "@testing-library/react";
import { ReactElement } from "react";
import { WalletContext } from "../context/WalletContext";
import { useTokenPrice } from "./useTokenPrice";
import { BaseV1Router__factory as BaseV1RouterContractFactory } from "../abis";
import restoreAllMocks = jest.restoreAllMocks;

describe("useTokenPrice", () => {
  afterAll(() => {
    restoreAllMocks();
  });

  test("should fetch the correct token price", async () => {
    const contractInstance = {
      getAmountOut: jest.fn().mockResolvedValue({ amount: BigInt(2000000) }),
    };

    const mockedProvider = {
      getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
    } as any;

    jest
      .spyOn(BaseV1RouterContractFactory, "connect")
      .mockReturnValue(contractInstance as any);

    const wrapper = ({ children }: { children: ReactElement }) => (
      <WalletContext.Provider
        value={{ defaultMainnetProvider: mockedProvider } as any}
      >
        {children}
      </WalletContext.Provider>
    );

    const { result } = renderHook(() => useTokenPrice("0x123"), {
      wrapper,
    });

    expect(result.current).toBe(null);

    await waitFor(() => expect(result.current).toBe(20));
  });
});
