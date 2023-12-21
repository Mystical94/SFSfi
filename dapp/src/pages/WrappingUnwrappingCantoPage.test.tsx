import { render, screen, fireEvent } from "@testing-library/react";
import { FC } from "react";
import WrappingUnwrappingPage from "./WrappingUnwrappingCantoPage";
import useCantoBalance from "../hooks/useCantoBalance";
import useCsrCantoBalance from "../hooks/useCsrCantoBalance";
import useWrapCanto from "../hooks/useWrapCanto";
import useUnwrapCanto from "../hooks/useUnwrapCanto";
import { useTokenPrice } from "../hooks/useTokenPrice";
import { useWalletContext } from "../context/WalletContext";

jest.mock("../hooks/useCantoBalance");
jest.mock("../hooks/useCsrCantoBalance");
jest.mock("../hooks/useWrapCanto");
jest.mock("../hooks/useUnwrapCanto");
jest.mock("../hooks/useTokenPrice");
jest.mock("../context/WalletContext");

describe("WrappingUnwrappingPage", () => {
  const MockedWrappingUnwrappingPage: FC = () => {
    (useCantoBalance as jest.Mock).mockReturnValue({
      balance: "100",
      refetchBalance: jest.fn(),
    });

    (useCsrCantoBalance as jest.Mock).mockReturnValue({
      balance: "50",
      refetchBalance: jest.fn(),
    });

    (useWrapCanto as jest.Mock).mockReturnValue({
      wrapCanto: jest.fn(),
      loading: false,
    });

    (useUnwrapCanto as jest.Mock).mockReturnValue({
      unwrapCanto: jest.fn(),
      loading: false,
    });

    (useWalletContext as jest.Mock).mockReturnValue({
      address: "0x123",
    });

    (useTokenPrice as jest.Mock).mockReturnValue(10);

    return <WrappingUnwrappingPage />;
  };

  test("renders the page with correct content", async () => {
    render(<MockedWrappingUnwrappingPage />);

    expect(screen.getByText("Wrap & Unwrap")).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(screen.getAllByText("Wrap").length).toEqual(2);
    expect(screen.getByText("Unwrap")).toBeInTheDocument();
  });

  test("clicking 'Wrap' and 'Unwrap' toggles the button text", async () => {
    render(<MockedWrappingUnwrappingPage />);

    const wrapButton = screen.getAllByText("Wrap")[0];
    const unwrapButton = screen.getByText("Unwrap");

    fireEvent.click(unwrapButton);
    expect(screen.getAllByText("Unwrap").length).toEqual(2);

    fireEvent.click(wrapButton);
    expect(screen.getAllByText("Wrap").length).toEqual(2);
  });
});
