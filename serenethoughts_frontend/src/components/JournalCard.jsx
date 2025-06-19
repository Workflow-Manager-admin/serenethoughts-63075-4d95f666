import React, { useRef, useEffect, useState } from "react";
import "./JournalCard.css";

/**
 * AnimatedPlaceholder
 * Animates placeholder text with a gentle typing or fade-in effect.
 */
function AnimatedPlaceholder({active, text, duration = 1000, typing = false}) {
  // If typing = true, reveal text letter-by-letter; else, fade-in full string.
  const [display, setDisplay] = useState(typing ? "" : text);

  useEffect(() => {
    if (!active) {
      setDisplay(typing ? "" : "");
      return;
    }
    if (typing) {
      setDisplay("");
      let i = 0;
      const interval = setInterval(() => {
        setDisplay((prev) => text.slice(0, i+1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, Math.max(33, duration / (text.length + 2)));
      return () => clearInterval(interval);
    } else {
      // Fade: just show full text after tiny delay (for triggering CSS)
      setDisplay(text);
    }
  }, [active, text, duration, typing]);

  // We use a span so this can be absolutely overlaid in the textarea region.
  return (
    <span
      className={
        "st-journalcard-animated-placeholder"
        + (active && display ? " st-journalcard-animated-placeholder-active" : "")
        + (typing ? " st-journalcard-animated-placeholder-typing" : " st-journalcard-animated-placeholder-fade")
      }
      aria-hidden="true"
    >{display}</span>
  );
}
/**
 * JournalCard — A centered, frosted glass card for journaling thoughts.
 * Features:
 * - Textarea with placeholder and CSS scale-up on focus.
 * - Delayed, animated motivational quote.
 * - Glowing "Shred It" button.
 * - Shows fade-in check icon on successful shred.
 */
function JournalCard({
  value,
  onChange,
  onShred,
  textareaDisabled = false,
  className = "",
  style = {},
  showCheck = false,
  onCheckAnimationEnd,
  onShake, // Optional callback when invalid attempt made
}) {
  const [showQuote, setShowQuote] = useState(false);
  const [placeholderActive, setPlaceholderActive] = useState(true);
  const [shake, setShake] = useState(false);
  const [showEmptyMsg, setShowEmptyMsg] = useState(false);
  const textareaRef = useRef();

  useEffect(() => {
    // Fade in the quote after a delay
    const timeout = setTimeout(() => setShowQuote(true), 750);
    return () => clearTimeout(timeout);
  }, []);

  // Mount: animate placeholder only when textarea is empty.
  useEffect(() => {
    setPlaceholderActive(!value);
  }, []);

  // Handle focus/blur: animate again if empty
  const handleFocus = () => { if (!value) setPlaceholderActive(true); };
  const handleBlur = () => { setPlaceholderActive(false); };
  const handleInput = (e) => { onChange(e); if (e.target.value) setPlaceholderActive(false); };

  // Text for the animated placeholder
  const PLACEHOLDER_TEXT = "Type what’s bothering you…";

  return (
    <div className={`st-journalcard-frosted mx-auto ${className}`} style={style}>
      <form
        className="st-journalcard-content w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (onShred) onShred(value); // Note: actual blocking will use prop logic!
        }}
        autoComplete="off"
        style={{ width: "100%", position: "relative" }}
      >
        <label htmlFor="journal-textarea" className="st-journalcard-label">
          <span className="sr-only">Write what's bothering you</span>
        </label>
        <div style={{position: "relative", width: "100%"}}>
          {/* Fade-in check icon overlay */}
          {showCheck && (
            <span
              className="st-check-fadein"
              style={{
                position: "absolute",
                zIndex: 10,
                left: "50%",
                top: "44%",
                transform: "translate(-50%, -50%) scale(1)",
                fontSize: "2.7em",
                color: "var(--td-success,#299a57)",
                pointerEvents: "none",
                opacity: 1,
                textShadow: "0 2px 18px #79e3bd66, 0 1px 0 #fff",
                transition: "opacity 0.8s cubic-bezier(.42,0,.14,1.2)",
                userSelect: "none"
              }}
              aria-label="Shredded! Success"
              onAnimationEnd={onCheckAnimationEnd}
            >✅</span>
          )}
          <textarea
            ref={textareaRef}
            id="journal-textarea"
            className="st-journalcard-textarea"
            placeholder="" // Remove native placeholder, handled via overlay
            value={value}
            onChange={handleInput}
            disabled={textareaDisabled}
            maxLength={1500}
            spellCheck
            autoFocus
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              width: "100%",
              maxWidth: "100%",
              minWidth: "0",
              resize: "vertical",
              minHeight: "120px",
              boxSizing: "border-box",
              position: "relative",
              background: "none",
              zIndex: 2
            }}
            aria-label={PLACEHOLDER_TEXT}
          />
          {/* Animated placeholder: show when textarea is empty and not typing */}
          {(!value || (placeholderActive && !value)) && (
            <AnimatedPlaceholder
              active={placeholderActive && !value}
              text={PLACEHOLDER_TEXT}
              duration={900}
              typing={true}
            />
          )}
          {/* Feedback for empty-card shredded */}
          {showEmptyMsg && (
            <div
              className="st-card-empty-msg"
              style={{
                color: "#B05353",
                background: "rgba(251,240,239,0.66)",
                borderRadius: "0.6em",
                padding: "0.55em 1em",
                fontSize: "1em",
                fontWeight: 500,
                marginTop: 8,
                marginBottom: 4,
                minHeight: 36,
                textAlign: "center",
                animation: "fade-in 0.38s",
                boxShadow: "0 1px 9px -7px #eec1b2b0"
              }}
              aria-live="polite"
            >
              Please write something before shredding.
            </div>
          )}
        </div>
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
      {/* Inline style for check animation */}
      <style>{`
        .st-check-fadein {
          animation: st-check-fadein-anim 860ms cubic-bezier(.49,0,.19,1.12) both;
        }
        @keyframes st-check-fadein-anim {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.7) rotate(-20deg);}
          62%  { opacity: 1; transform: translate(-50%, -50%) scale(1.14) rotate(6deg);}
          85%  { opacity: 1; transform: translate(-50%, -50%) scale(0.98) rotate(0);}
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1.00) rotate(0);}
        }
      `}
      </style>
    </div>
  );
}

export default JournalCard;
