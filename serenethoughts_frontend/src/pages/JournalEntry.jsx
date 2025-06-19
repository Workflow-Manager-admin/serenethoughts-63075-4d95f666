import React, { useState, useEffect } from "react";
import JournalCard from "../components/JournalCard";
import ConfirmationModal from "../components/ConfirmationModal";
import ButtonPrimary from "../components/ButtonPrimary";

// PUBLIC_INTERFACE
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
  // Mood selection (optional, feel free to expand UI for this as needed)
  const [mood, setMood] = useState(""); // Placeholder for optional use
  // Array of all journal entries (local, synced to localStorage)
  const [journalEntries, setJournalEntries] = useState([]);
  // UI state
  const [fading, setFading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Key for localStorage
  const ENTRIES_KEY = "td_journal_entries";

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
  }, []);

  // Save journalEntries array to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(journalEntries));
    } catch (e) {
      // Non-blocking, just ignore save error
    }
  }, [journalEntries]);

  // Smooth fade out and modal show on Shred It
  const handleShred = () => {
    setInputDisabled(true);
    setFading(true);
    // Wait for fade out CSS animation to finish
    setTimeout(() => {
      setShowModal(true);
      setIsShredded(true);
      // After modal appears, add entry to array & persist
      const trimmedText = body.trim();
      if (trimmedText.length > 0) {
        const entryObj = {
          id: Date.now(),
          body: trimmedText,
          mood,
          timestamp: new Date().toISOString(),
        };
        setJournalEntries(prev => [entryObj, ...prev]);
        // Propagate to parent (if parent wants to act immediately)
        if (typeof onComplete === "function") {
          onComplete(entryObj);
        }
      }
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
