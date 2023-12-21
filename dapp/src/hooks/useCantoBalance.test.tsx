import { renderHook, waitFor } from "@testing-library/react";
import { ReactElement } from "react";
import { WalletContext } from "../context/WalletContext";
import useCantoBalance from "./useCantoBalance";

describe("useCantoBalance", () => {
  test("should return the correct balance", async () => {
    const mockedProvider = {
      getBalance: jest.fn().mockResolvedValue("1000000000000000000"),
    } as any;

    const wrapper = ({ children }: { children: ReactElement }) => (
      <WalletContext.Provider
        value={{ provider: mockedProvider, address: "0x123" } as any}
      >
        {children}
      </WalletContext.Provider>
    );

    const { result } = renderHook(() => useCantoBalance(), { wrapper });

    expect(result.current.balance).toBe(null);
    await waitFor(() => expect(result.current.balance).toBe("1.0"));
  });
});
