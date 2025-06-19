import React from "react";

// PUBLIC_INTERFACE
/**
 * ConfirmationModal: Modern soft modal with frosted background, pastel shadows, and fully minimal layout.
 */
function ConfirmationModal({ open, onCancel, onConfirm, title, description }) {
  if (!open) return null;
  return (
    <div
      className="td-modal fixed inset-0 flex items-center justify-center z-50 animate-fade-in-fast"
      style={{
        background: "rgba(36,52,52,0.31)",
        backdropFilter: "blur(3px) brightness(0.97)",
        WebkitBackdropFilter: "blur(3px) brightness(0.97)",
      }}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-td-card rounded-2xl p-7 shadow-lg w-full max-w-xs flex flex-col items-center gap-5 animate-fade-in-modal"
        style={{
          boxShadow: "0 4px 24px 0 rgba(67,181,160,0.12), 0 1.5px 13px -6px #43b5a019",
          minWidth: 280,
          border: "1px solid var(--td-border)",
        }}
      >
        <div className="text-[1.22rem] font-bold text-td-accent mb-1 select-none" style={{ letterSpacing: "0.01em" }}>{title}</div>
        <div className="text-[1.02rem] text-td-muted mb-2 text-center" style={{
          lineHeight: 1.45,
          fontWeight: 500,
          fontFamily: "Inter, Roboto, Arial, sans-serif",
          letterSpacing: "0.008em",
        }}>
          {typeof description === "string" || typeof description === "number"
            ? <>{description}</>
            : description}
        </div>
        {/* Default CTA, only shown if description is not rendering CTAs */}
        {(onCancel && onConfirm && !description) && (
          <div className="flex gap-3 mt-2">
            <button
              className="td-btn bg-td-btn-cancel text-td-warn px-6 py-[0.63em] rounded-lg text-base font-medium transition hover:bg-td-btn-cancel/80"
              onClick={onCancel}
              style={{ minWidth: 90 }}
            >
              Cancel
            </button>
            <button
              className="td-btn bg-td-btn-confirm text-td-success px-6 py-[0.63em] rounded-lg text-base font-medium transition hover:bg-td-btn-confirm/80"
              onClick={onConfirm}
              autoFocus
              style={{ minWidth: 90 }}
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
