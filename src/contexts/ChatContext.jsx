import React, { createContext, useContext, useState, useEffect } from "react";
import chatService from "../services/chatService";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user, enrichUserProfile } = useAuth();
  const [chats, setChats] = useState([]); // Will store list of roasts
  const [activeChat, setActiveChat] = useState(null); // Active roast
  const [loading, setLoading] = useState(false); // Fetching history loading
  const [sending, setSending] = useState(false); // Waiting for AI response loading
  const [searchQuery, setSearchQuery] = useState("");

  // Local storage keys for simulations
  const deletedChatsKey = user ? `deleted_chats_${user.id}` : "deleted_chats";
  const renamedChatsKey = user ? `renamed_chats_${user.id}` : "renamed_chats";

  // State for simulations
  const [deletedChatIds, setDeletedChatIds] = useState(() => {
    const saved = localStorage.getItem(deletedChatsKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [renamedTitles, setRenamedTitles] = useState(() => {
    const saved = localStorage.getItem(renamedChatsKey);
    return saved ? JSON.parse(saved) : {};
  });

  // Update keys when user changes
  useEffect(() => {
    if (user) {
      const dKey = `deleted_chats_${user.id}`;
      const rKey = `renamed_chats_${user.id}`;

      setDeletedChatIds(JSON.parse(localStorage.getItem(dKey)) || []);
      setRenamedTitles(JSON.parse(localStorage.getItem(rKey)) || {});
    }
  }, [user]);

  // Fetch all roasts
  const fetchChats = async (silent = false) => {
    if (!user) return;
    if (!silent) setLoading(true);
    try {
      const fetched = await chatService.getRoasts();
      setChats(fetched);
      
      // Enrich the user profile if there's user data in the posts
      const myPost = fetched.find((post) => post.user && post.user._id === user.id);
      if (myPost && myPost.user) {
        enrichUserProfile(myPost.user);
      }
    } catch (error) {
      console.error("Failed to fetch roasts:", error);
      toast.error("Could not fetch roast history. Running offline mode.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Fetch chats on mount / login
  useEffect(() => {
    if (user) {
      fetchChats();
    } else {
      setChats([]);
      setActiveChat(null);
    }
  }, [user]);

  // Select a specific roast
  const selectChat = (chat) => {
    setActiveChat(chat);
  };

  // Reset to create new roast
  const startNewChat = () => {
    setActiveChat(null);
  };

  // Upload and Roast an image
  const roastImage = async (imageBase64) => {
    if (!user) {
      toast.error("You must be logged in to upload images.");
      return;
    }

    setSending(true);
    try {
      const data = await chatService.roastImage(imageBase64);
      if (data.post) {
        const newPost = data.post;

        // Add user info
        newPost.user = {
          _id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        };

        // Update list of roasts
        setChats((prev) => [newPost, ...prev]);
        setActiveChat(newPost);
        toast.success("AI Roast complete!");
        return newPost;
      }
    } catch (error) {
      console.error("Failed to roast image:", error);
      const errMsg = error.response?.data?.massage || error.message || "Failed to roast image";
      toast.error(errMsg);
      throw error;
    } finally {
      setSending(false);
    }
  };

  // Delete roast (Simulated locally)
  const deleteChat = (chatId) => {
    const updatedDeleted = [...deletedChatIds, chatId];
    setDeletedChatIds(updatedDeleted);
    localStorage.setItem(deletedChatsKey, JSON.stringify(updatedDeleted));
    
    if (activeChat && activeChat._id === chatId) {
      setActiveChat(null);
    }
    toast.success("Roast deleted");
  };

  // Rename roast title (Simulated locally)
  const renameChat = (chatId, newTitle) => {
    if (!newTitle.trim()) return;
    const updatedRenamed = { ...renamedTitles, [chatId]: newTitle };
    setRenamedTitles(updatedRenamed);
    localStorage.setItem(renamedChatsKey, JSON.stringify(updatedRenamed));

    // Update active chat title if currently open
    if (activeChat && activeChat._id === chatId) {
      setActiveChat((prev) => ({ ...prev, title: newTitle }));
    }
    
    // Update local list
    setChats((prev) =>
      prev.map((chat) => (chat._id === chatId ? { ...chat, title: newTitle } : chat))
    );
    toast.success("Roast renamed");
  };

  // Regenerate roast response
  const regenerateResponse = async (chatId) => {
    const targetChat = chats.find((c) => c._id === chatId);
    if (!targetChat) return;

    setSending(true);
    try {
      // Call endpoint again with the same image
      const data = await chatService.roastImage(targetChat.image);
      
      if (data.post) {
        // Update the item in list
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === chatId
              ? { ...chat, title: data.post.title, content: data.post.content }
              : chat
          )
        );

        // Update active chat if currently open
        if (activeChat && activeChat._id === chatId) {
          setActiveChat((prev) => ({
            ...prev,
            title: data.post.title,
            content: data.post.content,
          }));
        }
        toast.success("Roast regenerated successfully!");
      }
    } catch (error) {
      console.error("Regeneration failed:", error);
      toast.error(error.message || "Failed to regenerate roast");
    } finally {
      setSending(false);
    }
  };

  // Filter out deleted posts and apply search query
  const getVisibleChats = () => {
    return chats
      .filter((chat) => !deletedChatIds.includes(chat._id))
      .map((chat) => ({
        ...chat,
        title: renamedTitles[chat._id] || chat.title,
      }))
      .filter((chat) =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (chat.content && chat.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  };

  return (
    <ChatContext.Provider
      value={{
        chats: getVisibleChats(),
        activeChat,
        loading,
        sending,
        searchQuery,
        setSearchQuery,
        fetchChats,
        selectChat,
        startNewChat,
        roastImage,
        deleteChat,
        renameChat,
        regenerateResponse,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
