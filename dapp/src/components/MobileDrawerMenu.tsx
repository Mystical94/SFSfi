import {
  Drawer,
  IconButton,
  List,
  useTheme,
  ListItemIcon,
  ListItemText,
  Box,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { FC, useState } from "react";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoImg from "../static/logo.png";
import FooterItems from "./FooterItems";
import { useThemeContext } from "../context/ThemeContext";
import ChatBot from "./Chatbot";

const MobileDrawerMenu: FC = () => {
  const theme = useTheme();
  const { toggleTheme, themeMode } = useThemeContext();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon htmlColor={theme.palette.text.primary} />
      </IconButton>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div>
          <List>
            <Box textAlign="center" py={2}>
              <Link to="/">
                <img src={LogoImg} alt="Logo" height="40" />
              </Link>
            </Box>
            <ListItemButton onClick={toggleTheme}>
              <ListItemIcon>
                {themeMode === "light" ? (
                  <DarkModeIcon htmlColor={theme.palette.text.primary} />
                ) : (
                  <LightModeIcon />
                )}
              </ListItemIcon>
              <ListItemText primary="Theme" />
            </ListItemButton>
            <ListItemButton component={Link} to={"/faq"}>
              <ListItemIcon>
                <QuestionMarkIcon />
              </ListItemIcon>
              <ListItemText primary="FAQ" />
            </ListItemButton>
          </List>
        </div>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ padding: "5px" }}>
          <ChatBot />
          <FooterItems />
        </Box>
      </Drawer>
    </>
  );
};

export default MobileDrawerMenu;
