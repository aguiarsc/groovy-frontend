import { create } from 'zustand';
import { UserDto } from '../types';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { usePlayerStore } from './playerStore';

/**
 * Interface defining the authentication state and actions
 * 
 * This store manages all aspects of user authentication including:
 * - User information and authentication status
 * - Login and registration processes
 * - Session management and validation
 * - Loading states and error handling
 */
interface AuthState {
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: UserDto) => Promise<boolean>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      
      if (response.data && response.data.token) {
        const token = response.data.token;
        authService.setToken(token);

        setTimeout(() => {
          set({ 
            user: response.data?.user || null,
            isAuthenticated: true,
            isLoading: false
          });
        }, 100);
        
        return true;
      } else {
        set({ 
          error: response.error || 'Login failed',
          isLoading: false
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: 'Login failed. Please try again.',
        isLoading: false
      });
      return false;
    }
  },

  register: async (userData: UserDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      
      if (response.data && response.data.token) {
        const token = response.data.token;
        authService.setToken(token);
        
        setTimeout(() => {
          set({ 
            user: response.data?.user || null,
            isAuthenticated: true,
            isLoading: false
          });
        }, 100);
        
        return true;
      } else {
        set({ 
          error: response.error || 'Registration failed',
          isLoading: false
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: 'Registration failed. Please try again.',
        isLoading: false
      });
      return false;
    }
  },

  logout: () => {
    const stopPlayer = usePlayerStore.getState().stopAndClosePlayer;
    stopPlayer();
    
    authService.logout();
    set({ 
      user: null,
      isAuthenticated: false
    });
  },

  loadUser: async () => {
    const currentUserId = get().user?.id;
    
    if (!authService.isAuthenticated()) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const isPublicPage = window.location.pathname === '/login' || 
                           window.location.pathname === '/register' || 
                           window.location.pathname === '/' || 
                           window.location.pathname === '';
      
      if (isPublicPage) {
        set({ isLoading: false });
        return;
      }
      
      const response = await userService.getCurrentUser();
      
      if (response.data) {
        if (currentUserId !== undefined && response.data.id !== currentUserId) {
          const stopPlayer = usePlayerStore.getState().stopAndClosePlayer;
          stopPlayer();
        }
        
        set({ 
          user: response.data,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        authService.logout();
        set({ 
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: response.error || 'Session expired'
        });
      }
    } catch (error) {
      authService.logout();
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired'
      });
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));
