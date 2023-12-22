import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import StatusSnackbar from "./components/StatusSnackbar";
// import Footer from "./components/Footer";
import TermsAndConditionsDialog from "./components/TermsAndConditionsDialog";

export const Layout: FC = () => {
  return (
    <div>
      <TermsAndConditionsDialog />
      <StatusSnackbar />
      <Header />
      <Outlet />
    </div>
  );
};
