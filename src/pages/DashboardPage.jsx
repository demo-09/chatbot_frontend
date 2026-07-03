import React from "react";
import { useChat } from "../contexts/ChatContext";
import ImageUploader from "../components/ImageUploader";
import RoastDisplay from "../components/RoastDisplay";
import LoadingSpinner from "../components/LoadingSpinner";
import { IoWifiOutline, IoReloadOutline } from "react-icons/io5";

export default function DashboardPage() {
  const {
    activeChat,
    loading,
    sending,
    roastImage,
    startNewChat,
    regenerateResponse,
    fetchChats,
  } = useChat();

  const isOffline = !navigator.onLine;

  const handleRoastImage = async (imageBase64) => {
    try {
      await roastImage(imageBase64);
    } catch (e) {
      // Error handled in ChatContext toast
    }
  };

  const handleRegenerate = async (chatId) => {
    try {
      await regenerateResponse(chatId);
    } catch (e) {
      // Error handled in ChatContext toast
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading roast records..." />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-start overflow-y-auto py-6 relative">
      {/* Offline Status Alert */}
      {isOffline && (
        <div className="mx-4 mb-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-xl flex items-center justify-between shadow-sm select-none z-10 animate-pulse">
          <div className="flex items-center gap-2">
            <IoWifiOutline size={16} />
            <span>You are currently offline. Showing cached roasts.</span>
          </div>
          <button
            onClick={() => fetchChats()}
            className="flex items-center gap-1 hover:underline text-amber-700 dark:text-amber-300 cursor-pointer"
          >
            <IoReloadOutline size={12} />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Coordinator states */}
      <div className="flex-1 flex items-center justify-center py-4">
        {!activeChat ? (
          // State A: Image Uploader
          <ImageUploader onRoastImage={handleRoastImage} isLoading={sending} />
        ) : (
          // State B: Roast Showcase
          <RoastDisplay
            chat={activeChat}
            onRegenerate={handleRegenerate}
            onReset={startNewChat}
            isRegenerating={sending}
          />
        )}
      </div>
    </div>
  );
}
