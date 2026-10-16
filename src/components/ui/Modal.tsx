"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    document.documentElement.classList.add("modal-open");
    window.dispatchEvent(new Event("portfolio:pause"));
    return () => {
      dialog.close();
      document.documentElement.classList.remove("modal-open");
      window.dispatchEvent(new Event("portfolio:resume"));
      previous?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={`modal ${className}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-lenis-prevent
    >
      <div className="modal-surface">
        <button
          className="icon-button modal-close"
          aria-label={`Close ${title}`}
          onClick={onClose}
        >
          <X size={22} />
        </button>
        {open && children}
      </div>
    </dialog>
  );
}
