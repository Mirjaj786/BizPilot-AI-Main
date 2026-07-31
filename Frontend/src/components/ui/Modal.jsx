import { IoCloseOutline } from "react-icons/io5";

export default function Modal({ children, onClose, maxWidth = "max-w-lg", title }) {
  return (
    <div className="bf-backdrop" onClick={onClose}>
      <div
        className={`bf-modal ${maxWidth} p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h4 className="text-[16px] font-semibold text-slate-900">{title}</h4>
          )}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors ml-auto"
            aria-label="Close"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
