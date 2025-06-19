import React, { useState } from "react";
import ButtonPrimary from "../components/ButtonPrimary";

// PUBLIC_INTERFACE
function JournalEntry({ onComplete, onCancel }) {
  // States for input
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [done, setDone] = useState(false);

  // Handler for submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (body.trim().length < 4) return;
    setDone(true);
    setTimeout(() => {
      onComplete({
        title: title.trim() || "Untitled Entry",
        body: body.trim(),
        tags: tags
          .split(",")
          .map((str) => str.trim())
          .filter((t) => t.length > 0),
      });
    }, 400); // brief animation before moving on
  };

  return (
    <section className="container mx-auto max-w-xl mt-8 animate-fade-in flex flex-col">
      <form
        className={"flex flex-col gap-4 bg-td-card rounded-xl shadow p-6 " + (done ? "animate-soft-scale-out" : "animate-soft-in")}
        onSubmit={handleSubmit}
      >
        <div className="font-semibold text-xl mb-1 text-td-accent">New Journal Entry</div>
        <div>
          <label htmlFor="td-title" className="text-sm text-td-muted mb-2">
            Entry Title (optional)
          </label>
          <input
            id="td-title"
            name="title"
            type="text"
            className="w-full border-0 border-b border-td-accent/30 bg-transparent p-2 text-lg outline-none focus:border-td-accent transition placeholder-td-muted"
            maxLength={80}
            placeholder="Give this thought a gentle label…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={done}
            autoComplete="off"
            spellCheck
          />
        </div>
        <div>
          <label htmlFor="td-body" className="text-sm text-td-muted mb-2">
            What’s on your mind?
          </label>
          <textarea
            id="td-body"
            name="body"
            className="w-full min-h-[130px] border-0 border-b border-td-accent/40 bg-transparent mt-1 p-2 text-base outline-none focus:border-td-accent transition placeholder-td-muted rounded"
            placeholder="Let your thoughts flow. It’s safe here…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            minLength={4}
            maxLength={2000}
            autoFocus
            disabled={done}
            spellCheck
          />
        </div>
        <div>
          <label htmlFor="td-tags" className="text-sm text-td-muted">
            Tags <span className="text-td-muted-lt">(comma separated, e.g. 'anxiety, work')</span>
          </label>
          <input
            id="td-tags"
            name="tags"
            type="text"
            className="w-full border-0 border-b border-td-accent/20 bg-transparent p-2 text-base outline-none focus:border-td-accent transition placeholder-td-muted"
            placeholder="(Optional) e.g. gratitude, stress"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            maxLength={64}
            disabled={done}
            spellCheck
          />
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <ButtonPrimary type="button" className="bg-td-btn-cancel text-td-warn mr-auto" onClick={onCancel} disabled={done}>
            Cancel
          </ButtonPrimary>
          <ButtonPrimary type="submit" disabled={done || body.trim().length < 4}>
            Save Entry
          </ButtonPrimary>
        </div>
      </form>
    </section>
  );
}

export default JournalEntry;
