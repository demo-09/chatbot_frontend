import React from "react";
import { motion } from "framer-motion";
import { IoChatbubbleEllipsesOutline, IoImageOutline, IoFlameOutline, IoSparkles } from "react-icons/io5";

export default function EmptyState({ onSelectPrompt }) {
  const examplePrompts = [
    {
      text: "Roast my coding setup! (Attach image or type prompt)",
      icon: IoFlameOutline,
      color: "from-orange-400 to-red-500",
    },
    {
      text: "Be brutally honest about my daily schedule.",
      icon: IoChatbubbleEllipsesOutline,
      color: "from-blue-400 to-indigo-500",
    },
    {
      text: "Analyze this image and roast the design choices.",
      icon: IoImageOutline,
      color: "from-emerald-400 to-teal-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4 text-center"
    >
      {/* Icon header */}
      <motion.div
        variants={itemVariants}
        className="w-16 h-16 rounded-2xl bg-gradient-to-r from-brand-indigo to-brand-purple flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-6 relative"
      >
        <IoSparkles size={32} className="animate-pulse" />
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-pink-500 animate-ping" />
      </motion.div>

      {/* Hero content */}
      <motion.h1
        variants={itemVariants}
        className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3"
      >
        Savage Roast <span className="bg-gradient-to-r from-brand-indigo to-brand-purple bg-clip-text text-transparent">AI Chatbot</span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-base text-slate-500 dark:text-slate-400 mb-8 max-w-md font-medium"
      >
        Welcome! Upload an image or send a prompt to receive a savage, witty, and hilarious AI roast.
      </motion.p>

      {/* Example Prompt Grid */}
      <motion.div variants={itemVariants} className="w-full flex flex-col gap-3">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left mb-1 pl-1">
          Suggestions
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {examplePrompts.map((prompt, idx) => {
            const Icon = prompt.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectPrompt(prompt.text)}
                className="flex flex-col text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 hover:border-brand-indigo dark:hover:border-brand-indigo hover:bg-white dark:hover:bg-slate-900/60 transition-all duration-300 group select-none shadow-sm"
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${prompt.color} flex items-center justify-center text-white mb-3 shadow-md`}
                >
                  <Icon size={16} />
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-indigo dark:group-hover:text-brand-indigo transition-colors line-clamp-3">
                  {prompt.text}
                </p>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
