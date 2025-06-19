import React, { useRef, useEffect, useState } from "react";
import "./JournalCard.css";

// PUBLIC_INTERFACE
/**
 * JournalCard — A centered, frosted glass card for journaling thoughts.
 * Features:
 * - Textarea with placeholder and CSS scale-up on focus.
 * - Delayed, animated motivational quote.
 * - Glowing "Shred It" button.
 */
function JournalCard({
  value,
  onChange,
  onShred,
  textareaDisabled = false,
  className = "",
  style = {},
}) {
  const [showQuote, setShowQuote] = useState(false);
  const textareaRef = useRef();

  useEffect(() => {
    // Fade in the quote after a delay
    const timeout = setTimeout(() => setShowQuote(true), 750);
    return () => clearTimeout(timeout);
  }, []);

  // Allow Enter to submit only if we later wish to submit on Enter
  // -- for now, no submission by pressing Enter
  
  return (
    <div className={`st-journalcard-frosted mx-auto ${className}`} style={style}>
      <form
        className="st-journalcard-content w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (onShred) onShred(value);
        }}
        autoComplete="off"
        style={{ width: "100%" }}
      >
        <label htmlFor="journal-textarea" className="st-journalcard-label">
          <span className="sr-only">Write what's bothering you</span>
        </label>
        <textarea
          ref={textareaRef}
          id="journal-textarea"
          className="st-journalcard-textarea"
          placeholder="Type what’s bothering you…"
          value={value}
          onChange={onChange}
          disabled={textareaDisabled}
          maxLength={1500}
          spellCheck
          autoFocus
          style={{
            width: "100%",
            maxWidth: "100%",
            minWidth: "0",
            resize: "vertical",
            minHeight: "120px",
            boxSizing: "border-box",
          }}
        />
        <div
          className={`st-journalcard-quote${showQuote ? " st-journalcard-quote-visible" : ""}`}
          aria-live="polite"
        >
          Let it go. You’ve taken the first step.
        </div>
        <button
          className="st-shredit-btn w-full"
          type="submit"
          tabIndex={0}
          aria-label="Shred It"
          disabled={textareaDisabled || !value.trim()}
          style={{
            width: "100%"
          }}
        >
          Shred It
        </button>
      </form>
    </div>
  );
}

export default JournalCard;
