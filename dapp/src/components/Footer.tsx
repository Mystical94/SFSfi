import { FC } from "react";
import { AppBar, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { useThemeContext } from "../context/ThemeContext";
import FooterItems from "./FooterItems";
import Chatbot from "./Chatbot";

const Footer: FC = () => {
  const { themeMode } = useThemeContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return isMobile ? null : (
    <>
      <div style={{ marginBottom: "64px" }} />
      <Chatbot />
      <AppBar
        component="footer"
        position="fixed"
        color={themeMode === "light" ? "transparent" : "primary"}
        sx={{ top: "auto", bottom: 0 }}
      >
        <Toolbar>
          <FooterItems />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Footer;
