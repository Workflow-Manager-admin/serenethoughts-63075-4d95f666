import React from "react";

// PUBLIC_INTERFACE
function StreakCounter({ streak }) {
  return (
    <div
      className="flex items-center gap-2 text-xs text-td-accent bg-td-streak px-3 py-1 rounded-2xl shadow-inner select-none opacity-90 animate-fade-in"
      title="Your current journaling streak"
    >
      <span aria-label="Fire" className="text-base -ml-1 select-none">🔥</span>
      <span className="font-semibold">{streak}</span>
      <span>day{streak === 1 ? "" : "s"} streak</span>
    </div>
  );
}

export default StreakCounter;
