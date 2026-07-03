import React from "react";

export default function Input({
  label,
  id,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error,
  required = false,
  className = "",
  icon: Icon,
  ...props
}) {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full ${Icon ? "pl-11" : "px-4"} py-3 rounded-xl border bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-indigo/50
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 dark:border-slate-800 focus:border-brand-indigo dark:focus:border-brand-indigo"
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 font-medium mt-0.5 pl-1">
          {error}
        </span>
      )}
    </div>
  );
}
