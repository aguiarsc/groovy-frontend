import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { authService } from '../../services/auth.service';

/**
 * Props interface for the ProtectedRoute component
 * 
 * Used to specify which user roles are allowed to access the routes
 * wrapped by this component.
 */
interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

/**
 * Route protection component that handles authentication and role-based authorization
 * 
 * This component serves as a wrapper for protected routes and performs several key functions:
 * 1. Verifies that the user is authenticated before allowing access
 * 2. Optionally checks if the user has the required role(s) for the route
 * 3. Redirects unauthenticated users to the login page
 * 4. Redirects unauthorized users (wrong role) to an unauthorized page
 * 5. Shows a loading indicator while authentication state is being checked
 * 6. Handles token validation and user data loading when needed
 * 
 * @param {ProtectedRouteProps} props - Properties including optional allowed roles
 * @returns {JSX.Element} The child routes if authorized, or a redirect component
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles 
}) => {
  const { isAuthenticated, user, isLoading, loadUser } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    const token = authService.getToken();
    if (token && !user && !isLoading) {
      if (!authService.isTokenExpired()) {
        loadUser();
      }
    }
  }, [user, isLoading, loadUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    if (authService.getToken()) {
      authService.logout();
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && allowedRoles.length > 0) {
    const token = authService.getToken();
    if (token && (!user || isLoading)) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
        </div>
      );
    }
    
    const hasRequiredRole = user && allowedRoles.includes(user.role as UserRole);
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  return <Outlet />;
};
