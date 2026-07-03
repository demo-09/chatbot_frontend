import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-chat-bg dark:bg-chat-bg-dark text-slate-900 dark:text-white transition-colors duration-300">
      {/* Collapsible Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <Navbar onMenuToggle={toggleSidebar} />

        {/* Dynamic page contents render nested inside here */}
        <main className="flex-1 overflow-hidden relative bg-gradient-to-tr from-transparent via-brand-indigo/[0.01] to-brand-purple/[0.01]">
          {children}
        </main>
      </div>
    </div>
  );
}
