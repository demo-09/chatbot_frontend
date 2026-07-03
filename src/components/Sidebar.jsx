import React, { useState } from "react";
import { useChat } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";
import {
  IoAdd,
  IoSearchOutline,
  IoTrashOutline,
  IoPencilOutline,
  IoLogOutOutline,
  IoPersonCircleOutline,
  IoCheckmarkOutline,
  IoCloseOutline
} from "react-icons/io5";
import Modal from "./Modal";
import ProfileCard from "./ProfileCard";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const {
    chats,
    activeChat,
    selectChat,
    startNewChat,
    deleteChat,
    renameChat,
    searchQuery,
    setSearchQuery
  } = useChat();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitleValue, setEditTitleValue] = useState("");

  const handleStartRename = (e, chat) => {
    e.stopPropagation();
    setEditingChatId(chat._id);
    setEditTitleValue(chat.title);
  };

  const handleSaveRename = (e, chatId) => {
    e.stopPropagation();
    if (editTitleValue.trim()) {
      renameChat(chatId, editTitleValue.trim());
    }
    setEditingChatId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingChatId(null);
  };

  const handleDelete = (e, chatId) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this roast?")) {
      deleteChat(chatId);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 glass-panel border-r flex flex-col h-full transition-transform duration-300 md:translate-x-0 md:static md:z-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Top Header & New Chat button */}
        <div className="p-4 flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black bg-gradient-to-r from-brand-indigo to-brand-purple bg-clip-text text-transparent tracking-wide select-none">
              SAVAGE.AI
            </h2>
            {/* Close button for mobile screen drawer */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-150 dark:hover:bg-slate-850 md:hidden cursor-pointer"
            >
              <IoCloseOutline size={22} />
            </button>
          </div>

          <button
            onClick={() => {
              startNewChat();
              onClose(); // Close mobile drawer
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-purple text-white font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md shadow-indigo-500/10 active:scale-98 select-none cursor-pointer"
          >
            <IoAdd size={20} />
            <span>New Roast</span>
          </button>
        </div>

        {/* Chat Search Box */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/60">
          <div className="relative flex items-center">
            <IoSearchOutline className="absolute left-3 text-slate-400 dark:text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search roasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-950 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo"
            />
          </div>
        </div>

        {/* Previous Chats Scroll List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
            Previous Roasts
          </span>

          <div className="mt-2 space-y-1">
            {chats.length === 0 ? (
              <p className="text-xs text-center text-slate-400 dark:text-slate-500 py-6 italic font-medium select-none">
                No roasts found
              </p>
            ) : (
              chats.map((chat) => {
                const isActive = activeChat && activeChat._id === chat._id;
                const isEditing = editingChatId === chat._id;

                return (
                  <div
                    key={chat._id}
                    onClick={() => {
                      if (!isEditing) {
                        selectChat(chat);
                        onClose(); // Close mobile drawer
                      }
                    }}
                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-all duration-200 select-none cursor-pointer border
                      ${
                        isActive
                          ? "bg-slate-100 dark:bg-slate-800 border-slate-200/50 dark:border-slate-700 text-brand-indigo dark:text-brand-purple"
                          : "hover:bg-slate-50/60 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-200/20 dark:hover:border-slate-800"
                      }
                    `}
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 w-full mr-2">
                        <input
                          type="text"
                          value={editTitleValue}
                          onChange={(e) => setEditTitleValue(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 px-2 py-1 rounded text-xs text-slate-900 dark:text-white border border-brand-indigo focus:outline-none"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => handleSaveRename(e, chat._id)}
                          className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                        >
                          <IoCheckmarkOutline size={12} />
                        </button>
                        <button
                          onClick={handleCancelRename}
                          className="p-1 rounded bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-400 transition-colors"
                        >
                          <IoCloseOutline size={12} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="truncate flex-1 pr-2">
                          {chat.title}
                        </span>
                        
                        {/* Hover Actions (Rename, Delete) */}
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 transition-opacity">
                          <button
                            onClick={(e) => handleStartRename(e, chat)}
                            className="p-1 text-slate-400 hover:text-brand-indigo dark:hover:text-brand-purple rounded transition-colors"
                            title="Rename roast"
                          >
                            <IoPencilOutline size={14} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, chat._id)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                            title="Delete roast"
                          >
                            <IoTrashOutline size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-900/40 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-indigo to-brand-purple text-white flex items-center justify-center font-bold text-base shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex-1 truncate">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user?.name || "AI Chat User"}
              </h4>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm("Are you sure you want to log out?")) {
                logout();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/5 transition-all duration-300 font-semibold select-none cursor-pointer"
          >
            <IoLogOutOutline size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Profile Details Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Account Profile Settings"
      >
        <ProfileCard onClose={() => setIsProfileModalOpen(false)} />
      </Modal>
    </>
  );
}
