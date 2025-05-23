import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPlay, FiPause, FiPlus, FiTrash2 } from 'react-icons/fi';
import { SongCard } from '../components/music/SongCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { playlistService } from '../services/playlist.service';
import { songService } from '../services/song.service';
import { PlaylistDto, SongDto } from '../types';
import { generatePlaylistCover } from '../utils/imageGenerator';
import { usePlayer } from '../hooks/usePlayer';
import { useAuth } from '../hooks/useAuth';

/**
 * Playlist Detail Page
 * 
 * Displays a single playlist with its songs and provides management functionality.
 * Handles playlist editing, song addition/removal, and playback controls.
 * Supports searching and adding new songs to the playlist.
 */
import { useNavigate } from 'react-router-dom';

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<PlaylistDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SongDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { playQueue, isPlaying, currentSong, togglePlay } = usePlayer();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isCurrentPlaylist = playlist?.songs?.some(song => song.id === currentSong?.id);
  const isOwner = user?.id === playlist?.userId;
  
  const handleDeletePlaylist = async () => {
    if (!playlist?.id) return;
    if (!window.confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) return;
    try {
      await playlistService.deletePlaylist(playlist.id);
      navigate('/playlists');
    } catch (err) {
      alert('Failed to delete playlist.');
    }
  };
  
  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await playlistService.getPlaylistById(parseInt(id, 10));
        if (response.data) {
          setPlaylist(response.data);
          setPlaylistName(response.data.name || '');
        } else {
          setError('Playlist not found');
        }
      } catch (err) {
        console.error('Error fetching playlist:', err);
        setError('Failed to load playlist');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlaylist();
  }, [id]);
  
  const handlePlayPlaylist = () => {
    if (!playlist?.songs || playlist.songs.length === 0) return;
    
    if (isCurrentPlaylist && isPlaying) {
      togglePlay();
    } else {
      playQueue(playlist.songs, 0);
    }
  };
  
  const handleUpdatePlaylistName = async () => {
    if (!playlist?.id || !playlistName.trim()) return;
    
    try {
      const updatedPlaylist: PlaylistDto = {
        ...playlist,
        name: playlistName
      };
      
      const response = await playlistService.updatePlaylist(playlist.id, updatedPlaylist);
      
      if (response.data) {
        setPlaylist(response.data);
        setIsEditing(false);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Error updating playlist:', err);
      setError('Failed to update playlist name');
    }
  };
  
  const handleSearchSongs = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const response = await songService.searchSongs(searchQuery);
      if (response.data) {
        const playlistSongIds = new Set(playlist?.songs?.map(song => song.id) || []);
        const filteredResults = response.data.filter(song => !playlistSongIds.has(song.id));
        setSearchResults(filteredResults);
      }
    } catch (err) {
      console.error('Error searching songs:', err);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleAddSongToPlaylist = async (song: SongDto) => {
    if (!playlist?.id || !song.id) return;
    
    try {
      const response = await playlistService.addSongToPlaylist(playlist.id, song.id);
      if (response.data) {
        setPlaylist(response.data);
        // Remove the song from search results
        setSearchResults(searchResults.filter(s => s.id !== song.id));
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Error adding song to playlist:', err);
      setError('Failed to add song to playlist');
    }
  };
  
  const handleRemoveSongFromPlaylist = async (songId: number) => {
    if (!playlist?.id) return;
    
    try {
      const response = await playlistService.removeSongFromPlaylist(playlist.id, songId);
      if (response.data) {
        setPlaylist(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Error removing song from playlist:', err);
      setError('Failed to remove song from playlist');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
      </div>
    );
  }
  
  if (error || !playlist) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold text-macchiato-text mb-4">{error || 'Playlist not found'}</h2>
        <Link to="/playlists">
          <Button variant="primary">Back to Playlists</Button>
        </Link>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 h-64 bg-macchiato-surface0 rounded-lg shadow-neumorphic-dark flex items-center justify-center flex-shrink-0 overflow-hidden">
          {playlist.coverImage ? (
            <img 
              src={playlist.coverImage} 
              alt={`${playlist.name} cover`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={generatePlaylistCover(playlist.name, playlist.id)} 
              alt={playlist.name} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <div className="mb-4">
              <Input
                label="Playlist Name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                fullWidth
              />
              <div className="flex space-x-2 mt-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setPlaylistName(playlist.name || '');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpdatePlaylistName}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-macchiato-text">{playlist.name}</h1>
              {isOwner && (
                <div className="flex flex-col items-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-2"
                    onClick={handleDeletePlaylist}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <p className="text-macchiato-subtext0 mb-4">
            Created by {playlist.userName} • {playlist.songs?.length || 0} songs
          </p>
          
          <div className="flex space-x-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handlePlayPlaylist}
              disabled={!playlist.songs || playlist.songs.length === 0}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isCurrentPlaylist && isPlaying ? (
                  <>
                    <FiPause style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <FiPlay style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
                    <span>Play</span>
                  </>
                )}
              </div>
            </Button>
          </div>
        </div>
      </div>
      
      {isOwner && (
        <Card className="p-4">
          <h2 className="text-xl font-semibold text-macchiato-text mb-4">Add Songs</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search for songs to add"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
            
            <Button
              variant="primary"
              onClick={handleSearchSongs}
              isLoading={isSearching}
            >
              Search
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-medium text-macchiato-text mb-2">Search Results</h3>
              
              {searchResults.map((song) => (
                <div key={song.id} className="flex items-center justify-between p-3 bg-macchiato-surface0/50 rounded-lg">
                  <div>
                    <p className="text-macchiato-text font-medium">{song.title}</p>
                    <p className="text-macchiato-subtext0 text-sm">{song.artistName} • {song.albumName}</p>
                  </div>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAddSongToPlaylist(song)}
                    className="flex items-center"
                  >
                    <FiPlus className="mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-macchiato-text">Songs</h2>
          <span className="text-sm text-macchiato-subtext0">{playlist.songs?.length || 0} songs</span>
        </div>
        
        {playlist.songs && playlist.songs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {playlist.songs.map((song) => (
              <div key={song.id} className="relative group">
                <SongCard 
                  song={song}
                  compact
                />
                {isOwner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      song.id && handleRemoveSongFromPlaylist(song.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-macchiato-base/80 backdrop-blur-sm rounded-full text-macchiato-overlay1 hover:text-macchiato-red transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from playlist"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-macchiato-subtext0 mb-4">This playlist is empty</p>
            {isOwner && (
              <p className="text-macchiato-text">Use the search above to add songs to your playlist</p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};
