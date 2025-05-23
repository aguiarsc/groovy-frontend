import { SongDto, ApiResponse } from '../types';
import api from './api';

/**
 * Service for managing user's favorite songs
 * 
 * This service encapsulates interactions with the favorites endpoints of the backend API,
 * providing methods for:
 * - Retrieving a user's favorite songs
 * - Adding and removing songs from favorites
 * - Checking if a song is in the user's favorites
 */
export const favoriteService = {

  getFavorites: async (): Promise<ApiResponse<SongDto[]>> => {
    try {
      const response = await api.get('/favorites');
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
      return { 
        data: undefined, 
        error: 'Failed to fetch favorites', 
        status: error.response?.status || 500 
      };
    }
  },

  addToFavorites: async (songId: number): Promise<ApiResponse<boolean>> => {
    try {
      const response = await api.post(`/favorites/${songId}`);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error adding song ${songId} to favorites:`, error);
      return { 
        data: undefined, 
        error: 'Failed to add song to favorites', 
        status: error.response?.status || 500 
      };
    }
  },

  removeFromFavorites: async (songId: number): Promise<ApiResponse<boolean>> => {
    try {
      const response = await api.delete(`/favorites/${songId}`);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error removing song ${songId} from favorites:`, error);
      return { 
        data: undefined, 
        error: 'Failed to remove song from favorites', 
        status: error.response?.status || 500 
      };
    }
  },

  isFavorite: async (songId: number): Promise<ApiResponse<boolean>> => {
    try {
      const response = await api.get(`/favorites/status/${songId}`);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error checking favorite status for song ${songId}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to check favorite status', 
        status: error.response?.status || 500 
      };
    }
  }
};

export default favoriteService;
