import { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

export default function Modal({ children, onClose, maxWidth = "max-w-lg", title }) {
  useEffect(() => {
    // Lock background page scroll when modal is active
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="bf-backdrop" onClick={onClose}>
      <div
        className={`bf-modal ${maxWidth} p-5 sm:p-5 relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
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
        <div className="overflow-y-auto max-h-[calc(100vh-160px)] pr-1 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
