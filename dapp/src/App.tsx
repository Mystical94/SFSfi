import { FC, Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { darkTheme, lightTheme } from "./theme";
import { Layout } from "./Layout";
import { ThemeProvider, useThemeContext } from "./context/ThemeContext";
import { WalletProvider } from "./context/WalletContext";
import { ErrorProvider } from "./context/StatusContext";
import lazyWithPreload from "./lib/lazyWithPreload";
import WrappingUnwrappingCantoPage from "./pages/WrappingUnwrappingCantoPage";
import CreateCsrErc20Page from "./pages/CreateCsrErc20Page";
import WrappingUnwrappingErc20Page from "./pages/WrappingUnwrappingErc20Page";
import {
  ClaimRewardsCantoPage,
  ClaimRewardsErc20Page,
} from "./pages/ClaimRewardsPage";
import { PathId } from "./constants";

const FAQPage = lazyWithPreload(() => import("./pages/FAQPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        id: PathId.WrapCanto,
        path: "/",
        element: <WrappingUnwrappingCantoPage />,
      },
      {
        id: PathId.CantoClaim,
        path: "/claim",
        element: <ClaimRewardsCantoPage />,
      },
      {
        id: PathId.Faq,
        path: "/faq",
        element: <FAQPage />,
      },
      {
        id: PathId.Erc20Claim,
        path: "/csr-erc20/erc20/:erc20Address/claim",
        element: <ClaimRewardsErc20Page />,
      },
      {
        id: PathId.CsrErc20Claim,
        path: "/csr-erc20/:csrErc20Address/claim",
        element: <ClaimRewardsErc20Page />,
      },
      {
        id: PathId.CsrErc20Create,
        path: "/csr-erc20",
        element: <CreateCsrErc20Page />,
      },
      {
        id: PathId.Erc20Wrap,
        path: "/csr-erc20/erc20/:erc20Address",
        element: <WrappingUnwrappingErc20Page />,
      },
      {
        id: PathId.CsrErc20Wrap,
        path: "/csr-erc20/:csrErc20Address",
        element: <WrappingUnwrappingErc20Page />,
      },
    ],
  },
]);

const AppContent: FC = () => {
  const { themeMode } = useThemeContext();

  return (
    <MuiThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </MuiThemeProvider>
  );
};

const App: FC = () => {
  useEffect(() => {
    (FAQPage as any).preload();
  }, []);

  return (
    <ErrorProvider>
      <WalletProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </WalletProvider>
    </ErrorProvider>
  );
};

export default App;
