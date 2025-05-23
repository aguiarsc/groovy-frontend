import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

/**
 * Navigation bar component for the application
 * 
 * This component provides:
 * - Application branding
 * - Global search functionality
 * - User authentication controls (login/logout)
 * - Responsive design with mobile-friendly menu
 * 
 * The navbar adapts its display based on:
 * - Authentication state (showing profile/logout or login/register)
 * - Screen size (showing full nav or collapsible hamburger menu)
 * 
 * @returns {JSX.Element} The rendered navigation bar
 */
interface NavbarProps {
  onOpenSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

;

  return (
    <nav className="bg-macchiato-mantle/80 backdrop-blur-glass shadow-neumorphic-dark px-3 py-2 md:px-6 md:py-4">

      <div className="relative flex items-center justify-between h-12 md:h-16 w-full">
        {/* Mobile menu button and logo container */}
        <div className="flex items-center md:flex-none">
          <button
            className="md:hidden text-macchiato-text hover:text-macchiato-mauve mr-2"
            onClick={onOpenSidebar}
            aria-label="Toggle menu"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          
          <Link to="/home" className="flex items-center">
            <span className="text-2xl font-bold text-macchiato-mauve">Groovy</span>
          </Link>
        </div>

        {/* Profile icon - mobile only */}
        <Link
          to={isAuthenticated ? "/profile" : "/login"}
          className="md:hidden text-macchiato-text hover:text-macchiato-mauve"
          aria-label={isAuthenticated ? "Profile" : "Login"}
        >
          <FiUser size={24} />
        </Link>

        {/* Search bar - desktop only */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for songs or artists..."
                className="w-full bg-macchiato-surface0/60 backdrop-blur-glass border border-macchiato-overlay0/20 text-macchiato-text rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-macchiato-mauve/20 focus:border-macchiato-mauve"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-macchiato-overlay1" />
            </div>
          </form>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-macchiato-text hover:text-macchiato-mauve"
              >
                <FiUser />
                <span>{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-macchiato-text hover:text-macchiato-red"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="neumorphic-button bg-macchiato-surface0 text-macchiato-mauve hover:bg-macchiato-mauve/10"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="neumorphic-button bg-macchiato-mauve text-macchiato-base hover:bg-macchiato-mauve/90"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>


    </nav>
  );
};
