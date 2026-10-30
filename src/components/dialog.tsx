"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export default function Dialog({
  title,
  children,
  onClose,
  className = "",
  open = true,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
  open?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    const trigger = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      dialog?.close();
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        className="icon-button dialog-close"
        onClick={onClose}
        aria-label="Close dialog"
      >
        <X size={22} />
      </button>
      {children}
    </dialog>
  );
}

