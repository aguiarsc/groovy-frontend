import { AlbumDto, ApiResponse } from '../types';
import api from './api';

/**
 * Service for handling all album-related API operations
 * 
 * This service encapsulates interactions with the album endpoints of the backend API,
 * providing methods for:
 * - Retrieving and searching albums
 * - Creating, updating, and deleting albums
 * - Managing album covers
 * - Filtering albums by artist
 */
export const albumService = {

  getAllAlbums: async (): Promise<ApiResponse<AlbumDto[]>> => {
    try {
      const response = await api.get('/albums');
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error fetching albums:', error);
      return { 
        data: undefined, 
        error: 'Failed to fetch albums', 
        status: error.response?.status || 500 
      };
    }
  },

  getAlbumById: async (id: number): Promise<ApiResponse<AlbumDto>> => {
    try {
      const response = await api.get(`/albums/${id}`);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error fetching album with ID ${id}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to fetch album details', 
        status: error.response?.status || 500 
      };
    }
  },

  getAlbumsByArtistId: async (artistId: number): Promise<ApiResponse<AlbumDto[]>> => {
    try {
      const response = await api.get(`/albums/artist/${artistId}`);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error fetching albums for artist ${artistId}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to fetch artist albums', 
        status: error.response?.status || 500 
      };
    }
  },

  searchAlbums: async (query: string): Promise<ApiResponse<AlbumDto[]>> => {
    try {
      const response = await api.get('/albums/search', { params: { name: query } });
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error searching albums:', error);
      return { 
        data: undefined, 
        error: 'Failed to search albums', 
        status: error.response?.status || 500 
      };
    }
  },

  createAlbum: async (albumData: AlbumDto): Promise<ApiResponse<AlbumDto>> => {
    try {
      const response = await api.post('/albums', albumData);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error creating album:', error);
      return { 
        data: undefined, 
        error: 'Failed to create album', 
        status: error.response?.status || 500 
      };
    }
  },
  
  uploadAlbumCover: async (albumId: number, coverFile: File): Promise<ApiResponse<string>> => {
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', coverFile);
      
      // Use multipart/form-data content type for file uploads
      const response = await api.post(`/albums/${albumId}/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error uploading cover for album ${albumId}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to upload album cover', 
        status: error.response?.status || 500 
      };
    }
  },

  updateAlbum: async (id: number, albumData: AlbumDto): Promise<ApiResponse<AlbumDto>> => {
    try {
      const response = await api.put(`/albums/${id}`, albumData);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error updating album with ID ${id}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to update album', 
        status: error.response?.status || 500 
      };
    }
  },

  deleteAlbum: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/albums/${id}`);
      return { 
        data: undefined, 
        error: undefined, 
        status: response.status 
      };
    } catch (error: any) {
      console.error(`Error deleting album with ID ${id}:`, error);
      
      let errorMessage = 'Failed to delete album';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } 
        else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } 
        else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } 
      else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        data: undefined, 
        error: errorMessage, 
        status: error.response?.status || 500 
      };
    }
  }
};
