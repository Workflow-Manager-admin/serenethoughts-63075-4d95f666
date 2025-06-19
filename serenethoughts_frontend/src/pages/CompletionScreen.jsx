import React from "react";
import ButtonPrimary from "../components/ButtonPrimary";

// PUBLIC_INTERFACE
function CompletionScreen({ onNewEntry, onShowHistory, streak, lastEntry }) {
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
