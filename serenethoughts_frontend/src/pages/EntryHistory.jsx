import React, { useState } from "react";
import ButtonPrimary from "../components/ButtonPrimary";
import ConfirmationModal from "../components/ConfirmationModal";

// PUBLIC_INTERFACE
/**
 * EntryHistory page (refactored for full extracted design conformance)
 * - Clean, soft, minimal UI for listing entries.
 * - Fully responsive; accent color for highlights, rounded corners, subtle expand/collapse.
 */
function EntryHistory({ entries: propEntries, onDelete, onBack }) {
  // Prefer prop entries if provided, else fallback to localStorage.
  const getStoredEntries = () => {
    let arr = [];
    try {
      const raw = localStorage.getItem("thoughtDetoxEntries");
      if (raw) {
        arr = JSON.parse(raw);
        if (!Array.isArray(arr)) arr = [];
      }
    } catch {
      arr = [];
    }
    return arr;
  };

  const [entries, setEntries] = useState(propEntries && propEntries.length ? propEntries : getStoredEntries());
  const [expanded, setExpanded] = useState({});
  const [clearModal, setClearModal] = useState(false);

  // Expand/collapse entry on click or keyboard.
  const handleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Clear history modal
  const handleClearHistory = () => setClearModal(true);
  const handleConfirmClear = () => {
    localStorage.setItem("thoughtDetoxEntries", JSON.stringify([]));
    setEntries([]);
    setClearModal(false);
    if (typeof onDelete === "function") {
      // Optionally notify parent if desired.
    }
  };
  const handleCancelClear = () => setClearModal(false);

  // Helper: format date consistently with calm, subtle style
  function formatDate(iso) {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    } catch {
      return iso;
    }
  }

  // Helper: get snippet for preview lines.
  function getSnippet(text) {
    if (!text) return "";
    const lines = text.split(/\r?\n/);
    let snippet = lines.slice(0, 2).join(" ");
    if (snippet.length > 88) snippet = snippet.substring(0, 86) + "…";
    return snippet;
  }

  return (
    <section
      className="container mx-auto max-w-2xl animate-fade-in flex flex-col items-center pt-2"
      style={{
        minHeight: "66vh",
        width: "100%",
        justifyContent: "center"
      }}
    >
      <ConfirmationModal
        open={clearModal}
        onCancel={handleCancelClear}
        onConfirm={handleConfirmClear}
        title="Clear History?"
        description="Are you sure? This will delete ALL your journal entries forever."
      />
      <div className="flex items-center justify-between gap-2 w-full max-w-2xl mb-6 mt-2">
        <ButtonPrimary className="px-5 py-2" onClick={onBack}>
          ← Back
        </ButtonPrimary>
        {entries.length > 0 && (
          <ButtonPrimary
            className="bg-td-btn-cancel text-td-warn px-5 py-2 rounded-lg shadow-none"
            onClick={handleClearHistory}
            style={{
              fontWeight: 500,
              fontSize: "1.04rem",
              border: "1.5px solid var(--td-border)"
            }}
          >
            Clear History
          </ButtonPrimary>
        )}
      </div>
      <h2
        className="font-bold text-2xl md:text-3xl text-td-accent mb-5 text-center animate-fade-in"
        style={{
          letterSpacing: "0.018em",
          fontFamily: "Inter,Roboto,sans-serif"
        }}
      >
        Journal History
      </h2>
      {entries.length === 0 ? (
        <div className="text-td-muted text-[1.11rem] mt-14 text-center animate-fade-in-slow font-medium">
          No entries to display.
        </div>
      ) : (
        <ul className="flex flex-col gap-4 w-full max-w-2xl mt-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className={
                "bg-td-card border px-5 py-5 rounded-xl shadow animate-soft-in cursor-pointer group transition-all duration-200 relative"
                + (expanded[entry.id]
                  ? " border-td-accent shadow-md"
                  : " border-td-border hover:bg-td-bg-dark/55")
              }
              tabIndex={0}
              aria-expanded={!!expanded[entry.id]}
              aria-label={expanded[entry.id] ? "Collapse entry" : "Expand entry for details"}
              onClick={() => handleExpand(entry.id)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") handleExpand(entry.id);
              }}
              style={{
                outline: expanded[entry.id] ? "2px solid var(--td-accent)" : "none",
                transition: "outline .16s, box-shadow .16s, background .19s"
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-td-muted select-none" style={{fontWeight: 500}}>
                  {formatDate(entry.timestamp)}
                </span>
                <span className="flex-1 text-base font-semibold text-td-text-soft truncate" style={{
                  color: expanded[entry.id] ? "var(--td-accent-dark)" : "var(--td-muted)",
                  textAlign: "right",
                  fontWeight: 500
                }}>
                  {expanded[entry.id] ? "Full Entry" : ""}
                </span>
                <span
                  className={
                    "transition-transform ml-2 text-td-accent font-bold select-none group-hover:scale-120"
                    + (expanded[entry.id] ? " rotate-90" : "")
                  }
                  style={{
                    fontSize: "1.32em",
                    transition: "transform 0.19s",
                    color: "var(--td-accent)"
                  }}
                  aria-hidden="true"
                >
                  &gt;
                </span>
              </div>
              <div className="mt-2 transition-all text-td-text-soft text-[1.1rem] font-normal leading-relaxed" style={{
                whiteSpace: "pre-line",
                maxHeight: expanded[entry.id] ? undefined : "2.8em",
                overflow: expanded[entry.id] ? "visible" : "hidden",
                fontWeight: 400,
                color: expanded[entry.id]
                  ? "var(--td-text)"
                  : "var(--td-text-soft)"
              }}>
                {expanded[entry.id]
                  ? (entry.text || entry.body)
                  : getSnippet(entry.text || entry.body)}
              </div>
              {expanded[entry.id] && (
                <div className="absolute right-5 top-5 flex items-center gap-2 opacity-80 pointer-events-none text-sm text-td-accent-dark font-medium animate-fade-in-fast">
                  Expanded
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <style>{`
        li[aria-expanded="true"] {
          background: #edfff5;
        }
        li[aria-expanded] {
          transition: background 0.2s, border 0.2s;
        }
        li[aria-expanded="true"] .text-td-text-soft {
          color: var(--td-text) !important;
        }
        li:focus-visible {
          outline: 2.2px solid var(--td-accent);
          outline-offset: 1.5px;
        }
      `}</style>
    </section>
  );
}

export default EntryHistory;
