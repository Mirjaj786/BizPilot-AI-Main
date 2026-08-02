import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoCloseOutline } from "react-icons/io5";

export default function Modal({ children, onClose, maxWidth = "max-w-lg", title, footer }) {
  useEffect(() => {
    // Lock background page scroll when modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Close modal on Escape key press
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const modalContent = (
    <div className="bf-backdrop" onClick={onClose}>
      <div
        className={`bf-modal ${maxWidth} p-4 sm:p-6 relative flex flex-col w-full my-auto overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0 mb-3 sm:mb-4">
          {title && (
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h4>
          )}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors ml-auto cursor-pointer shrink-0"
            aria-label="Close"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4">
          {children}
        </div>

        {/* Sticky Footer Action Bar */}
        {footer && (
          <div className="shrink-0 pt-3.5 mt-3 border-t border-slate-100 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
