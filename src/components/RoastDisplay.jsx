import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import MarkdownMessage from "./MarkdownMessage";
import { motion } from "framer-motion";
import {
  IoCopyOutline,
  IoCheckmark,
  IoRefreshOutline,
  IoArrowBackOutline,
  IoFlameOutline,
  IoCalendarOutline,
  IoPersonCircleOutline
} from "react-icons/io5";

export default function RoastDisplay({ chat, onRegenerate, onReset, isRegenerating }) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `**${chat.title}**\n\n${chat.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = chat.createdAt
    ? new Date(chat.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2">
      {/* Back button */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-white/50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all select-none border border-slate-200/50 dark:border-slate-800/80 mb-6 cursor-pointer"
      >
        <IoArrowBackOutline size={16} />
        <span>Roast Another Image</span>
      </button>

      {/* Split screen content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Side: Roasted Image Showcase */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80 }}
          className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center justify-center bg-slate-900/50"
        >
          {chat.image && (
            <img
              src={chat.image}
              alt="Roasted Media"
              className="max-h-[500px] w-full object-contain"
            />
          )}
          {/* Flame overlay badge */}
          <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
            <IoFlameOutline size={14} className="animate-pulse" />
            <span>Roasted</span>
          </div>
        </motion.div>

        {/* Right Side: Savage AI Roast Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80 }}
          className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-850 shadow-xl flex flex-col gap-5"
        >
          {/* Header Details */}
          <div className="flex flex-col gap-2 border-b border-slate-150 dark:border-slate-800 pb-3">
            <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest leading-none">
              SAVAGE AI ANALYSIS
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-wide">
              {chat.title}
            </h3>
            
            {/* Metadata (Owner, Time) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
              <div className="flex items-center gap-1">
                <IoPersonCircleOutline size={14} />
                <span>Uploaded by {chat.user?.name || user?.name || "You"}</span>
              </div>
              {formattedDate && (
                <div className="flex items-center gap-1">
                  <IoCalendarOutline size={14} />
                  <span>{formattedDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Roast text (markdown support) */}
          <div className="flex-1 min-h-[150px]">
            <MarkdownMessage content={chat.content} />
          </div>

          {/* Action bar controls */}
          <div className="flex items-center justify-between border-t border-slate-150 dark:border-slate-800 pt-4 mt-2">
            <div className="flex items-center gap-2">
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors select-none"
                title="Copy roast"
              >
                {copied ? (
                  <>
                    <IoCheckmark className="text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <IoCopyOutline />
                    <span>Copy Response</span>
                  </>
                )}
              </button>

              {/* Regenerate Button */}
              <button
                onClick={() => onRegenerate(chat._id)}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors select-none"
                title="Regenerate roast"
              >
                <IoRefreshOutline className={isRegenerating ? "animate-spin text-brand-indigo" : ""} />
                <span>{isRegenerating ? "Regenerating..." : "Regenerate Roast"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
