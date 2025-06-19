import React from "react";
import ButtonPrimary from "../components/ButtonPrimary";

// PUBLIC_INTERFACE
function WelcomeScreen({ onStart, entries }) {
  return (
    <section className="container mx-auto flex flex-col justify-center items-center pt-16 min-h-[70vh] animate-slide-fade-up">
      <div className="text-3xl md:text-5xl font-bold mb-3 text-td-accent select-none transition-colors">
        🧘 Thought Detox
      </div>
      <div className="max-w-lg text-center text-base md:text-lg text-td-text-soft font-medium mb-2 animate-fade-in">
        Release your thoughts, clarify your mind, and build your calm—one small step at a time.<br />
        A minimalist journaling space for letting go gently.
      </div>
      <div className="w-full flex items-center justify-center mt-6">
        <ButtonPrimary className="btn-large min-w-[200px]" onClick={onStart}>
          Begin Journaling
        </ButtonPrimary>
      </div>
      {entries && entries.length > 0 && (
        <div className="text-xs mt-6 text-td-muted animate-fade-in-slow">
          Welcome back! Visit your <span className="underline cursor-pointer" onClick={onStart}>journal</span> to continue your journey.
        </div>
      )}
    </section>
  );
}

export default WelcomeScreen;
