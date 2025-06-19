import React from "react";
import { useTheme } from "./ThemeContext";

// PUBLIC_INTERFACE
/**
 * Navbar with theme toggle button.
 */
function Navbar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="td-navbar-nav">
      <div className="td-navbar-content">
        <span className="td-navbar-title" tabIndex={0} aria-label="Thought Detox Home">
          <span className="td-navbar-logo" aria-hidden="true" style={{ marginRight: 8, fontSize: "1.35em", verticalAlign: "-0.06em" }}>🧠</span>
          Thought Detox
        </span>
        <span
          className="td-navbar-icon"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          tabIndex={0}
          onClick={toggleTheme}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleTheme();
          }}
          style={{
            cursor: "pointer",
            fontSize: "1.35em",
            marginLeft: 14,
            userSelect: "none"
          }}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          role="button"
        >
          <span aria-hidden="true">{theme === "dark" ? "🌞" : "🌗"}</span>
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
