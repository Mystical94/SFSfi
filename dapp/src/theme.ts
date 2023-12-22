import { createTheme } from "@mui/material";

const commonOptions = {
  typography: {
    fontFamily: "Inter, sans-serif",
  },
};

const darkTheme = createTheme({
  ...commonOptions,
  palette: {
    mode: "dark",
    primary: {
      main: "#FAFAFC",
    },
    secondary: {
      main: "#dffe00",
    },
    background: {
      default: "#211E28",
    },
    info: {
      main: "#2463EB",
    },
    success: {
      main: "#16A249",
    },
    warning: {
      main: "#DB7706",
    },
    error: {
      main: "#DC2828",
    },
  },
});

const lightTheme = createTheme({
  ...commonOptions,
  palette: {
    mode: "light",
    primary: {
      main: "#3F51B5",
    },
    secondary: {
      main: "#dffe00",
    },
    background: {
      default: "#F5F5F5",
    },
    info: {
      main: "#2463EB",
    },
    success: {
      main: "#16A249",
    },
    warning: {
      main: "#DB7706",
    },
    error: {
      main: "#DC2828",
    },
  },
});

export { lightTheme, darkTheme };
