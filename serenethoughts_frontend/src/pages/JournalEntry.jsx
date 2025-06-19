import React, { useState, useEffect } from "react";
import JournalCard from "../components/JournalCard";
import ConfirmationModal from "../components/ConfirmationModal";
import ButtonPrimary from "../components/ButtonPrimary";
import StreakCounter from "../components/StreakCounter";

/**
 * JournalEntry page - manages the lifecycle of the JournalCard and ConfirmationModal
 * Handles smooth state transitions for the "Shred It" UX flow,
 * and manages textarea value, isShredded state, optional mood, and a local journalEntries array
 * with robust localStorage persistence and loading through useEffect.
 *
 * Props:
 *  - onComplete(entryObj): callback to parent when journal "shredded" and added
 *  - onCancel(): cancels the journaling session
 */
function JournalEntry({ onComplete, onCancel }) {
  // Main entry body (textarea input)
  const [body, setBody] = useState("");
  // Has the entry just been shredded? (controls card/modal animation)
  const [isShredded, setIsShredded] = useState(false);
  // Show animated check
  const [showCheck, setShowCheck] = useState(false);
  // Mood selection (optional, feel free to expand UI for this as needed)
  const [mood, setMood] = useState(""); // Placeholder for optional use
  // Array of all journal entries (local, synced to localStorage)
  const [journalEntries, setJournalEntries] = useState([]);
  // UI state
  const [fading, setFading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Streak state for journaling days
  const [streak, setStreak] = useState(0);

  // --- STREAK LOGIC START ---
  // Compute streak from "thoughtDetoxEntries" localStorage: streak = max run of consecutive day entries including today (if present)
  function computeStreak(entriesArr) {
    if (!Array.isArray(entriesArr) || entriesArr.length === 0) return 0;
    // Get all entry ISO dates, normalize to yyyy-mm-dd (no duplicates)
    const dateSet = new Set();
    for (const entry of entriesArr) {
      if (entry.timestamp) {
        dateSet.add(entry.timestamp.slice(0, 10));
      }
    }
    const dates = [...dateSet].sort((a, b) => b.localeCompare(a)); // descending

    if (dates.length === 0) return 0;
    // streak starts from today if present, else from yesterday, etc.
    let streakCount = 0;
    let expected = new Date();

    for (let i = 0; i < dates.length; ++i) {
      const dStr = dates[i];
      const expectedStr = expected.toISOString().slice(0, 10);
      if (dStr === expectedStr) {
        streakCount++;
      } else {
        // If today is missing, see if yesterday matches, continue only if previous day(s) match
        if (i === 0 && streakCount === 0) {
          // Maybe user missed today, try from yesterday
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

  // --- STREAK LOGIC END ---

  // Key for localStorage for legacy journal entries (unused for streak, but kept for compatibility)
  const ENTRIES_KEY = "td_journal_entries";
  // Key for the real entries used for streak
  const DETOX_ENTRIES_KEY = "thoughtDetoxEntries";

  // Load journal entries from localStorage on mount (robustly handles errors)
  useEffect(() => {
    let data = [];
    try {
      const stored = localStorage.getItem(ENTRIES_KEY);
      if (stored) {
        data = JSON.parse(stored);
        if (!Array.isArray(data)) data = [];
      }
    } catch (e) {
      // If error, just ignore and keep data empty
      data = [];
    }
    setJournalEntries(data);

    // Also load detox entries for streak count
    try {
      const detoxStored = localStorage.getItem(DETOX_ENTRIES_KEY);
      let detoxArr = [];
      if (detoxStored) {
        detoxArr = JSON.parse(detoxStored) || [];
        if (!Array.isArray(detoxArr)) detoxArr = [];
      }
      setStreak(computeStreak(detoxArr));
    } catch {
      setStreak(0);
    }
  }, []);

  // Save journalEntries array to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(journalEntries));
    } catch (e) {
      // Non-blocking, just ignore save error
    }
  }, [journalEntries]);

  // --- Listen for changes to "thoughtDetoxEntries" and update streak ---
  useEffect(() => {
    function handleStorageChange() {
      try {
        const arr = JSON.parse(localStorage.getItem(DETOX_ENTRIES_KEY));
        setStreak(computeStreak(arr || []));
      } catch {
        setStreak(0);
      }
    }
    window.addEventListener("storage", handleStorageChange);
    // For same-tab updates: periodically check/local change
    const interval = setInterval(handleStorageChange, 500); // update streak every 0.5sec if externally changed

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Smooth fade out and modal show on Shred It
  const handleShred = (textValue) => {
    // If empty — don't allow shredding, let JournalCard trigger visual feedback (no-op)
    if (!textValue || !textValue.trim()) {
      return;
    }

    setInputDisabled(true);
    setFading(true);

    // Inline lightweight UUID generator
    function generateUuid() {
      // RFC4122 version 4 compliant UUID (random)
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    // Wait for fade out CSS animation to finish, then show check icon, then modal
    setTimeout(() => {
      setShowCheck(true);   // Show the check icon, triggers fade-in
      setTimeout(() => {
        setShowModal(true);
        setIsShredded(true);
        setShowCheck(false); // Hide check after animation
        // After modal appears, add entry to array & persist
        const trimmedText = textValue.trim();
        if (trimmedText.length > 0) {
          const id = generateUuid();
          const text = trimmedText;
          const timestamp = new Date().toISOString();

          // Entry object structure per requirements
          const detoxEntry = { id, text, timestamp };

          // Save to "thoughtDetoxEntries" in localStorage
          try {
            // Get previous array or initialize
            let allEntries = [];
            const raw = localStorage.getItem(DETOX_ENTRIES_KEY);
            if (raw) {
              allEntries = JSON.parse(raw);
              if (!Array.isArray(allEntries)) allEntries = [];
            }
            allEntries.unshift(detoxEntry);
            localStorage.setItem(DETOX_ENTRIES_KEY, JSON.stringify(allEntries));
            setStreak(computeStreak(allEntries));

            // Check for 7th entry completion (exactly upon writing the 7th entry)
            if (allEntries.length === 7) {
              // Optionally store a flag for completion celebration
              localStorage.setItem("td_seven_complete", "yes");
            }
          } catch (e) {
            setStreak(0);
          }

          // Maintain the original journalEntries array (for legacy or other UI)
          const entryObj = {
            id,
            body: trimmedText,
            mood,
            timestamp,
          };
          setJournalEntries(prev => [entryObj, ...prev]);
          // Propagate to parent (if parent wants to act immediately)
          if (typeof onComplete === "function") {
            // Signal with second param if it's their 7th entry
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
      }, 900); // Check appears for about 850-900ms before showing modal
    }, 360); // matches fade out duration (360ms)
  };

  // Write More: fade in card again, reset input and isShredded
  const handleWriteMore = () => {
    setShowModal(false);
    setInputDisabled(false);
    setBody("");
    setFading(false);
    setResetKey((k) => k + 1);
    setIsShredded(false);
    // Mood reset (optional)
    setMood("");
  };

  // I'm Done: close modal and optionally propagate action to parent
  const handleDone = () => {
    setShowModal(false);
    setInputDisabled(false);
    setBody("");
    setFading(false);
    setResetKey((k) => k + 1);
    setIsShredded(false);
    setMood("");
    // Parent handles navigation; can also trigger history if desired
    if (typeof onComplete === "function") {
      // Just signal to parent with empty entry, to indicate user pressed "Done"
      onComplete(null, { toHistory: true });
    }
  };

  // Optionally, expose journalEntries locally for advanced features

  return (
    <section
      className="container mx-auto max-w-xl mt-8 flex flex-col items-center min-h-[60vh] justify-center"
      style={{ position: "relative" }}
    >
      {/* StreakCounter displayed at the top */}
      <div className="w-full flex justify-center animate-fade-in mb-5" style={{ minHeight: 34 }}>
        <StreakCounter streak={streak} />
      </div>
      {/* JournalCard */}
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
            onChange={(e) => setBody(e.target.value)}
            onShred={handleShred}
            textareaDisabled={inputDisabled}
            className=""
            showCheck={showCheck}
            onCheckAnimationEnd={() => setShowCheck(false)}
            // Optionally add a callback if you want to do more on shake
            onShake={() => {/* Could add custom sound/analytics here */}}
          />
        </div>
      )}

      {/* ConfirmationModal */}
      <ConfirmationModal
        open={showModal}
        // “Write More” resets the card (fade in), “I’m Done” triggers go-to-history
        onCancel={handleWriteMore}
        onConfirm={handleDone}
        title="It’s gone. You chose clarity over chaos."
        description={
          <>
            <div>That thought… it drifted into the wind.</div>
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
      {/* If modal is open, hide default footer buttons */}
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
