import React, { useState } from "react";
import JournalCard from "../components/JournalCard";
import ConfirmationModal from "../components/ConfirmationModal";
import ButtonPrimary from "../components/ButtonPrimary";

// PUBLIC_INTERFACE
/**
 * JournalEntry page - manages the lifecycle of the JournalCard and ConfirmationModal
 * Handles smooth state transitions for the "Shred It" UX flow.
 */
function JournalEntry({ onComplete, onCancel }) {
  // Entry state
  const [body, setBody] = useState("");
  const [fading, setFading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Smooth fade out and modal show on Shred It
  const handleShred = () => {
    setInputDisabled(true);
    setFading(true);
    // Wait for fade out CSS animation to finish
    setTimeout(() => {
      setShowModal(true);
    }, 360); // matches fade out duration (360ms)
  };

  // Write More: fade in card again, reset input
  const handleWriteMore = () => {
    setShowModal(false);
    setInputDisabled(false);
    setBody("");
    // Quickly reset fade
    setFading(false);
    // Reset internal quote animation by remounting
    setResetKey((k) => k + 1);
  };

  // I'm Done: navigate to /history via parent callback
  const handleDone = () => {
    // Navigation: parent handles routing to history
    if (typeof onComplete === "function") {
      onComplete({ title: "", body: "", tags: [] }, { toHistory: true });
    }
  };

  return (
    <section className="container mx-auto max-w-xl mt-8 flex flex-col items-center min-h-[60vh] justify-center"
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
      {/* Subtle CSS overrides for clean transition if needed */}
      <style>{`
        .animate-soft-scale-out {
          animation: soft-scale-out 360ms cubic-bezier(.60,.04,0,1.02) both;
        }
      `}</style>
    </section>
  );
}

export default JournalEntry;
