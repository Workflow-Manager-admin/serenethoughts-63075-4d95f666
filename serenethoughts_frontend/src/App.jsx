import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import WelcomeScreen from "./pages/WelcomeScreen";
import JournalEntry from "./pages/JournalEntry";
import EntryHistory from "./pages/EntryHistory";
import CompletionScreen from "./pages/CompletionScreen";

// PUBLIC_INTERFACE
function App() {
  // App navigation: 'welcome', 'entry', 'history', 'complete'
  const [page, setPage] = useState("welcome");

  // All entries state for global context
  const [entries, setEntries] = useState([]);
  // For persisting streak
  const [streak, setStreak] = useState(0);

  // Local storage keys
  const ENTRIES_KEY = "td_entries";
  const STREAK_KEY = "td_streak";
  const LAST_ENTRY_DATE_KEY = "td_last_entry_date";

  // Load entries and streak from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(ENTRIES_KEY);
    setEntries(saved ? JSON.parse(saved) : []);
    const streakVal = localStorage.getItem(STREAK_KEY);
    setStreak(streakVal ? parseInt(streakVal, 10) : 0);
  }, []);

  // Save entries and streak to localStorage on change
  useEffect(() => {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  }, [entries]);
  useEffect(() => {
    localStorage.setItem(STREAK_KEY, streak + "");
  }, [streak]);

  // Handle new entry submission
  const handleEntrySubmit = (entry) => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const lastEntryDate = localStorage.getItem(LAST_ENTRY_DATE_KEY);
    let newStreak = streak;
    if (lastEntryDate) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yestDateString = yesterday.toISOString().slice(0, 10);
      if (lastEntryDate === yestDateString) {
        newStreak = streak + 1;
      } else if (lastEntryDate !== today) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }
    setStreak(newStreak);
    localStorage.setItem(LAST_ENTRY_DATE_KEY, today);

    setEntries([
      {
        ...entry,
        date: now.toISOString(),
        id: now.getTime(),
      },
      ...entries,
    ]);
    setPage("complete");
  };

  // Handle deleting an entry (by id)
  const handleDeleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  // Navigation handlers
  const goToWelcome = () => setPage("welcome");
  const goToEntry = () => setPage("entry");
  const goToHistory = () => setPage("history");
  const goToComplete = () => setPage("complete");

  return (
    <div className="td-app min-h-screen bg-td-bg text-td-text font-sans transition-colors">
      <Navbar
        onLogoClick={goToWelcome}
        showBack={page === "entry" || page === "history" || page === "complete"}
        onBack={
          page === "entry" || page === "complete"
            ? goToWelcome
            : page === "history"
            ? () => setPage("complete")
            : null
        }
        streak={streak}
      />
      <main className="pt-20 flex flex-col flex-1 min-h-[80vh] transition-colors">
        {page === "welcome" && (
          <WelcomeScreen
            onStart={goToEntry}
            entries={entries}
          />
        )}
        {page === "entry" && (
          <JournalEntry
            onComplete={handleEntrySubmit}
            onCancel={goToWelcome}
          />
        )}
        {page === "history" && (
          <EntryHistory
            entries={entries}
            onDelete={handleDeleteEntry}
            onBack={goToComplete}
          />
        )}
        {page === "complete" && (
          <CompletionScreen
            onNewEntry={goToEntry}
            onShowHistory={goToHistory}
            streak={streak}
            lastEntry={entries[0]}
          />
        )}
      </main>
      <footer className="text-xs text-td-muted text-center py-6 select-none opacity-75">
        Thought Detox &copy; {new Date().getFullYear()} - Built with calm and care.
      </footer>
    </div>
  );
}

export default App;
