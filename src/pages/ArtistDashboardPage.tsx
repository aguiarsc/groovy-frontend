import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiUpload, FiDisc, FiMusic, FiPlay, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { AlbumCard } from '../components/music/AlbumCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { albumService } from '../services/album.service';
import { songService } from '../services/song.service';
import { useAuth } from '../hooks/useAuth';
import { AlbumDto } from '../types';

/**
 * Artist Dashboard Page
 * 
 * Provides artists with an overview of their music catalog and statistics.
 * Displays albums, tracks, and basic analytics in a clean, interactive interface.
 * Includes functionality to manage albums and songs with edit/delete options.
 */
export const ArtistDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedAlbums, setExpandedAlbums] = useState<number[]>([]);
  
  useEffect(() => {
    const fetchArtistAlbums = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await albumService.getAlbumsByArtistId(user.id);
        if (response.data) {
          setAlbums(response.data);
        } else if (response.error) {
          setError(response.error);
        }
      } catch (err) {
        console.error('Error fetching artist albums:', err);
        setError('Failed to load your albums');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArtistAlbums();
  }, [user]);
  
  const handleDeleteAlbum = async (albumId: number) => {
    if (!window.confirm('Are you sure you want to delete this album? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await albumService.deleteAlbum(albumId);
      
      if (response.status >= 200 && response.status < 300) {
        setAlbums(albums.filter(album => album.id !== albumId));
        setSuccess('Album deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else if (response.error) {
        setError(response.error);
        setTimeout(() => setError(null), 5000);
      }
    } catch (err: any) {
      console.error('Error deleting album:', err);
      setError(err.message || 'Failed to delete album');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteSong = async (songId: number, albumId: number) => {
    if (!window.confirm('Are you sure you want to delete this song? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await songService.deleteSong(songId);
      
      if (response.status >= 200 && response.status < 300) {
        setAlbums(albums.map(album => {
          if (album.id === albumId) {
            return {
              ...album,
              songs: album.songs?.filter(song => song.id !== songId) || []
            };
          }
          return album;
        }));
        setSuccess('Song deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else if (response.error) {
        setError(response.error);
        setTimeout(() => setError(null), 5000);
      }
    } catch (err: any) {
      console.error('Error deleting song:', err);
      setError(err.message || 'Failed to delete song');
      setTimeout(() => setError(null), 5000);
    }
  };

  const toggleAlbumExpand = (albumId: number | undefined) => {
    if (!albumId) return;
    
    if (expandedAlbums.includes(albumId)) {
      setExpandedAlbums(expandedAlbums.filter(id => id !== albumId));
    } else {
      setExpandedAlbums([...expandedAlbums, albumId]);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
      </div>
    );
  }
  
  if (!user || user.role !== 'ARTIST') {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold text-macchiato-text mb-4">Access Denied</h2>
        <p className="text-macchiato-subtext0 mb-4">You must be logged in as an artist to access the dashboard.</p>
        <Link to="/login">
          <Button variant="primary">Go to Login</Button>
        </Link>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-macchiato-text">Artist Dashboard</h1>
        
        <div className="flex space-x-3">
          <Link to="/artist/upload">
            <Button
              variant="primary"
              className="flex items-center"
            >
              <FiUpload className="mr-2" />
              Upload Music
            </Button>
          </Link>
          
          <Link to="/artist/profile">
            <Button
              variant="secondary"
              className="flex items-center"
            >
              <FiEdit className="mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="bg-macchiato-red/20 border border-macchiato-red text-macchiato-red px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-macchiato-green/20 border border-macchiato-green text-macchiato-green px-4 py-3 rounded-lg">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-macchiato-mauve/20 flex items-center justify-center mr-4">
              <FiDisc className="text-macchiato-mauve" size={24} />
            </div>
            <div>
              <p className="text-macchiato-subtext0 text-sm">Total Albums</p>
              <p className="text-2xl font-bold text-macchiato-text">{albums.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-macchiato-blue/20 flex items-center justify-center mr-4">
              <FiMusic className="text-macchiato-blue" size={24} />
            </div>
            <div>
              <p className="text-macchiato-subtext0 text-sm">Total Songs</p>
              <p className="text-2xl font-bold text-macchiato-text">
                {albums.reduce((total, album) => total + (album.songs?.length || 0), 0)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-macchiato-green/20 flex items-center justify-center mr-4">
              <FiPlay className="text-macchiato-green" size={24} />
            </div>
            <div>
              <p className="text-macchiato-subtext0 text-sm">Total Plays</p>
              <p className="text-2xl font-bold text-macchiato-text">0</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-macchiato-text">Your Albums</h2>
          
          <Link to="/artist/upload">
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center"
            >
              <FiPlus className="mr-1" />
              New Album
            </Button>
          </Link>
        </div>
        
        {albums.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-macchiato-subtext0 mb-4">You haven't uploaded any albums yet</p>
            <Link to="/artist/upload">
              <Button variant="primary">Upload Your First Album</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albums.map((album) => (
              <div key={album.id} className="relative group">
                <AlbumCard album={album} />
                
                <div className="absolute top-2 right-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/artist/albums/${album.id}/edit`}>
                    <button className="w-8 h-8 rounded-full bg-macchiato-surface0/80 backdrop-blur-glass text-macchiato-text hover:text-macchiato-mauve flex items-center justify-center">
                      <FiEdit size={16} />
                    </button>
                  </Link>
                  
                  <button 
                    className="w-8 h-8 rounded-full bg-macchiato-surface0/80 backdrop-blur-glass text-macchiato-text hover:text-macchiato-red flex items-center justify-center"
                    onClick={() => album.id && handleDeleteAlbum(album.id)}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                
                <button 
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-macchiato-surface0/80 backdrop-blur-glass text-macchiato-text hover:text-macchiato-blue flex items-center justify-center"
                  onClick={() => album.id && toggleAlbumExpand(album.id)}
                >
                  {album.id && expandedAlbums.includes(album.id) ? (
                    <FiChevronUp size={16} />
                  ) : (
                    <FiChevronDown size={16} />
                  )}
                </button>
                
                {album.id && expandedAlbums.includes(album.id) && (
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-macchiato-text mb-2">Songs</h3>
                    
                    {album.songs?.length === 0 ? (
                      <p className="text-macchiato-subtext0">No songs in this album</p>
                    ) : (
                      <ul>
                        {album.songs?.map((song) => (
                          <li key={song.id} className="flex justify-between items-center mb-2">
                            <span className="text-macchiato-text">{song.title}</span>
                            <button 
                              className="text-macchiato-red hover:text-macchiato-red/80"
                              onClick={() => song.id && album.id && handleDeleteSong(song.id, album.id)}
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-macchiato-text mb-4">Analytics</h2>
        
        <Card className="p-6 text-center">
          <p className="text-macchiato-subtext0">Detailed analytics coming soon</p>
        </Card>
      </div>
    </div>
  );
};
