import { SongDto, ApiResponse } from '../types';
import api from './api';

/**
 * Service for handling all song-related API operations
 * 
 * This service encapsulates interactions with the song endpoints of the backend API,
 * providing methods for:
 * - Retrieving, creating, updating, and deleting songs
 * - Searching for songs
 * - Managing song files and streaming
 * - Handling user favorites
 */
export const songService = {

  getAllSongs: async (): Promise<ApiResponse<SongDto[]>> => {
    try {
      const response = await api.get('/songs');
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      return { 
        data: undefined, 
        error: 'Failed to fetch songs', 
        status: error.response?.status || 500 
      };
    }
  },

  getSongById: async (id: number): Promise<ApiResponse<SongDto>> => {
    try {
      const response = await api.get(`/songs/${id}`);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      return { 
        data: undefined, 
        error: 'Failed to fetch song details', 
        status: error.response?.status || 500 
      };
    }
  },

  searchSongs: async (query: string): Promise<ApiResponse<SongDto[]>> => {
    try {
      const response = await api.get('/songs/search', { params: { title: query } });
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      return { 
        data: undefined, 
        error: 'Failed to search songs', 
        status: error.response?.status || 500 
      };
    }
  },

  createSong: async (songData: SongDto, file: File): Promise<ApiResponse<SongDto>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('song', new Blob([JSON.stringify(songData)], { type: 'application/json' }));

      const response = await api.post('/songs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      return { 
        data: undefined, 
        error: 'Failed to create song', 
        status: error.response?.status || 500 
      };
    }
  },

  uploadSong: async (formData: FormData): Promise<ApiResponse<SongDto>> => {
    try {
      const songDto = {
        title: formData.get('title') as string,
        albumId: parseInt(formData.get('albumId') as string),
        duration: parseFloat(formData.get('duration') as string)
      };
      
      const apiFormData = new FormData();
      apiFormData.append('song', new Blob([JSON.stringify(songDto)], { type: 'application/json' }));
      apiFormData.append('audioFile', formData.get('file') as File);

      const customFilename = formData.get('customFilename');
      if (customFilename) {
        apiFormData.append('customFilename', customFilename as string);
      }
      
      const response = await api.post('/songs', apiFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      return { 
        data: undefined, 
        error: error.response?.data?.message || 'Failed to upload song', 
        status: error.response?.status || 500 
      };
    }
  },

  updateSong: async (id: number, songData: SongDto): Promise<ApiResponse<SongDto>> => {
    try {
      const response = await api.put(`/songs/${id}`, songData);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      return { 
        data: undefined, 
        error: 'Failed to update song', 
        status: error.response?.status || 500 
      };
    }
  },

  deleteSong: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/songs/${id}`);
      return { data: undefined, error: undefined, status: response.status };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data && typeof error.response.data === 'string' ? error.response.data : null) ||
                          'Failed to delete song';
      return { 
        data: undefined, 
        error: errorMessage, 
        status: error.response?.status || 500 
      };
    }
  },

  getSongFilePath: async (id: number): Promise<string> => {
    try {
      if (id <= 7) {
        const songMappings: Record<number, string> = {
          1: 'just-dippin_snoop-dogg.mp3',
          2: 'mercy_kanye-west.mp3',
          3: 'no-vaseline_ice-cube.mp3',
          4: 'still-dre_dr-dre.mp3',
          5: 'rap-god_eminem.mp3',
          6: 'ny-state-of-mind_nas.mp3',
          7: 'when-i-b-on-the-mic_rakim.mp3'
        };
        return songMappings[id] || `song_${id}.mp3`;
      }
      
      const response = await api.get(`/songs/${id}`);
      const songData = response.data;
      
      if (songData && songData.filePath) {
        const filename = songData.filePath.split('/').pop();
        return filename;
      }
      
      return `song_${id}.mp3`;
    } catch (error: any) {
      return `song_${id}.mp3`;
    }
  },

  getStreamUrl: async (id: number): Promise<string> => {
    const filePath = await songService.getSongFilePath(id);
    return `${api.defaults.baseURL}/files/${filePath}`;
  },

  getFavorites: async (userId: number): Promise<ApiResponse<SongDto[]>> => {
    try {
      const response = await api.get(`/users/${userId}/favorites`);
      return { data: response.data, error: undefined, status: response.status };
    } catch (error: any) {
      return { 
        data: undefined, 
        error: 'Failed to fetch favorites', 
        status: error.response?.status || 500 
      };
    }
  },

  addToFavorites: async (userId: number, songId: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.post(`/users/${userId}/favorites/${songId}`);
      return { data: undefined, error: undefined, status: response.status };
    } catch (error: any) {
      return { 
        data: undefined, 
        error: 'Failed to add song to favorites', 
        status: error.response?.status || 500 
      };
    }
  },

  removeFromFavorites: async (userId: number, songId: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/users/${userId}/favorites/${songId}`);
      return { data: undefined, error: undefined, status: response.status };
    } catch (error: any) {
      return { 
        data: undefined, 
        error: 'Failed to remove song from favorites', 
        status: error.response?.status || 500 
      };
    }
  }
};
