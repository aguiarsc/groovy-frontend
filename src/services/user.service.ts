import { UserDto, ApiResponse } from '../types';
import api from './api';

/**
 * Service for handling all user-related API operations
 * 
 * This service encapsulates interactions with the user endpoints of the backend API,
 * providing methods for:
 * - User authentication and profile management
 * - Account creation and modification
 * - User data retrieval
 */
export const userService = {

  getUserById: async (id: string): Promise<ApiResponse<UserDto>> => {
    try {
      const response = await api.get(`/users/${id}`);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error fetching user with ID ${id}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to fetch user details', 
        status: error.response?.status || 500 
      };
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<UserDto>> => {
    try {
      const response = await api.get('/users/me');
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      return { 
        data: undefined, 
        error: 'Failed to fetch user profile', 
        status: error.response?.status || 500 
      };
    }
  },

  getAllUsers: async (): Promise<ApiResponse<UserDto[]>> => {
    try {
      const response = await api.get('/users');
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error fetching all users:', error);
      return { 
        data: undefined, 
        error: 'Failed to fetch users', 
        status: error.response?.status || 500 
      };
    }
  },

  createUser: async (userData: Partial<UserDto>): Promise<ApiResponse<UserDto>> => {
    try {
      console.log('Creating user with data:', userData);
      const response = await api.post('/users', userData);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error creating user:', error);

      const errorMessage = error.response?.data?.message || 'Failed to create user';
      const errorDetails = error.response?.data?.details || '';
      const fullErrorMessage = errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage;
      
      return { 
        data: undefined, 
        error: fullErrorMessage, 
        status: error.response?.status || 500 
      };
    }
  },

  updateUser: async (id: number, userData: Partial<UserDto>): Promise<ApiResponse<UserDto>> => {
    try {
      console.log('Updating user with data:', userData);
      const response = await api.put(`/users/${id}`, userData);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error updating user:', error);

      const errorMessage = error.response?.data?.message || 'Failed to update user profile';
      const errorDetails = error.response?.data?.details || '';
      const fullErrorMessage = errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage;
      
      return { 
        data: undefined, 
        error: fullErrorMessage, 
        status: error.response?.status || 500 
      };
    }
  },
  
  deleteUser: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/users/${id}`);
      if (response.status === 204) {
        return { data: undefined, error: undefined, status: response.status };
      } else {
        throw response;
      }
    } catch (error: any) {
      console.error(`Error deleting user with ID ${id}:`, error);
      
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data && typeof error.response.data === 'string' ? error.response.data : null) ||
                          'Failed to delete user';
      
      return { 
        data: undefined, 
        error: errorMessage, 
        status: error.response?.status || 500 
      };
    }
  }
};
