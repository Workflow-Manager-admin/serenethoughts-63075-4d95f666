import React from "react";
import { useTheme } from "./ThemeContext";

// PUBLIC_INTERFACE
/**
 * Navbar with theme toggle button and fully minimal, soft, visually consistent styling.
 */
function Navbar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="td-navbar-nav" role="navigation" aria-label="Main Navigation">
      <div className="td-navbar-content">
        <button
          className="td-navbar-title"
          tabIndex={0}
          aria-label="Thought Detox Home"
          style={{
            background: "none",
            border: "none",
            outline: "none",
            fontWeight: 700,
            fontSize: "1.22rem",
            color: "var(--td-accent)",
            letterSpacing: "0.013em",
            padding: 0,
            display: "flex",
            alignItems: "center",
            cursor: "pointer"
          }}
        >
          <span
            className="td-navbar-logo"
            aria-hidden="true"
            style={{
              marginRight: 8,
              fontSize: "1.48em",
              verticalAlign: "middle",
              lineHeight: 1,
              color: "var(--td-accent)"
            }}
          >
            🧘
          </span>
          Thought Detox
        </button>
        <button
          className="td-navbar-icon"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          tabIndex={0}
          type="button"
          onClick={toggleTheme}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleTheme();
          }}
          style={{
            cursor: "pointer",
            fontSize: "1.35em",
            marginLeft: 14,
            border: "none",
            background: "none",
            userSelect: "none",
            color: "var(--td-muted)"
          }}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span aria-hidden="true" style={{fontSize: "1.35em"}}>
            {theme === "dark" ? "🌞" : "🌓"}
          </span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
