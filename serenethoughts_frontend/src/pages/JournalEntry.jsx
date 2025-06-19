import React, { useState, useEffect } from "react";
import JournalCard from "../components/JournalCard";
import ConfirmationModal from "../components/ConfirmationModal";
import ButtonPrimary from "../components/ButtonPrimary";
import StreakCounter from "../components/StreakCounter";

/**
 * JournalEntry page — manages the lifecycle of the JournalCard and ConfirmationModal
 * Handles smooth state transitions for the "Shred It" UX flow,
 * clean layout, soft card, consistent feedback animation, and streak logic.
 * Fully aligned with serene minimal extracted design.
 *
 * Props:
 *  - onComplete(entryObj): callback to parent when journal "shredded"
 *  - onCancel(): cancels the session and returns to welcome
 */
function JournalEntry({ onComplete, onCancel }) {
  // Main entry content
  const [body, setBody] = useState("");
  // Visual interaction/transition state
  const [isShredded, setIsShredded] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [fading, setFading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  // Streak and journalEntries
  const [streak, setStreak] = useState(0);
  const [journalEntries, setJournalEntries] = useState([]);
  // Optional mood: placeholder for future expansion
  const [mood, setMood] = useState("");

  // STREAK LOGIC
  function computeStreak(entriesArr) {
    if (!Array.isArray(entriesArr) || entriesArr.length === 0) return 0;
    // Set of yyyy-mm-dd (unique days)
    const dateSet = new Set();
    for (const entry of entriesArr) {
      if (entry.timestamp) { dateSet.add(entry.timestamp.slice(0, 10)); }
    }
    const dates = [...dateSet].sort((a, b) => b.localeCompare(a)); // desc
    if (dates.length === 0) return 0;
    let streakCount = 0;
    let expected = new Date();
    for (let i = 0; i < dates.length; ++i) {
      const dStr = dates[i];
      const expectedStr = expected.toISOString().slice(0, 10);
      if (dStr === expectedStr) {
        streakCount++;
      } else {
        if (i === 0 && streakCount === 0) {
          expected.setDate(expected.getDate() - 1);
          const prevExpectStr = expected.toISOString().slice(0, 10);
          if (dStr === prevExpectStr) {
            streakCount++;
          } else break;
        } else {
          break;
        }
      }
      expected.setDate(expected.getDate() - 1);
    }
    return streakCount;
  }

  // LocalStorage keys
  const ENTRIES_KEY = "td_journal_entries";
  const DETOX_ENTRIES_KEY = "thoughtDetoxEntries";

  // On mount, load journalEntries and streak
  useEffect(() => {
    let data = [];
    try {
      const stored = localStorage.getItem(ENTRIES_KEY);
      if (stored) {
        data = JSON.parse(stored);
        if (!Array.isArray(data)) data = [];
      }
    } catch { data = []; }
    setJournalEntries(data);

    try {
      const detoxStored = localStorage.getItem(DETOX_ENTRIES_KEY);
      let detoxArr = [];
      if (detoxStored) {
        detoxArr = JSON.parse(detoxStored) || [];
        if (!Array.isArray(detoxArr)) detoxArr = [];
      }
      setStreak(computeStreak(detoxArr));
    } catch { setStreak(0); }
  }, []);

  // Auto-save journalEntries
  useEffect(() => {
    try {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(journalEntries));
    } catch {}
  }, [journalEntries]);

  // Listen for changes to streak in localStorage
  useEffect(() => {
    function handleStorageChange() {
      try {
        const arr = JSON.parse(localStorage.getItem(DETOX_ENTRIES_KEY));
        setStreak(computeStreak(arr || []));
      } catch { setStreak(0); }
    }
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 700);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Shred logic/animation
  const handleShred = (textValue) => {
    if (!textValue || !textValue.trim()) {
      return; // JournalCard handles feedback visually.
    }
    setInputDisabled(true);
    setFading(true);

    // Inline UUIDv4 generator (no deps)
    function generateUuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    // Animation: fade out, then check, then modal
    setTimeout(() => {
      setShowCheck(true);
      setTimeout(() => {
        setShowModal(true);
        setIsShredded(true);
        setShowCheck(false);
        // Save entry
        const trimmedText = textValue.trim();
        if (trimmedText.length > 0) {
          const id = generateUuid();
          const text = trimmedText;
          const timestamp = new Date().toISOString();
          const detoxEntry = { id, text, timestamp };
          try {
            let allEntries = [];
            const raw = localStorage.getItem(DETOX_ENTRIES_KEY);
            if (raw) {
              allEntries = JSON.parse(raw);
              if (!Array.isArray(allEntries)) allEntries = [];
            }
            allEntries.unshift(detoxEntry);
            localStorage.setItem(DETOX_ENTRIES_KEY, JSON.stringify(allEntries));
            setStreak(computeStreak(allEntries));
            if (allEntries.length === 7) {
              localStorage.setItem("td_seven_complete", "yes");
            }
          } catch { setStreak(0); }
          // For legacy/compat
          const entryObj = {
            id,
            body: trimmedText,
            mood,
            timestamp,
          };
          setJournalEntries(prev => [entryObj, ...prev]);
          // Notify parent if appropriate
          if (typeof onComplete === "function") {
            try {
              let allEntries = [];
              const raw = localStorage.getItem(DETOX_ENTRIES_KEY);
              if (raw) {
                allEntries = JSON.parse(raw);
                if (!Array.isArray(allEntries)) allEntries = [];
              }
              if (allEntries.length === 7) {
                onComplete(entryObj, { toCelebration: true });
              } else {
                onComplete(entryObj);
              }
            } catch {
              onComplete(entryObj);
            }
          }
        }
      }, 940);
    }, 370);
  };

  // Write more: reset UI after modal "write more"
  const handleWriteMore = () => {
    setShowModal(false);
    setInputDisabled(false);
    setBody("");
    setFading(false);
    setResetKey(k => k + 1);
    setIsShredded(false);
    setMood("");
  };

  // Done: go to history after modal
  const handleDone = () => {
    setShowModal(false);
    setInputDisabled(false);
    setBody("");
    setFading(false);
    setResetKey(k => k + 1);
    setIsShredded(false);
    setMood("");
    if (typeof onComplete === "function") {
      onComplete(null, { toHistory: true });
    }
  };

  // --- Render ---
  return (
    <section
      className="container mx-auto flex flex-col items-center justify-center pt-2 min-h-[65vh]"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 560,
      }}
    >
      {/* Streak badge */}
      <div className="w-full flex justify-center mb-6 animate-fade-in" style={{ minHeight: 34 }}>
        <StreakCounter streak={streak} />
      </div>
      {/* JournalCard w/ fade and check */}
      {!showModal && (
        <div
          key={resetKey}
          className={
            "w-full flex justify-center items-center transition-opacity duration-350 " +
            (fading ? "animate-soft-scale-out" : "animate-soft-in")
          }
        >
          <JournalCard
            value={body}
            onChange={e => setBody(e.target.value)}
            onShred={handleShred}
            textareaDisabled={inputDisabled}
            className=""
            showCheck={showCheck}
            onCheckAnimationEnd={() => setShowCheck(false)}
            onShake={() => {/* Optionally custom feedback sound/analytics */}}
          />
        </div>
      )}
      {/* Modal for "shredded" feedback */}
      <ConfirmationModal
        open={showModal}
        onCancel={handleWriteMore}
        onConfirm={handleDone}
        title="It’s gone. You chose clarity over chaos."
        description={
          <>
            <div style={{ marginBottom: 4 }}>
              That thought… it drifted into the wind.
            </div>
            <div className="flex flex-col gap-3 mt-6 w-full">
              <ButtonPrimary className="w-full mb-1" onClick={handleWriteMore}>
                Write More
              </ButtonPrimary>
              <ButtonPrimary className="w-full bg-td-btn-alt text-td-accent" onClick={handleDone}>
                I’m Done
              </ButtonPrimary>
            </div>
          </>
        }
      />
      {/* Cancel button (hidden if modal) */}
      {!showModal && (
        <div className="flex gap-2 justify-end mt-3 w-full max-w-md">
          <ButtonPrimary
            type="button"
            className="bg-td-btn-cancel text-td-warn mr-auto"
            onClick={onCancel}
            disabled={inputDisabled}
          >
            Cancel
          </ButtonPrimary>
        </div>
      )}
      <style>{`
        .animate-soft-scale-out {
          animation: soft-scale-out 360ms cubic-bezier(.60,.04,0,1.02) both;
        }
      `}</style>
    </section>
  );
}

export default JournalEntry;
