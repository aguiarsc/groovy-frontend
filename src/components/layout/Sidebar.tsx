import React from 'react';
import { FiX } from 'react-icons/fi';
import { SidebarContent } from './SidebarContent';

/**
 * Sidebar component for desktop and mobile (drawer).
 *
 * @param {boolean} [mobileOpen] - If true, shows the mobile drawer
 * @param {function} [onClose] - Callback to close the mobile drawer
 *
 * For desktop, renders a static aside. For mobile, renders a drawer overlay.
 */
const Sidebar: React.FC<{ mobileOpen?: boolean; onClose?: () => void }> = ({ mobileOpen = false, onClose }) => {
  const desktopSidebar = (
    <aside className="w-64 h-full bg-macchiato-mantle/80 backdrop-blur-glass shadow-neumorphic-dark p-4 hidden md:block overflow-y-auto">
      <SidebarContent />
    </aside>
  );

  const mobileSidebar = mobileOpen ? (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-label="Close sidebar backdrop"
      />
      <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-macchiato-mantle/95 shadow-lg p-4 flex flex-col md:hidden animate-slide-in">
        <button
          className="self-end text-macchiato-text hover:text-macchiato-mauve mb-4"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <FiX size={28} />
        </button>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </>
  ) : null;

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  );
};

export default Sidebar;
