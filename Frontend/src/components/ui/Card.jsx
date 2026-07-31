export default function Card({ children, className = "", padding = "p-6", ...props }) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-xs transition-colors ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
