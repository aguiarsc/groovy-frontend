import { ArtistDto, ApiResponse } from '../types';
import api from './api';

/**
 * Service for handling all artist-related API operations
 * 
 * This service encapsulates interactions with the artist endpoints of the backend API,
 * providing methods for:
 * - Retrieving and searching for artists
 * - Updating artist profiles and media
 * - Managing artist biographies and profile pictures
 */
export const artistService = {

  getAllArtists: async (): Promise<ApiResponse<ArtistDto[]>> => {
    try {
      const response = await api.get('/artists');
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error fetching artists:', error);
      return { 
        data: undefined, 
        error: 'Failed to fetch artists', 
        status: error.response?.status || 500 
      };
    }
  },

  getArtistById: async (id: number): Promise<ApiResponse<ArtistDto>> => {
    try {
      const response = await api.get(`/artists/${id}`);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error fetching artist with ID ${id}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to fetch artist details', 
        status: error.response?.status || 500 
      };
    }
  },

  searchArtists: async (query: string): Promise<ApiResponse<ArtistDto[]>> => {
    try {
      const response = await api.get('/artists/search', { params: { name: query } });
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error searching artists:', error);
      return { 
        data: undefined, 
        error: 'Failed to search artists', 
        status: error.response?.status || 500 
      };
    }
  },

  getArtistByName: async (name: string): Promise<ApiResponse<ArtistDto>> => {
    try {
      const searchResponse = await artistService.searchArtists(name);
      
      if (searchResponse.data && searchResponse.data.length > 0) {
        const exactMatch = searchResponse.data.find(
          artist => artist.name.toLowerCase() === name.toLowerCase()
        );
        
        if (exactMatch) {
          return { data: exactMatch, error: undefined, status: 200 };
        }

        return { data: searchResponse.data[0], error: undefined, status: 200 };
      }
      
      return { 
        data: undefined, 
        error: `No artist found with name: ${name}`, 
        status: 404 
      };
    } catch (error: any) {
      console.error(`Error fetching artist with name ${name}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to fetch artist details', 
        status: error.response?.status || 500 
      };
    }
  },
  
  updateArtist: async (artistData: Partial<ArtistDto>): Promise<ApiResponse<ArtistDto>> => {
    try {
      if (!artistData.id) {
        return {
          data: undefined,
          error: 'Artist ID is required for update',
          status: 400
        };
      }
      
      const response = await api.put(`/artists/${artistData.id}`, artistData);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error updating artist:', error);
      return { 
        data: undefined, 
        error: 'Failed to update artist', 
        status: error.response?.status || 500 
      };
    }
  },

  uploadProfilePicture: async (artistId: number, file: File): Promise<ApiResponse<ArtistDto>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/artists/${artistId}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      return { 
        data: undefined, 
        error: 'Failed to upload profile picture', 
        status: error.response?.status || 500 
      };
    }
  },

  updateBiography: async (artistId: number, biography: string): Promise<ApiResponse<ArtistDto>> => {
    try {
      const response = await api.put(`/artists/${artistId}/biography`, { biography });
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error updating artist biography with ID ${artistId}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to update artist biography', 
        status: error.response?.status || 500 
      };
    }
  },

  deleteArtist: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/artists/${id}`);
      return { data: undefined, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error deleting artist with ID ${id}:`, error);
      // Advanced error message extraction for better user feedback
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data && typeof error.response.data === 'string' ? error.response.data : null) ||
                          'Failed to delete artist';
      return { 
        data: undefined, 
        error: errorMessage, 
        status: error.response?.status || 500 
      };
    }
  }
};
