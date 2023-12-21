// ThemeContext.tsx
import { createContext, useState, useContext, FC, ReactElement } from "react";

type ThemeContextType = {
  themeMode: "light" | "dark";
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const [themeMode, setThemeMode] = useState<"light" | "dark">(
    prefersDarkScheme ? "dark" : "light"
  );

  const toggleTheme = (): void => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
