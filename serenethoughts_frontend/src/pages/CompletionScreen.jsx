import React, { useRef, useEffect, useState } from "react";
import ButtonPrimary from "../components/ButtonPrimary";

/**
 * CompletionScreen: Modern visual, celebration with soft backgrounds, accent tones, and gentle type/spacing.
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
  const [emojiShown, setEmojiShown] = useState(false);
  const celebrationEmoji = "🏅";

  useEffect(() => {
    if (isCelebration) {
      const timeout = setTimeout(() => setEmojiShown(true), 510);
      return () => clearTimeout(timeout);
    }
  }, [isCelebration]);

  if (isCelebration) {
    return (
      <section
        className="fixed inset-0 z-50 flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-td-bg via-td-bg-dark to-td-accent transition-colors"
        style={{
          background: "linear-gradient(122deg, #e5fbec 0%, #f9fafd 33%, #e7e8fd 46%, #C0D6DF 100%)",
          boxShadow: "inset 0 14px 112px 8px #C0D6DF30"
        }}
        aria-modal="true"
        tabIndex={-1}
        role="dialog"
      >
        <div
          className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-12 min-h-[56vh] rounded-2xl shadow-lg bg-td-card animate-fade-in-slow"
          style={{
            boxShadow: "0 12px 48px -10px #a7cddf29, 0 2.5px 21px -9px #60cea818",
            minWidth: "91vw",
            background: "rgba(255,255,255,0.98)",
            borderRadius: "1.2em",
          }}>
          <div
            className={`transition-all duration-850 mb-6 ${emojiShown ? "opacity-100 scale-110 animate-fade-in-slow" : "opacity-0 scale-90"}`}
            style={{
              fontSize: "5.4rem",
              textShadow: "0 4px 42px #C0D6DF3e,0px 2px 0 #FFF",
              transition: "opacity 750ms cubic-bezier(.41,0,.16,1.78), transform 860ms cubic-bezier(.31,.09,0,1.32)",
              filter: emojiShown ? "drop-shadow(0 5px 25px #c0d6df90)" : "none",
              willChange: "opacity,transform",
              userSelect: "none"
            }}
            aria-label="Celebration"
          >
            {celebrationEmoji}
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-td-accent text-center animate-fade-in"
            style={{
              margin: "0 0 0.3em 0",
              letterSpacing: "0.021em",
              textShadow: "0 2px 9px #fff9",
              fontWeight: 800
            }}
          >
            You've unlocked 7 days of clarity.<br />Keep going.
          </h2>
          <div
            className="text-md md:text-lg text-td-muted text-center mb-6 animate-fade-in-slow"
            style={{
              maxWidth: 430,
              fontFamily: "Inter, Roboto, Arial, sans-serif",
              fontSize: "1.10em",
              fontWeight: 500,
              letterSpacing: "0.001em",
              margin: "0.65em 0 1em 0"
            }}
          >
            Consistency is a superpower. Celebrate your week-long streak—<br />revisit your progress any time!
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
            style={{
              outline: "none",
              border: "none",
              background: "none",
              cursor: "pointer",
              marginTop: "2em"
            }}
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
    <section className="container mx-auto flex flex-col items-center justify-center min-h-[63vh] animate-fade-in">
      <div
        className="bg-td-card rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center gap-6 animate-soft-in"
        style={{
          border: "1px solid var(--td-border)",
          boxShadow: "0 6px 33px -10px #c1dad022, 0 1.5px 8px -5px #92efcf17",
          background: "rgba(255,255,255,0.97)",
        }}>
        <div className="text-5xl mb-2 animate-fade-in-slow" aria-label="Well done"
          style={{ textShadow: "0 4px 14px #43b5a055", color: "#73c1a2" }}>🌤</div>
        <div className="text-[1.58rem] font-semibold text-td-accent mb-0" style={{ letterSpacing: "0.015em" }}>
          Entry saved
        </div>
        <div className="text-lg text-td-muted text-center leading-relaxed" style={{
          fontWeight: 500, fontFamily: "Inter, Roboto, Arial, sans-serif", fontSize: "1.02em"
        }}>
          {lastEntry?.title ? <>“{lastEntry.title}”</> : "A new journal entry"}<br />
          Letting go is a brave act. Thank you for giving your mind some space.
        </div>
        <div
          className="mt-1 text-md text-td-accent font-bold flex flex-col items-center gap-2 animate-fade-in"
          style={{ fontSize: "1.25em", letterSpacing: "0.016em" }}>
          <span>
            <span className="font-bold">{streak}</span> day streak!
          </span>
        </div>
        <div className="flex gap-3 mt-3 w-full">
          <ButtonPrimary onClick={onNewEntry} className="flex-1 btn-large" style={{
            fontWeight: 700,
            fontSize: "1.12rem"
          }}>New Entry</ButtonPrimary>
          <ButtonPrimary onClick={onShowHistory} className="bg-td-btn-alt text-td-accent flex-1 btn-large" style={{
            fontWeight: 600, fontSize: "1.11rem"
          }}>
            View Journal
          </ButtonPrimary>
        </div>
      </div>
    </section>
  );
}

export default CompletionScreen;
