import "fontsource-inter";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";

const container = document.getElementById("app-root")!;
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
