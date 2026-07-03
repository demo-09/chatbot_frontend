import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl glass border border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 w-fit select-none">
      <div className="w-2.5 h-2.5 bg-brand-indigo rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2.5 h-2.5 bg-brand-purple rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-1.5">
        AI is roasting...
      </span>
    </div>
  );
}
