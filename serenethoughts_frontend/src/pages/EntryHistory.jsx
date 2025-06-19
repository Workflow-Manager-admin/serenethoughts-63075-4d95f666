import React, { useState } from "react";
import ButtonPrimary from "../components/ButtonPrimary";
import ConfirmationModal from "../components/ConfirmationModal";

// PUBLIC_INTERFACE
/**
 * EntryHistory page
 * - Lists all entries in 'thoughtDetoxEntries' from localStorage or via prop.
 * - For each entry, shows formatted date and first 1–2 lines snippet.
 * - Expands entry to full text on click.
 * - "Clear History" button shows modal confirmation, deletes all entries on confirm.
 */
function EntryHistory({ entries: propEntries, onDelete, onBack }) {
  // Use prop if given, else query localStorage ('thoughtDetoxEntries')
  const getStoredEntries = () => {
    let arr = [];
    try {
      const raw = localStorage.getItem("thoughtDetoxEntries");
      if (raw) {
        arr = JSON.parse(raw);
        if (!Array.isArray(arr)) arr = [];
      }
    } catch (e) {
      arr = [];
    }
    return arr;
  };

  // Actual source of truth is thoughtDetoxEntries from localStorage
  const [entries, setEntries] = useState(propEntries && propEntries.length ? propEntries : getStoredEntries());
  const [expanded, setExpanded] = useState({}); // id -> expanded bool
  const [clearModal, setClearModal] = useState(false);

  // Expand/collapse entry by id
  const handleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle clear history
  const handleClearHistory = () => setClearModal(true);

  const handleConfirmClear = () => {
    localStorage.setItem("thoughtDetoxEntries", JSON.stringify([]));
    setEntries([]);
    setClearModal(false);
    // Optionally: propagate to parent entries state too
    if (typeof onDelete === "function") {
      // hint: parent could handle all deletion if needed
      // onDelete(null, { clearAll: true });
    }
  };

  const handleCancelClear = () => setClearModal(false);

  // Helper: format ISO date (YYYY-MM-DDTHH:MM...) to readable
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

  // Helper: Get first 2 lines snippet (or first 90 chars if no lines)
  function getSnippet(text) {
    if (!text) return "";
    const lines = text.split(/\r?\n/);
    let snippet = lines.slice(0, 2).join(" ");
    if (snippet.length > 90) snippet = snippet.substring(0, 88) + "…";
    return snippet;
  }

  return (
    <section className="container mx-auto max-w-2xl animate-fade-in flex flex-col pt-2">
      <ConfirmationModal
        open={clearModal}
        onCancel={handleCancelClear}
        onConfirm={handleConfirmClear}
        title="Clear History?"
        description="Are you sure? This will delete ALL your journal entries forever."
      />
      <div className="flex items-center justify-between mb-4 gap-2">
        <ButtonPrimary className="" onClick={onBack}>
          &larr; Back
        </ButtonPrimary>
        {entries.length > 0 && (
          <ButtonPrimary
            className="bg-td-btn-cancel text-td-warn px-4 py-2 ml-auto"
            onClick={handleClearHistory}
          >
            Clear History
          </ButtonPrimary>
        )}
      </div>
      <h2 className="font-semibold text-2xl text-td-accent mb-4">Journal History</h2>
      {entries.length === 0 ? (
        <div className="text-td-muted text-base mt-12 text-center animate-fade-in-slow">
          No entries to display.
        </div>
      ) : (
        <ul className="flex flex-col gap-3 mt-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className={
                "bg-td-card border border-td-border px-5 py-4 rounded-md shadow animate-soft-in cursor-pointer hover:bg-td-bg-dark/40 transition" +
                (expanded[entry.id] ? " border-td-accent shadow-md" : "")
              }
              tabIndex={0}
              aria-expanded={!!expanded[entry.id]}
              onClick={() => handleExpand(entry.id)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") handleExpand(entry.id);
              }}
              style={{ outline: expanded[entry.id] ? "2px solid var(--td-accent)" : "none" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-td-muted select-none">{formatDate(entry.timestamp)}</span>
                <span className="flex-1 text-base font-semibold text-td-text-soft truncate">
                  {expanded[entry.id]
                    ? <span style={{ color: "var(--td-accent)", fontWeight: 500 }}>Expanded</span>
                    : ""}
                </span>
                <span
                  className={
                    "transition-transform ml-2 text-td-accent font-bold select-none" +
                    (expanded[entry.id] ? " rotate-90" : "")
                  }
                  style={{ fontSize: 18 }}
                  aria-hidden="true"
                >
                  &gt;
                </span>
              </div>
              <div className="mt-2 transition-all text-td-text-soft" style={{
                whiteSpace: "pre-line",
                maxHeight: expanded[entry.id] ? undefined : "2.5em",
                overflow: expanded[entry.id] ? "visible" : "hidden",
                fontWeight: 400,
              }}>
                {expanded[entry.id]
                  ? (entry.text || entry.body)
                  : getSnippet(entry.text || entry.body)}
              </div>
            </li>
          ))}
        </ul>
      )}
      <style>{`
        li[aria-expanded="true"] {
          background: #edfff5;
        }
        li[aria-expanded] {
          transition: background 0.17s, border 0.18s;
        }
      `}</style>
    </section>
  );
}

export default EntryHistory;
