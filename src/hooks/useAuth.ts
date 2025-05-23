import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import { authService } from '../services/auth.service';

/**
 * Authentication and Authorization Hook
 * 
 * This custom hook provides a unified interface for authentication-related
 * functionality throughout the application:
 * - User authentication state management
 * - Role-based access control
 * - Token verification and refreshing
 * - Authentication persistence
 * - Public/protected route determination
 */
export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error,
    login, 
    register, 
    logout, 
    loadUser,
    clearError
  } = useAuthStore();

  /**
   * Determines if the current route is a public page
   * 
   * Used to control automatic user data loading and redirects.
   * Public pages don't require authentication and won't trigger
   * automatic redirects to the login page.
   * 
   * @returns {boolean} True if the current page is public
   */
  const isOnPublicPage = useCallback(() => {
    const path = window.location.pathname;
    return path === '/login' || path === '/register' || path === '/' || path === '';
  }, []);

  /**
   * Automatically load user data when authenticated but user data is missing
   * 
   * This effect ensures user data is loaded when:
   * 1. The user is authenticated (has valid token)
   * 2. User data is not yet loaded
   * 3. The user is on a protected page
   * 
   * This helps restore user state after page refreshes.
   */
  useEffect(() => {
    if (isAuthenticated && !user && !isOnPublicPage()) {
      loadUser();
    }
  }, [isAuthenticated, user, loadUser, isOnPublicPage]);

  /**
   * Refreshes authentication state by validating the token and loading user data
   * 
   * Used when components need to ensure fresh authentication status,
   * such as when performing secured operations or after long periods of inactivity.
   * 
   * @returns {Promise<boolean>} True if authentication is valid and user is loaded
   */
  const refreshAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      logout();
      return false;
    }
    
    try {
      await loadUser();
      return true;
    } catch (error) {
      logout();
      return false;
    }
  }, [loadUser, logout]);

  /**
   * Checks if the current user has a specific role
   * 
   * Used for conditional rendering of UI elements and feature access.
   * 
   * @param {UserRole} role - The role to check against
   * @returns {boolean} True if the user has the specified role
   */
  const hasRole = useCallback((role: UserRole): boolean => {
    return user?.role === role;
  }, [user]);

  /**
   * Checks if the current user is an artist
   * 
   * Convenience method for artist-specific features like
   * song uploading and album management.
   * 
   * @returns {boolean} True if the user has the artist role
   */
  const isArtist = useCallback((): boolean => {
    return hasRole(UserRole.ARTIST);
  }, [hasRole]);

  /**
   * Checks if the current user is an admin
   * 
   * Convenience method for admin-specific features like
   * user management and content moderation.
   * 
   * @returns {boolean} True if the user has the admin role
   */
  const isAdmin = useCallback((): boolean => {
    return hasRole(UserRole.ADMIN);
  }, [hasRole]);

  /**
   * Verifies that the current token is valid
   * 
   * This performs a direct token check without making API calls.
   * Used for quick authentication state verification.
   * 
   * @returns {boolean} True if a valid token exists and the user is authenticated
   */
  const verifyToken = useCallback((): boolean => {
    const token = authService.getToken();
    return !!token && isAuthenticated;
  }, [isAuthenticated]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    loadUser,
    clearError,
    refreshAuth,
    hasRole,
    isArtist,
    isAdmin,
    verifyToken,
    isOnPublicPage
  };
};
