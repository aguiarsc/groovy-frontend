import React, { useState, useEffect, ChangeEvent } from 'react';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import { albumService } from '../services/album.service';
import { songService } from '../services/song.service';
import { playlistService } from '../services/playlist.service';
import { artistService } from '../services/artist.service';
import { AlbumDto, SongDto, PlaylistDto, ArtistDto } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

type ContentType = 'albums' | 'songs' | 'playlists' | 'artists';

interface ExtendedAlbumDto extends AlbumDto {
  featured?: boolean;
}

/**
 * Admin Content Management Page
 * 
 * This component provides an interface for managing music content including albums, songs, playlists, and artists.
 * It supports CRUD operations and includes search functionality for easy content discovery.
 * The UI is organized in a tabbed layout for each content type.
 */
const AdminContentPage: React.FC = () => {
  const [contentType, setContentType] = useState<ContentType>('albums');
  const [albums, setAlbums] = useState<ExtendedAlbumDto[]>([]);
  const [songs, setSongs] = useState<SongDto[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistDto[]>([]);
  const [artists, setArtists] = useState<ArtistDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<PlaylistDto | null>(null);
  
  const [playlistFormData, setPlaylistFormData] = useState({
    name: '',
    userId: 0
  });

  useEffect(() => {
    fetchContent();
  }, [contentType]);

  const fetchContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (contentType === 'albums') {
        const response = await albumService.getAllAlbums();
        if (response.data) {
          setAlbums(response.data);
        } else {
          setError(response.error || 'Failed to fetch albums');
        }
      } else if (contentType === 'songs') {
        const response = await songService.getAllSongs();
        if (response.data) {
          setSongs(response.data);
        } else {
          setError(response.error || 'Failed to fetch songs');
        }
      } else if (contentType === 'playlists') {
        const response = await playlistService.getAllPlaylists();
        if (response.data) {
          setPlaylists(response.data);
        } else {
          setError(response.error || 'Failed to fetch playlists');
        }
      } else if (contentType === 'artists') {
        const response = await artistService.getAllArtists();
        if (response.data) {
          setArtists(response.data);
        } else {
          setError(response.error || 'Failed to fetch artists');
        }
      }
    } catch (error: any) {
      setError(`Error fetching ${contentType}: ${error.message || ''}`);
      console.error(`Error fetching ${contentType}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAlbum = async (albumId: number) => {
    if (!window.confirm('Are you sure you want to delete this album?')) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await albumService.deleteAlbum(albumId);
      if (response.status === 204 || response.status === 200) {
        setAlbums(albums.filter(album => album.id !== albumId));
        setSuccess('Album deleted successfully');
      } else if (response.error) {
        setError(response.error);
      } else {
        setError('Failed to delete album');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Unexpected error occurred');
      console.error('Error deleting album:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSong = async (songId: number) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await songService.deleteSong(songId);
      if (response.status === 204 || response.status === 200) {
        setSongs(songs.filter(song => song.id !== songId));
        setSuccess('Song deleted successfully');
      } else if (response.error) {
        setError(response.error);
      } else {
        setError('Failed to delete song');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Unexpected error occurred');
      console.error('Error deleting song:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await playlistService.deletePlaylist(playlistId);
      if (response.status === 204 || response.status === 200) {
        setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
        setSuccess('Playlist deleted successfully');
      } else {
        setError(response.error || 'Failed to delete playlist');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Unexpected error';
      setError(`Error deleting playlist: ${errorMessage}`);
      console.error('Error deleting playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArtist = async (artistId: number) => {
    if (!window.confirm('Are you sure you want to delete this artist?')) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await artistService.deleteArtist(artistId);
      if (response.status === 204 || response.status === 200) {
        setArtists(artists.filter(artist => artist.id !== artistId));
        setSuccess('Artist deleted successfully');
      } else if (response.error) {
        setError(response.error);
      } else {
        setError('Failed to delete artist');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Unexpected error occurred');
      console.error('Error deleting artist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlaylistFormData({
      ...playlistFormData,
      [name]: name === 'userId' ? parseInt(value) : value
    });
  };

  const resetForm = () => {
    setPlaylistFormData({
      name: '',
      userId: 0
    });
    setEditingPlaylist(null);
    setShowAddForm(false);
  };

  const startEditing = (playlist: PlaylistDto) => {
    setEditingPlaylist(playlist);
    setPlaylistFormData({
      name: playlist.name,
      userId: playlist.userId
    });
    setShowAddForm(true);
  };

  const handleAddPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!playlistFormData.name) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }
      
      if (editingPlaylist) {
        const response = await playlistService.updatePlaylist(
          editingPlaylist.id || 0, 
          {
            ...playlistFormData,
            id: editingPlaylist.id
          } as PlaylistDto
        );
        
        if (response.data) {
          setPlaylists(prevPlaylists => 
            prevPlaylists.map(playlist => 
              playlist.id === editingPlaylist.id ? response.data! : playlist
            )
          );
          setSuccess('Playlist updated successfully');
          resetForm();
        } else {
          setError(response.error || 'Failed to update playlist');
        }
      } else {
        const response = await playlistService.createPlaylist(playlistFormData as PlaylistDto);
        
        if (response.data) {
          setPlaylists(prevPlaylists => [...prevPlaylists, response.data!]);
          setSuccess('Playlist created successfully');
          resetForm();
        } else {
          setError(response.error || 'Failed to create playlist');
        }
      }
    } catch (error: any) {
      setError(`An error occurred: ${error.message || ''}`);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAlbums = albums.filter(album => 
    (album.title || album.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (album.artistName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (song.artistName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (song.albumName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPlaylists = playlists.filter(playlist => 
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (playlist.userName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArtists = artists.filter(artist => 
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-macchiato-base min-h-screen text-macchiato-text">
      <h1 className="text-3xl font-bold mb-6 text-macchiato-text">Content Management</h1>
      
      <div className="flex mb-6 space-x-4">
        <Button
          variant={contentType === 'albums' ? 'primary' : 'secondary'}
          onClick={() => setContentType('albums')}
        >
          Albums
        </Button>
        <Button
          variant={contentType === 'songs' ? 'primary' : 'secondary'}
          onClick={() => setContentType('songs')}
        >
          Songs
        </Button>
        <Button
          variant={contentType === 'playlists' ? 'primary' : 'secondary'}
          onClick={() => setContentType('playlists')}
        >
          Playlists
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/3">
          <Input
            type="text"
            placeholder={`Search ${contentType}...`}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        

      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {contentType === 'playlists' && showAddForm && (
        <Card className="mb-6 bg-macchiato-surface0/80 backdrop-blur-glass shadow-neumorphic-dark">
          <h2 className="text-xl font-semibold mb-4">
            {editingPlaylist ? 'Edit Playlist' : 'Add New Playlist'}
          </h2>
          
          <form onSubmit={handleAddPlaylist}>
            <div className="space-y-4">
              <Input
                label="Name"
                type="text"
                name="name"
                value={playlistFormData.name}
                onChange={handleInputChange}
                required
              />
              
              <Input
                label="User ID"
                type="number"
                name="userId"
                value={playlistFormData.userId.toString()}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                isLoading={isLoading}
              >
                {editingPlaylist ? 'Update Playlist' : 'Add Playlist'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : contentType === 'albums' ? (
        <>
          {/* Albums Table (Desktop) */}
          <div className="hidden md:block bg-macchiato-surface0/80 backdrop-blur-glass shadow-neumorphic-dark rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-macchiato-mantle">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider w-16">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider w-1/3">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider w-1/4">Artist</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider w-20">Cover</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-macchiato-surface1">
                  {filteredAlbums.length > 0 ? (
                    filteredAlbums.map(album => (
                      <tr key={album.id} className="hover:bg-macchiato-surface1/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-macchiato-text">
                          {album.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-macchiato-text max-w-xs truncate">
                          {album.title || album.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-macchiato-text max-w-xs truncate">
                          {album.artistName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {album.coverImage && (
                            <img
                              src={album.coverImage}
                              alt={album.title || album.name}
                              className="h-10 w-10 object-cover rounded"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            className="text-macchiato-red hover:text-macchiato-red/80 transition-colors"
                            onClick={() => handleDeleteAlbum(album.id || 0)}
                            title="Delete Album"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-macchiato-subtext0">
                        No albums found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Albums Card View (Mobile) */}
          <div className="block md:hidden space-y-4">
            {filteredAlbums.length > 0 ? (
              filteredAlbums.map(album => (
                <div key={album.id} className="glass-card rounded-lg p-4 shadow-neumorphic-dark">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-lg font-semibold text-macchiato-text">{album.title || album.name}</div>
                      <div className="text-macchiato-subtext0 text-sm">Artist: {album.artistName}</div>
                      <div className="text-macchiato-subtext0 text-xs">ID: {album.id}</div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-2">
                    <button
                      className="text-macchiato-red hover:text-macchiato-red/80 transition-colors text-xl"
                      onClick={() => handleDeleteAlbum(album.id || 0)}
                      title="Delete Album"
                      aria-label="Delete Album"
                    >
                      <FiTrash2 size={22} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-macchiato-subtext0 py-6">No albums found</div>
            )}
          </div>
        </>
      ) : contentType === 'songs' ? (
        <>
          {/* Songs Table (Desktop) */}
          <div className="hidden md:block bg-macchiato-surface0/80 backdrop-blur-glass shadow-neumorphic-dark rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-macchiato-mantle">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">Artist</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">Album</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-macchiato-surface1">
                  {filteredSongs.length > 0 ? (
                    filteredSongs.map(song => (
                      <tr key={song.id} className="hover:bg-macchiato-surface1/50">
                        <td className="px-6 py-4 whitespace-nowrap">{song.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{song.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{song.artistName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{song.albumName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              className="text-macchiato-red hover:text-macchiato-red/80 transition-colors"
                              onClick={() => handleDeleteSong(song.id || 0)}
                              title="Delete Song"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">No songs found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Songs Card View (Mobile) */}
          <div className="block md:hidden space-y-4">
            {filteredSongs.length > 0 ? (
              filteredSongs.map(song => (
                <div key={song.id} className="glass-card rounded-lg p-4 shadow-neumorphic-dark">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-lg font-semibold text-macchiato-text">{song.title}</div>
                      <div className="text-macchiato-subtext0 text-sm">Artist: {song.artistName}</div>
                      <div className="text-macchiato-subtext0 text-xs">ID: {song.id}</div>
                      <div className="text-macchiato-subtext0 text-xs">Duration: {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-2">
                    <button
                      className="text-macchiato-red hover:text-macchiato-red/80 transition-colors text-xl"
                      onClick={() => handleDeleteSong(song.id || 0)}
                      title="Delete Song"
                      aria-label="Delete Song"
                    >
                      <FiTrash2 size={22} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-macchiato-subtext0 py-6">No songs found</div>
            )}
          </div>
        </>
      ) : contentType === 'playlists' ? (
        <>
          {/* Playlists Table (Desktop) */}
          <div className="hidden md:block bg-macchiato-surface0/80 backdrop-blur-glass shadow-neumorphic-dark rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-macchiato-mantle">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">Songs</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-macchiato-surface1">
                  {filteredPlaylists.length > 0 ? (
                    filteredPlaylists.map(playlist => (
                      <tr key={playlist.id} className="hover:bg-macchiato-surface1/50">
                        <td className="px-6 py-4 whitespace-nowrap">{playlist.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{playlist.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{playlist.userName || playlist.userId}</td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-semibold">{playlist.songs?.length || 0} songs</span>
                            {playlist.songs && playlist.songs.length > 0 && (
                              <div className="mt-1 text-xs text-macchiato-subtext0">
                                <span className="font-medium">Song IDs:</span>{' '}
                                {playlist.songs.map(song => song.id).join(', ')}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              className="text-macchiato-blue hover:text-macchiato-mauve transition-colors"
                              onClick={() => startEditing(playlist)}
                              title="Edit Playlist"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              className="text-macchiato-red hover:text-macchiato-red/80 transition-colors"
                              onClick={() => handleDeletePlaylist(playlist.id || 0)}
                              title="Delete Playlist"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">No playlists found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Playlists Card View (Mobile) */}
          <div className="block md:hidden space-y-4">
            {filteredPlaylists.length > 0 ? (
              filteredPlaylists.map(playlist => (
                <div key={playlist.id} className="glass-card rounded-lg p-4 shadow-neumorphic-dark">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-lg font-semibold text-macchiato-text">{playlist.name}</div>
                      <div className="text-macchiato-subtext0 text-sm">User: {playlist.userName || playlist.userId}</div>
                      <div className="text-macchiato-subtext0 text-xs">ID: {playlist.id}</div>
                      <div className="text-macchiato-subtext0 text-xs">Songs: {playlist.songs?.length || 0}</div>
                      {playlist.songs && playlist.songs.length > 0 && (
                        <div className="mt-1 text-xs text-macchiato-subtext0">
                          <span className="font-medium">Song IDs:</span> {playlist.songs.map(song => song.id).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-2">
                    <button
                      onClick={() => startEditing(playlist)}
                      className="text-macchiato-blue hover:text-macchiato-mauve transition-colors text-xl"
                      title="Edit Playlist"
                      aria-label="Edit Playlist"
                    >
                      <FiEdit2 size={22} />
                    </button>
                    <button
                      onClick={() => handleDeletePlaylist(playlist.id || 0)}
                      className="text-macchiato-red hover:text-macchiato-red/80 transition-colors text-xl"
                      title="Delete Playlist"
                      aria-label="Delete Playlist"
                    >
                      <FiTrash2 size={22} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-macchiato-subtext0 py-6">No playlists found</div>
            )}
          </div>
        </>
      ) : contentType === 'artists' && (
        <div>
          {/* Artists Table (Desktop) */}
          <div className="hidden md:block bg-macchiato-surface0/80 backdrop-blur-glass shadow-neumorphic-dark rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-macchiato-mantle">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-macchiato-surface1">
                  {filteredArtists.length > 0 ? (
                    filteredArtists.map(artist => (
                      <tr key={artist.id} className="hover:bg-macchiato-surface1/50">
                        <td className="px-6 py-4 whitespace-nowrap">{artist.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{artist.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              className="text-macchiato-red hover:text-macchiato-red/80 transition-colors"
                              onClick={() => handleDeleteArtist(artist.id || 0)}
                              title="Delete Artist"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center">No artists found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Artists Card View (Mobile) */}
          <div className="block md:hidden space-y-4">
            {filteredArtists.length > 0 ? (
              filteredArtists.map(artist => (
                <div key={artist.id} className="glass-card rounded-lg p-4 shadow-neumorphic-dark">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-lg font-semibold text-macchiato-text">{artist.name}</div>
                      <div className="text-macchiato-subtext0 text-xs">ID: {artist.id}</div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-2">
                    <button
                      onClick={() => handleDeleteArtist(artist.id || 0)}
                      className="text-macchiato-red hover:text-macchiato-red/80 transition-colors text-xl"
                      title="Delete Artist"
                      aria-label="Delete Artist"
                    >
                      <FiTrash2 size={22} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-macchiato-subtext0 py-6">No artists found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminContentPage;
