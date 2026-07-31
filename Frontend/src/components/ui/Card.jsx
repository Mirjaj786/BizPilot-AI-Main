export default function Card({ children, className = "", padding = "p-6", ...props }) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl shadow-xs ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
