import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useChat } from "../contexts/ChatContext";
import { IoMenu, IoMoon, IoSunny, IoSparkles } from "react-icons/io5";

export default function Navbar({ onMenuToggle }) {
  const { theme, toggleTheme } = useTheme();
  const { activeChat } = useChat();

  return (
    <header className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md sticky top-0 z-30 select-none">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-1 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 md:hidden cursor-pointer"
        >
          <IoMenu size={22} />
        </button>

        {/* Brand / Active Chat Title */}
        <div className="flex items-center gap-2">
          {activeChat ? (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest leading-none mb-0.5">Active Roast Session</span>
              <h1 className="text-sm font-extrabold text-slate-800 dark:text-white truncate max-w-[150px] sm:max-w-[280px]">
                {activeChat.title}
              </h1>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <IoSparkles className="text-brand-indigo" size={16} />
              <h1 className="text-base font-extrabold text-slate-800 dark:text-white tracking-wide">
                Savage AI Roast Dashboard
              </h1>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Light/Dark mode switcher */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-brand-indigo dark:hover:text-brand-purple transition-all duration-300 shadow-sm cursor-pointer"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <IoSunny size={18} /> : <IoMoon size={18} />}
        </button>
      </div>
    </header>
  );
}
