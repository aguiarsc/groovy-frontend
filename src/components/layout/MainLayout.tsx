import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import Sidebar from './Sidebar';
import { MusicPlayer } from '../music/MusicPlayer';
import { usePlayerStore } from '../../store/playerStore';

/**
 * Main application layout component that provides the consistent UI structure
 *
 * - Top navigation bar for global actions
 * - Side navigation for primary navigation
 * - Main content area for page-specific content (via React Router's Outlet)
 * - Conditionally rendered music player that appears only when a song is selected
 * 
 * @returns {JSX.Element} The composed layout with navigation and content areas
 */
export const MainLayout: React.FC = () => {
  // Access current song from global player store to conditionally render the music player
  const { currentSong } = usePlayerStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex flex-col h-screen bg-macchiato-base text-macchiato-text">
      <div className="relative">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-2 md:p-4 lg:p-6 max-w-full">
          <Outlet />
        </main>
      </div>
      
      {currentSong && <MusicPlayer />}
    </div>
  );
};
