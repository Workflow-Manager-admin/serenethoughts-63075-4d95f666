import React from "react";

// PUBLIC_INTERFACE
/**
 * StreakCounter: Updated for soft, rounded, pastel badge and balanced layout.
 */
function StreakCounter({ streak }) {
  return (
    <div
      className="flex items-center gap-2 text-[1.01rem] leading-none text-td-accent bg-td-streak px-4 py-[0.55em] rounded-full shadow-inner select-none opacity-95 animate-fade-in font-semibold border border-[var(--td-border)]"
      title="Your current journaling streak"
      style={{
        letterSpacing: "0.011em",
        minHeight: 32,
        boxShadow: "0 2px 6px -3px #319b8740",
        fontFamily: "Inter, Roboto, Arial, sans-serif"
      }}
    >
      <span aria-label="Fire" className="text-[1.36em] -ml-1 select-none" style={{color: "#fa9b4b", marginRight: 2}}>🔥</span>
      <span className="font-bold text-td-accent">{streak}</span>
      <span className="font-medium" style={{color: "var(--td-muted)", marginLeft: 2}}>
        day{streak === 1 ? "" : "s"} streak
      </span>
    </div>
  );
}

export default StreakCounter;
