import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types';
import { authService } from './auth.service';
import config from '../config';

const api = axios.create({
  baseURL: `${config.API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Flag to prevent multiple concurrent auth error handling
 * This prevents redirect loops and multiple logout attempts
 */
let isHandlingAuthError = false;

/**
 * Utility function to check if the current page is a public page
 * Used to determine if redirection is needed after auth errors
 * 
 * @returns {boolean} True if the current page is a login or landing page
 */
const isLoginOrLandingPage = () => {
  return window.location.pathname === '/login' || 
         window.location.pathname === '/register' || 
         window.location.pathname === '/';
};

/**
 * Request interceptor for handling authentication
 * 
 * This interceptor:
 * 1. Checks for an expired token before request is sent
 * 2. Adds the authorization header to requests when a token exists
 */
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    
    if (token && authService.isTokenExpired()) {
      authService.logout();
      return config;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling API errors
 * 
 * This interceptor provides consistent error handling for:
 * 1. Formatting error messages from various response formats
 * 2. Handling authentication errors (401, 403) by logging out and redirecting
 * 3. Preventing multiple auth error handling processes
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/');

    let errorMessage = 'An unexpected error occurred';
    if (error.response?.data) {
      const data = error.response.data as any;
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      }
    }
    
    error.message = errorMessage;

    if (error.response?.status === 403 && !isAuthEndpoint && !isHandlingAuthError) {
      if (error.config) {
      }
      
      if (authService.isTokenExpired()) {
        isHandlingAuthError = true;
        
        setTimeout(() => {
          authService.logout();
          isHandlingAuthError = false;
          
          if (!isLoginOrLandingPage()) {
            window.location.href = '/login';
          }
        }, 100);
      }
    }
    
    if (error.response?.status === 401 && !isAuthEndpoint && !isHandlingAuthError) {
      isHandlingAuthError = true;
      
      setTimeout(() => {
        authService.logout();
        isHandlingAuthError = false;
        
        if (!isLoginOrLandingPage()) {
          window.location.href = '/login';
        }
      }, 100);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Standardized API request function that wraps the Axios instance
 * 
 * This function:
 * 1. Provides a consistent response format for all API requests
 * 2. Handles errors gracefully and standardizes error formats
 * 3. Returns a typed ApiResponse object with data, error, and status
 * 
 * @template T The expected response data type
 * @param {AxiosRequestConfig} config Axios request configuration
 * @returns {Promise<ApiResponse<T>>} Promise resolving to a standardized API response
 */
export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await api(config);
    return {
      data: response.data,
      error: undefined,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: undefined,
      error: axiosError.response?.data as string || axiosError.message,
      status: axiosError.response?.status || 500,
    };
  }
};

export default api;
