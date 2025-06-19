import React from "react";
import StreakCounter from "./StreakCounter";

// PUBLIC_INTERFACE
function Navbar({ onLogoClick, showBack, onBack, streak }) {
  return (
    <nav className="navbar td-navbar fixed top-0 left-0 right-0 w-full z-20 bg-td-bg shadow td-navbar-glow transition-shadow">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              aria-label="Back"
              className="td-btn-icon text-2xl text-td-accent focus:outline-none mr-1 transition-transform hover:scale-105"
              onClick={onBack}
              style={{ paddingRight: 6, background: "none", border: "none" }}
            >
              <span aria-hidden="true" className="transition-colors">&#8592;</span>
            </button>
          )}
          <span
            className="logo td-logo text-xl font-semibold cursor-pointer select-none tracking-wide text-td-accent transition-colors"
            onClick={onLogoClick}
            aria-label="Go to home"
          >
            <span className="logo-symbol text-3xl align-middle">🧘</span> Thought Detox
          </span>
        </div>
        <StreakCounter streak={streak} />
      </div>
    </nav>
  );
}

export default Navbar;
