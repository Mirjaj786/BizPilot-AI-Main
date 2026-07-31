export default function FormField({
  label, id, name, type = "text", autoComplete, placeholder,
  value, onChange, disabled, error, icon: Icon, children, className = "",
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[14px] font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${error ? "text-red-400" : "text-slate-400"}`}
          />
        )}
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`block h-[48px] w-full rounded-2xl border bg-white ${Icon ? "pl-11" : "pl-4"} pr-4 text-[15px] text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-50"
              : "border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-indigo-50"
          } ${className}`}
        />
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[13px] font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
