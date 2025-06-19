import React, { createContext, useContext, useEffect, useState } from "react";

// PUBLIC_INTERFACE
/**
 * ThemeContext - provides 'theme' and 'toggleTheme' for light/dark switching, persisted via localStorage.
 */
const ThemeContext = createContext();

/**
 * Returns current theme and setter.
 */
export function useTheme() {
  return useContext(ThemeContext);
}

// PUBLIC_INTERFACE
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      // Check saved user theme or use browser preference
      const stored = localStorage.getItem("td_theme");
      if (stored === "light" || stored === "dark") return stored;
      // Use prefers-color-scheme if no preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  // Apply theme attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("td_theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  const value = { theme, toggleTheme };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
