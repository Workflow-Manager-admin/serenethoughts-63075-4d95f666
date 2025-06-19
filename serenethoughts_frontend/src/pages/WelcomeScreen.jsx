import React from "react";
import ButtonPrimary from "../components/ButtonPrimary";

// PUBLIC_INTERFACE
/**
 * WelcomeScreen: Centered, calm, visually polished welcome with minimal type, accent color, and smooth layout.
 */
function WelcomeScreen({ onStart, entries }) {
  return (
    <section className="container mx-auto flex flex-col justify-center items-center pt-16 min-h-[70vh] animate-slide-fade-up">
      <div
        className="font-bold mb-4 text-td-accent select-none transition-colors"
        style={{
          fontSize: "2.4rem",
          letterSpacing: "0.022em",
          fontFamily: "Inter, Roboto, Arial, sans-serif",
          textShadow: "0 2px 14px #43b5a045, 0 1px 0 #fff8",
          marginBottom: 8,
          display: "flex",
          alignItems: "center"
        }}
      >
        <span style={{marginRight: 12, fontSize: "2.65rem"}} role="img" aria-label="Yoga">🧘</span>
        Thought Detox
      </div>
      <div
        className="max-w-lg text-center text-[1.16rem] text-td-text-soft font-medium mb-1 animate-fade-in"
        style={{
          fontFamily: "Inter, Roboto, Arial, sans-serif",
          padding: "0.5em 0.2em",
          lineHeight: 1.5,
          color: "var(--td-muted)",
          textShadow: "0 0.5px 3px #eee4"
        }}
      >
        Release your thoughts, clarify your mind,<br />and build your calm—one gentle step at a time.<br />
        <span className="text-base opacity-85">
          A minimalist journaling space for letting go, softly.
        </span>
      </div>
      <div className="w-full flex items-center justify-center mt-7">
        <ButtonPrimary className="btn-large min-w-[200px]" onClick={onStart} style={{
          fontSize: "1.22em",
          minWidth: "172px",
          maxWidth: "95vw",
          padding: "1.08em 0"
        }}>
          Begin Journaling
        </ButtonPrimary>
      </div>
      {entries && entries.length > 0 && (
        <div className="text-xs mt-6 text-td-muted animate-fade-in-slow font-semibold">
          Welcome back! Visit your<br />
          <span
            className="underline cursor-pointer text-td-accent font-bold"
            style={{
              letterSpacing: "0.012em",
              cursor: "pointer"
            }}
            onClick={onStart}
          >
            journal
          </span>{" "}
          to continue your journey.
        </div>
      )}
    </section>
  );
}

export default WelcomeScreen;
