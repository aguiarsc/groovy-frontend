import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { playlistService } from '../services/playlist.service';
import { useAuth } from '../hooks/useAuth';
import { PlaylistDto } from '../types';

/**
 * Playlists Page
 * 
 * Displays a user's playlists with options to create, view, and delete playlists.
 * Handles playlist management including creation and deletion.
 * Provides a responsive grid layout of playlist cards with hover actions.
 */
export const PlaylistsPage: React.FC = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<PlaylistDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await playlistService.getPlaylistsByUserId(user.id);
        if (response.data) {
          setPlaylists(response.data);
        } else if (response.error) {
          setError(response.error);
        }
      } catch (err) {
        console.error('Error fetching playlists:', err);
        setError('Failed to load playlists');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlaylists();
  }, [user]);
  
  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPlaylistName.trim() || !user?.id) {
      setError('Please enter a playlist name');
      return;
    }
    
    try {
      const newPlaylist: Partial<PlaylistDto> = {
        name: newPlaylistName,
        userId: user.id,
        songs: []
      };
      
      const response = await playlistService.createPlaylist(newPlaylist as PlaylistDto);
      
      if (response.data) {
        setPlaylists([...playlists, response.data]);
        setNewPlaylistName('');
        setIsCreating(false);
        setError(null);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
      setError('Failed to create playlist');
    }
  };
  
  const handleDeletePlaylist = async (playlistId: number) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) {
      return;
    }
    
    try {
      const response = await playlistService.deletePlaylist(playlistId);
      
      if (response.status >= 200 && response.status < 300) {
        setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Error deleting playlist:', err);
      setError('Failed to delete playlist');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-macchiato-text">Your Playlists</h1>
          {playlists.length > 0 && (
            <p className="text-macchiato-subtext0">{playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}</p>
          )}
        </div>
        
        <Button
          variant="primary"
          onClick={() => setIsCreating(true)}
          className="flex items-center justify-center md:justify-start w-full md:w-auto"
        >
          Create Playlist
        </Button>
      </div>
      
      {error && (
        <div className="bg-macchiato-red/20 border border-macchiato-red text-macchiato-red px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {isCreating && (
        <Card className="p-4">
          <h2 className="text-xl font-semibold text-macchiato-text mb-4">Create New Playlist</h2>
          
          <form onSubmit={handleCreatePlaylist} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                fullWidth
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsCreating(false);
                  setNewPlaylistName('');
                  setError(null);
                }}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
              >
                Create
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {playlists.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-macchiato-subtext0 mb-4">You don't have any playlists yet</p>
          <Button
            variant="primary"
            onClick={() => setIsCreating(true)}
          >
            Create one
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="relative transform transition-all duration-300 hover:scale-105">
              <div className="relative group">
                <PlaylistCard 
                  playlist={playlist} 
                  className="h-full"
                />
                
                <div className="absolute top-2 right-2 space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button 
                    className="w-7 h-7 rounded-full bg-macchiato-surface0/90 backdrop-blur-sm text-macchiato-text hover:text-macchiato-red flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (playlist.id) {
                        handleDeletePlaylist(playlist.id);
                      }
                    }}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
