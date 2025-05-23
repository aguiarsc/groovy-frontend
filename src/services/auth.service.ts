import { UserDto, ApiResponse } from '../types';
import api from './api';

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponseData {
  token: string;
  user?: UserDto;
}

/**
 * Authentication service for handling user authentication
 * 
 * This service manages:
 * - User login and registration
 * - JWT token storage, validation, and expiration
 * - Authentication state checks
 */
class AuthService {

  async login(loginRequest: LoginRequest): Promise<ApiResponse<AuthResponseData>> {
    try {
      const response = await api.post('/auth/login', loginRequest);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      return { 
        data: undefined, 
        error: error.response?.data?.message || 'Login failed',
        status: error.response?.status
      };
    }
  }

  async register(userData: UserDto): Promise<ApiResponse<AuthResponseData>> {
    try {
      const response = await api.post('/auth/register', userData);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      return { 
        data: undefined, 
        error: error.response?.data?.message || 'Registration failed',
        status: error.response?.status
      };
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    return !this.isTokenExpired();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getTokenExpiration(token: string): Date | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        return new Date(payload.exp * 1000);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      const expiration = this.getTokenExpiration(token);
      if (!expiration) return true;

      const now = new Date();
      now.setSeconds(now.getSeconds() + 10);
      
      return expiration < now;
    } catch (error) {

      return true;
    }
  }
}

export const authService = new AuthService();
