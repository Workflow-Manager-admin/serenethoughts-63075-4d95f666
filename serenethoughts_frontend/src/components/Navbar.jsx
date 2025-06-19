import React from "react";

// PUBLIC_INTERFACE
function Navbar() {
  return (
    <nav className="td-navbar-nav">
      <div className="td-navbar-content">
        <span className="td-navbar-title" tabIndex={0} aria-label="Thought Detox Home">
          <span className="td-navbar-logo" aria-hidden="true" style={{ marginRight: 8, fontSize: "1.35em", verticalAlign: "-0.06em" }}>🧠</span>
          Thought Detox
        </span>
        <span
          className="td-navbar-icon"
          aria-label="Settings/Dark mode (placeholder)"
          tabIndex={0}
          style={{
            cursor: "pointer",
            fontSize: "1.31em",
            marginLeft: 12,
            userSelect: "none"
          }}
        >
          ⚙️
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
