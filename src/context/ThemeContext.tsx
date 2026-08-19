"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Theme, ColorMode } from "@/types";

interface ThemeContextType {
  theme: Theme;
  colorMode: ColorMode;
  setTheme: (theme: Theme) => void;
  setColorMode: (color: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  colorMode: "blue",
  setTheme: () => {},
  setColorMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [colorMode, setColorModeState] = useState<ColorMode>("blue");

  useEffect(() => {
    const savedTheme = localStorage.getItem("tm-theme") as Theme | null;
    const savedColor = localStorage.getItem("tm-color") as ColorMode | null;
    if (savedTheme) setThemeState(savedTheme);
    if (savedColor) setColorModeState(savedColor);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-color", colorMode);
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme, colorMode]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("tm-theme", t);
  };

  const setColorMode = (c: ColorMode) => {
    setColorModeState(c);
    localStorage.setItem("tm-color", c);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
