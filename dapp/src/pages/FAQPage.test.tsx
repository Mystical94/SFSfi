import { render, screen } from "@testing-library/react";
import FAQPage from "./FAQPage";

describe("FAQPage", () => {
  it("renders the page title", () => {
    render(<FAQPage />);
    expect(screen.getByText(/FAQ/i)).toBeInTheDocument();
  });

  // Add more tests as needed
});
