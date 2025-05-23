import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiMusic, FiDisc, FiUsers, FiList, FiPlusCircle, FiHeart
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

/**
 * SidebarContent is a reusable component for sidebar navigation links.
 * Used in both desktop and mobile sidebar drawers.
 *
 * @param {function} [onNavigate] - Optional callback called after a navigation click (for closing mobile drawer)
 */
export const SidebarContent: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const { isAuthenticated, hasRole } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all ${
      isActive
        ? 'bg-macchiato-surface0 text-macchiato-mauve shadow-neumorphic-pressed'
        : 'text-macchiato-text hover:text-macchiato-mauve hover:bg-macchiato-surface0/50'
    }`;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-macchiato-subtext0 text-sm font-medium mb-3 px-4">MAIN</h3>
        <nav className="space-y-1">
          <NavLink to="/home" className={navLinkClass} onClick={onNavigate}>
            <FiHome size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/browse" className={navLinkClass} onClick={onNavigate}>
            <FiMusic size={20} />
            <span>Songs</span>
          </NavLink>
          <NavLink to="/albums" className={navLinkClass} onClick={onNavigate}>
            <FiDisc size={20} />
            <span>Albums</span>
          </NavLink>
          <NavLink to="/artists" className={navLinkClass} onClick={onNavigate}>
            <FiUsers size={20} />
            <span>Artists</span>
          </NavLink>
        </nav>
      </div>

      {isAuthenticated && (
        <div>
          <h3 className="text-macchiato-subtext0 text-sm font-medium mb-3 px-4">YOUR LIBRARY</h3>
          <nav className="space-y-1">
            <NavLink to="/playlists" className={navLinkClass} onClick={onNavigate}>
              <FiList size={20} />
              <span>Playlists</span>
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass} onClick={onNavigate}>
              <FiHeart size={20} />
              <span>Favorites</span>
            </NavLink>
          </nav>
        </div>
      )}

      {isAuthenticated && hasRole(UserRole.ARTIST) && (
        <div>
          <h3 className="text-macchiato-subtext0 text-sm font-medium mb-3 px-4">ARTIST</h3>
          <nav className="space-y-1">
            <NavLink to="/artist/dashboard" className={navLinkClass} onClick={onNavigate}>
              <FiDisc size={20} />
              <span>My Albums</span>
            </NavLink>
            <NavLink to="/artist/upload" className={navLinkClass} onClick={onNavigate}>
              <FiPlusCircle size={20} />
              <span>Upload Music</span>
            </NavLink>
          </nav>
        </div>
      )}

      {isAuthenticated && hasRole(UserRole.ADMIN) && (
        <div>
          <h3 className="text-macchiato-subtext0 text-sm font-medium mb-3 px-4">ADMIN</h3>
          <nav className="space-y-1">
            <NavLink to="/admin/users" className={navLinkClass} onClick={onNavigate}>
              <FiUsers size={20} />
              <span>Manage Users</span>
            </NavLink>
            <NavLink to="/admin/content" className={navLinkClass} onClick={onNavigate}>
              <FiMusic size={20} />
              <span>Manage Content</span>
            </NavLink>
          </nav>
        </div>
      )}
    </div>
  );
};
