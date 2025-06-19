import React from "react";

// PUBLIC_INTERFACE
function JournalCard({ entry, onDelete }) {
  const date = new Date(entry.date);
  return (
    <div className="td-card bg-td-card rounded shadow-sm mb-3 px-4 py-4 flex flex-col gap-2 animate-fade-in">
      <div className="text-xs text-td-muted mb-1">
        {date.toLocaleDateString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}{" "}
        <span className="ml-2 text-td-muted-md">
          {date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <div className="font-medium text-lg text-td-text mb-1">{entry.title}</div>
      <div className="text-td-text-soft leading-relaxed whitespace-pre-line">{entry.body}</div>
      <div className="text-xs text-td-tag mt-2 flex items-center gap-2">
        {entry.tags && entry.tags.map(t => (
            <span key={t} className="bg-td-accent/20 text-td-accent px-2 py-0.5 rounded-full">{t}</span>
        ))}
        {onDelete && (
          <button
            className="ml-auto text-td-warn hover:bg-td-warn/10 rounded px-2 py-1 transition"
            title="Delete entry"
            aria-label="Delete"
            onClick={() => onDelete(entry.id)}
            type="button"
          >
            🗑
          </button>
        )}
      </div>
    </div>
  );
}

export default JournalCard;
