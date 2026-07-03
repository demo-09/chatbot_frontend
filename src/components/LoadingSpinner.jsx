import React from "react";

export default function LoadingSpinner({ size = "md", text = "AI is thinking..." }) {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <div className="relative">
        {/* Glow backing */}
        <div className={`absolute inset-0 rounded-full bg-brand-indigo/30 blur-md ${size === "lg" ? "w-16 h-16" : size === "md" ? "w-10 h-10" : "w-6 h-6"}`} />
        
        {/* Spinner ring */}
        <div
          className={`${sizes[size]} rounded-full border-brand-indigo/20 border-t-brand-indigo animate-spin`}
        />
      </div>
      {text && (
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse tracking-wide select-none">
          {text}
        </span>
      )}
    </div>
  );
}
