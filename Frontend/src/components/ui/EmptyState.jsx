export default function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-4">
          <Icon size={22} />
        </div>
      )}
      <p className="text-[14px] font-medium text-slate-500">{title}</p>
      {description && (
        <p className="text-[13px] text-slate-400 mt-1 max-w-sm">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
