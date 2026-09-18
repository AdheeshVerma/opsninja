"use client";

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  isDestructive = false,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isDestructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <h2
          id="confirm-dialog-title"
          className="text-xl font-semibold text-text-primary"
        >
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-text-secondary">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="inline-flex min-h-9 items-center justify-center rounded-pill border border-border-strong bg-surface px-4 text-sm font-semibold text-text-secondary"
            type="button"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`inline-flex min-h-9 items-center justify-center rounded-pill px-4 text-sm font-semibold text-white ${isDestructive ? "bg-red-600" : "bg-brand"}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </section>
    </div>
  );
}
