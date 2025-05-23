import { PlaylistDto, ApiResponse } from '../types';
import api from './api';

/**
 * Service for handling all playlist-related API operations
 * 
 * This service encapsulates interactions with the playlist endpoints, providing
 * methods for:
 * - Retrieving, creating, updating, and deleting playlists
 * - Managing playlist contents (adding/removing songs)
 * - Fetching user-specific playlists
 */
export const playlistService = {

  getAllPlaylists: async (): Promise<ApiResponse<PlaylistDto[]>> => {
    try {
      const response = await api.get('/playlists');
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error fetching playlists:', error);
      return { 
        data: undefined, 
        error: 'Failed to fetch playlists', 
        status: error.response?.status || 500 
      };
    }
  },

  getPlaylistById: async (id: number): Promise<ApiResponse<PlaylistDto>> => {
    try {
      const response = await api.get(`/playlists/${id}`);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error fetching playlist with ID ${id}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to fetch playlist details', 
        status: error.response?.status || 500 
      };
    }
  },

  getPlaylistsByUserId: async (userId: number): Promise<ApiResponse<PlaylistDto[]>> => {
    try {
      const response = await api.get(`/playlists/user/${userId}`);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error fetching playlists for user ${userId}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to fetch user playlists', 
        status: error.response?.status || 500 
      };
    }
  },

  createPlaylist: async (playlistData: PlaylistDto): Promise<ApiResponse<PlaylistDto>> => {
    try {
      const response = await api.post('/playlists', playlistData);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error('Error creating playlist:', error);
      return { 
        data: undefined, 
        error: 'Failed to create playlist', 
        status: error.response?.status || 500 
      };
    }
  },
  
  updatePlaylist: async (id: number, playlistData: PlaylistDto): Promise<ApiResponse<PlaylistDto>> => {
    try {
      const response = await api.put(`/playlists/${id}`, playlistData);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error updating playlist with ID ${id}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to update playlist', 
        status: error.response?.status || 500 
      };
    }
  },

  deletePlaylist: async (id: number): Promise<ApiResponse<void>> => {
    try {
      console.log(`Attempting to delete playlist with ID ${id}`);
      const response = await api.delete(`/playlists/${id}`);
      console.log('Delete playlist response:', response);
      return { data: undefined, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error deleting playlist with ID ${id}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to delete playlist', 
        status: error.response?.status || 500 
      };
    }
  },

  addSongToPlaylist: async (playlistId: number, songId: number): Promise<ApiResponse<PlaylistDto>> => {
    try {
      const response = await api.post(`/playlists/${playlistId}/songs/${songId}`);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error adding song ${songId} to playlist ${playlistId}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to add song to playlist', 
        status: error.response?.status || 500 
      };
    }
  },

  removeSongFromPlaylist: async (playlistId: number, songId: number): Promise<ApiResponse<PlaylistDto>> => {
    try {
      const response = await api.delete(`/playlists/${playlistId}/songs/${songId}`);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      console.error(`Error removing song ${songId} from playlist ${playlistId}:`, error);
      return { 
        data: undefined, 
        error: 'Failed to remove song from playlist', 
        status: error.response?.status || 500 
      };
    }
  }
};
