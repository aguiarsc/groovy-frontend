import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { PlaylistDetailPage } from './pages/PlaylistDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ArtistDashboardPage } from './pages/ArtistDashboardPage';
import { MusicUploadPage } from './pages/MusicUploadPage';
import { BrowsePage } from './pages/BrowsePage';
import { AlbumsPage } from './pages/AlbumsPage';
import { AlbumDetailPage } from './pages/AlbumDetailPage';
import { ArtistsPage } from './pages/ArtistsPage';
import { ArtistDetailPage } from './pages/ArtistDetailPage';
import { SearchPage } from './pages/SearchPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminContentPage from './pages/AdminContentPage';

import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { UserRole } from './types';

/**
 * Configure React Query client with sensible defaults
 * - 5 minute stale time to reduce unnecessary refetches
 * - Limited retry to prevent excessive API calls on failure
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

import './styles/animations.css';

/**
 * Main application component that handles routing and application structure
 * 
 * The component establishes the application's routing hierarchy with:
 * - Public routes (landing, login, register) accessible to all users
 * - General content routes within the main layout
 * - Protected routes requiring authentication
 * - Role-specific routes for artists and administrators
 * 
 * @returns {JSX.Element} The rendered application with configured routing
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* These routes are accessible to all users and don't use the main layout */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<MainLayout />}>
            {/* General content within main layout (includes player, navbar, etc.) */}
            <Route path="/home" element={<HomePage />} />
            
            {/* These routes require basic user authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Route>
            
            {/* These routes are specific to users with the ARTIST role */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ARTIST]} />}>
              <Route path="/artist/dashboard" element={<ArtistDashboardPage />} />
              <Route path="/artist/upload" element={<MusicUploadPage />} />
            </Route>
            
            {/* These routes are specific to users with the ADMIN role */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/content" element={<AdminContentPage />} />
            </Route>
            
            {/* These routes are for content discovery, available to all users within the main layout */}
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/albums/:id" element={<AlbumDetailPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/artists/:id" element={<ArtistDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            
            {/* TODO: Create a proper unauthorized page component */}
            <Route path="/unauthorized" element={<div>Unauthorized Page (Coming Soon)</div>} />
          </Route>
          
          {/* Catch-all route redirects to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
