import { Button, Typography, useTheme } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { FC } from "react";
import { useThemeContext } from "../context/ThemeContext";

const ThemeToggleButton: FC<{ hideText?: boolean }> = ({ hideText }) => {
  const theme = useTheme();
  const { toggleTheme, themeMode } = useThemeContext();

  return (
    <Typography color="text.primary">
      <Button
        variant="text"
        startIcon={
          themeMode === "light" ? (
            <DarkModeIcon htmlColor={theme.palette.text.primary} />
          ) : (
            <LightModeIcon />
          )
        }
        color={"inherit"}
        size="small"
        onClick={toggleTheme}
      >
        {!hideText ?? "Toggle Theme"}
      </Button>
    </Typography>
  );
};

export default ThemeToggleButton;
