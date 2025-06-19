import React, { useState } from "react";
import JournalCard from "../components/JournalCard";
import ButtonPrimary from "../components/ButtonPrimary";
import ConfirmationModal from "../components/ConfirmationModal";

// PUBLIC_INTERFACE
function EntryHistory({ entries, onDelete, onBack }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    onDelete(deleteId);
    setModalOpen(false);
    setDeleteId(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setDeleteId(null);
  };

  return (
    <section className="container mx-auto max-w-2xl animate-fade-in flex flex-col pt-2">
      <ConfirmationModal
        open={modalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        title="Delete Entry?"
        description="Are you sure you want to permanently delete this journal entry? This cannot be undone."
      />
      <div className="mb-3">
        <ButtonPrimary className="mr-2" onClick={onBack}>
          &larr; Back
        </ButtonPrimary>
      </div>
      <h2 className="font-semibold text-2xl text-td-accent mb-2">Your Entries</h2>
      {entries.length === 0 && (
        <div className="text-td-muted text-base mt-12 text-center animate-fade-in-slow">
          No entries to display.
        </div>
      )}
      <div className="mt-2 flex flex-col">
        {entries.map((entry) => (
          <JournalCard key={entry.id} entry={entry} onDelete={handleDeleteClick} />
        ))}
      </div>
    </section>
  );
}

export default EntryHistory;
