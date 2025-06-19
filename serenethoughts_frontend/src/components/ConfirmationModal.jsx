import React from "react";

// PUBLIC_INTERFACE
/**
 * ConfirmationModal supports rendering a string or React node as "description"
 * CTAs (Cancel/Confirm) can be replaced by passing custom children via description prop.
 */
function ConfirmationModal({ open, onCancel, onConfirm, title, description }) {
  if (!open) return null;
  return (
    <div className="td-modal fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in-fast">
      <div className="bg-td-card rounded-lg p-6 shadow-md w-full max-w-xs flex flex-col items-center gap-4 animate-fade-in-modal">
        <div className="text-lg font-semibold mb-2">{title}</div>
        <div className="text-sm text-td-muted mb-4">
          {typeof description === "string" || typeof description === "number"
            ? <>{description}</>
            : description}
        </div>
        {/* Default CTA, only shown if description is not rendering CTAs */}
        {(onCancel && onConfirm && !description) && (
          <div className="flex gap-3 mt-2">
            <button
              className="btn rounded px-4 py-2 bg-td-btn-cancel text-td-warn"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn rounded px-4 py-2 bg-td-btn-confirm text-td-success"
              onClick={onConfirm}
              autoFocus
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfirmationModal;
