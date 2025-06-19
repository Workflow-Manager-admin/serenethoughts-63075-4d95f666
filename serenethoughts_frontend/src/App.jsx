import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import WelcomeScreen from "./pages/WelcomeScreen";
import JournalEntry from "./pages/JournalEntry";
import EntryHistory from "./pages/EntryHistory";
import CompletionScreen from "./pages/CompletionScreen";

// PUBLIC_INTERFACE
function App() {
  const [page, setPage] = useState("welcome");
  const [entries, setEntries] = useState([]);
  const [streak, setStreak] = useState(0);

  const ENTRIES_KEY = "td_entries";
  const STREAK_KEY = "td_streak";
  const LAST_ENTRY_DATE_KEY = "td_last_entry_date";

  useEffect(() => {
    const saved = localStorage.getItem(ENTRIES_KEY);
    setEntries(saved ? JSON.parse(saved) : []);
    const streakVal = localStorage.getItem(STREAK_KEY);
    setStreak(streakVal ? parseInt(streakVal, 10) : 0);
  }, []);

  useEffect(() => {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  }, [entries]);
  useEffect(() => {
    localStorage.setItem(STREAK_KEY, streak + "");
  }, [streak]);

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

  const handleDeleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const goToWelcome = () => setPage("welcome");
  const goToEntry = () => setPage("entry");
  const goToHistory = () => setPage("history");
  const goToComplete = () => setPage("complete");

  return (
    <div className="td-app min-h-screen bg-td-bg text-td-text font-sans transition-colors">
      <Navbar />
      <main className="pt-16 flex flex-col flex-1 min-h-[80vh] transition-colors">
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
