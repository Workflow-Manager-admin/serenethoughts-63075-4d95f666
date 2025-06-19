import React, { useRef, useEffect, useState } from "react";
import ButtonPrimary from "../components/ButtonPrimary";

// PUBLIC_INTERFACE
/**
 * CompletionScreen: Full-screen celebration for 7th entry OR regular completion.
 * Props:
 *  - isCelebration: boolean (if present, shows achievement view)
 *  - returnToJournal, viewProgress: callbacks (for celebration view)
 *  - onNewEntry, onShowHistory: for classic view
 */
function CompletionScreen({
  isCelebration,
  returnToJournal,
  viewProgress,
  goToWelcome,
  onNewEntry,
  onShowHistory,
  streak,
  lastEntry,
}) {
  // For fade-in animation
  const [emojiShown, setEmojiShown] = useState(false);
  const celebrationEmoji = "🏅"; // could be any celebratory emoji/badge you like

  useEffect(() => {
    // If celebratory, fade in the emoji/badge after a short delay
    if (isCelebration) {
      const timeout = setTimeout(() => setEmojiShown(true), 510);
      return () => clearTimeout(timeout);
    }
  }, [isCelebration]);

  if (isCelebration) {
    return (
      <section
        className="fixed inset-0 z-50 flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-td-bg via-td-bg-dark to-td-accent transition-colors"
        style={{ background: 'linear-gradient(122deg, #E5FBEC 0%, #e7e8fd 46%, #C0D6DF 100%)' }}
        aria-modal="true"
        tabIndex={-1}
        role="dialog"
      >
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-12 min-h-[56vh] rounded-xl shadow-lg bg-td-card animate-fade-in-slow"
             style={{
               boxShadow: "0 8px 38px -8px #9ac4c831, 0 2.5px 15px -6px #605ad818",
               minWidth: "90vw",
               background: "rgba(255,255,255,0.93)",
             }}>
          <div
            className={`transition-all duration-850 mb-6 ${emojiShown ? "opacity-100 scale-110 animate-fade-in-slow" : "opacity-0 scale-90"}`}
            style={{
              fontSize: "5.7rem",
              textShadow: "0 4px 42px #C0D6DF55,0px 2px 0 #FFF",
              transition: "opacity 750ms cubic-bezier(.41,0,.16,1.78), transform 860ms cubic-bezier(.31,.09,0,1.32)",
              filter: emojiShown ? "drop-shadow(0 4px 15px #c0d6df95)" : "none",
              willChange: "opacity,transform",
              userSelect: "none",
            }}
            aria-label="Celebration"
          >
            {celebrationEmoji}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-td-accent text-center animate-fade-in"
              style={{
                margin: "0 0 0.5em 0",
                letterSpacing: "0.02em",
                textShadow: "0 2px 8px #fff9",
              }}>
            You've unlocked 7 days of clarity.
            <br />
            Keep going.
          </h2>
          <div className="text-md md:text-lg text-td-muted text-center mb-6 animate-fade-in-slow" style={{ maxWidth: 430 }}>
            Consistency is a superpower. Celebrate your week-long streak—and revisit your progress any time!
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-2 w-full max-w-[410px] animate-slide-fade-up">
            <ButtonPrimary
              onClick={returnToJournal}
              className="w-full btn-large"
              style={{ minWidth: "120px" }}
            >
              Return to Journal
            </ButtonPrimary>
            <ButtonPrimary
              onClick={viewProgress}
              className="w-full btn-large bg-td-btn-alt text-td-accent"
              style={{ minWidth: "120px" }}
            >
              View Progress
            </ButtonPrimary>
          </div>
          <button
            onClick={goToWelcome}
            className="text-xs mt-6 text-td-muted hover:underline focus:outline-none bg-transparent"
            tabIndex={0}
            style={{ outline: "none", border: "none", background: "none", cursor: "pointer" }}
          >
            ← Back to Home
          </button>
        </div>
        <style>{`
          @media (max-width: 700px) {
            .max-w-md { max-width: 98vw !important; }
            .px-4 { padding-left: 3vw; padding-right: 3vw; }
            .py-12 { padding-top: 1.5rem; padding-bottom: 1.7rem; }
          }
        `}</style>
      </section>
    );
  }

  // Default post-entry completion mode
  return (
    <section className="container mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="bg-td-card rounded-xl shadow p-8 w-full max-w-md flex flex-col items-center gap-5 animate-soft-in">
        <div className="text-5xl mb-2 animate-fade-in-slow" aria-label="Well done">🌤</div>
        <div className="text-2xl font-semibold text-td-accent">Entry saved</div>
        <div className="text-lg text-td-muted">
          {lastEntry?.title ? <>“{lastEntry.title}”</> : "A new journal entry"}<br />
          Letting go is a brave act. Thank you for giving your mind some space.
        </div>
        <div className="mt-1 text-md text-td-accent font-medium flex flex-col items-center gap-2">
          <span>
            <span className="font-bold">{streak}</span> day streak!
          </span>
        </div>
        <div className="flex gap-3 mt-3 w-full">
          <ButtonPrimary onClick={onNewEntry} className="flex-1">New Entry</ButtonPrimary>
          <ButtonPrimary onClick={onShowHistory} className="bg-td-btn-alt text-td-accent flex-1">
            View Journal
          </ButtonPrimary>
        </div>
      </div>
    </section>
  );
}

export default CompletionScreen;
