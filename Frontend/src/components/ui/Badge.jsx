const variants = {
  success: "bg-revenue-50 text-revenue-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-danger-50 text-danger-700",
  info: "bg-primary-50 text-primary-700",
  neutral: "bg-slate-100 text-slate-600",
  purple: "bg-ai-50 text-ai-700",
};

export default function Badge({ children, variant = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold leading-tight ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
