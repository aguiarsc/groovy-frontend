import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPlay, FiPause, FiMusic, FiUser, FiCalendar } from 'react-icons/fi';
import { SongCard } from '../components/music/SongCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { albumService } from '../services/album.service';
import { AlbumDto, SongDto } from '../types';
import { usePlayer } from '../hooks/usePlayer';
import { formatDate } from '../utils/formatters';
import { getImageUrl } from '../utils/formatters';

/**
 * AlbumDetailPage Component
 * 
 * A comprehensive page that displays detailed information about a specific album,
 * including its cover art, metadata, and list of songs.
 * 
 * Features:
 * - Dynamic album data loading based on URL parameters
 * - Album metadata display (title, artist, release date, song count)
 * - Cover image with fallback
 * - Complete song listing with play functionality
 * - Album playback controls (play/pause entire album)
 * - Loading states and error handling
 * - Navigation links to artist page
 * - Queue management integration
 */
export const AlbumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const [album, setAlbum] = useState<AlbumDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { playQueue, isPlaying, currentSong, togglePlay, addToQueue } = usePlayer();
  const isCurrentAlbum = album?.songs?.some(song => song.id === currentSong?.id);
  
  useEffect(() => {
    const fetchAlbum = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const albumId = parseInt(id, 10);

        if (isNaN(albumId)) {
          setError('Invalid album ID');
          setIsLoading(false);
          return;
        }
        
        const response = await albumService.getAlbumById(albumId);
        if (response.data) {
          setAlbum(response.data);
        } else if (response.error) {
          setError(response.error);
        } else {
          setError('Album not found');
        }
      } catch (err) {
        console.error('Error fetching album:', err);
        setError('Failed to load album');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAlbum();
  }, [id]);
  
  const handlePlayAlbum = () => {
    if (!album?.songs || album.songs.length === 0) return;
    
    if (isCurrentAlbum && isPlaying) {
      togglePlay();
    } else {
      playQueue(album.songs, 0);
    }
  };
  
  const handleAddToQueue = (song: SongDto) => {
    addToQueue(song);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
      </div>
    );
  }
  
  if (error || !album) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold text-macchiato-text mb-4">{error || 'Album not found'}</h2>
        <Link to="/albums">
          <Button variant="primary">Back to Albums</Button>
        </Link>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Album header section with cover art and metadata */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Album cover art with fallback */}
        <div className="w-full md:w-64 h-64 bg-macchiato-surface0 rounded-lg shadow-neumorphic-dark flex items-center justify-center flex-shrink-0">
          {album.coverImage ? (
            <img 
            src={getImageUrl(album.coverImage)} 
              alt={album.name} 
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <FiMusic className="text-macchiato-mauve" size={64} />
          )}
        </div>
        
        {/* Album metadata and controls */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-macchiato-text mb-2">{album.name}</h1>
          
          {/* Artist link for navigation */}
          <Link to={`/artists/${album.artistId}`} className="inline-flex items-center text-macchiato-mauve hover:text-macchiato-pink mb-4">
            <FiUser className="mr-1" />
            {album.artistName}
          </Link>
          
          {/* Album details (release date, song count) */}
          <div className="flex items-center text-macchiato-subtext0 mb-6">
            <FiCalendar className="mr-1" />
            <span>{album.releaseDate ? formatDate(album.releaseDate) : 'Release date not available'}</span>
            <span className="mx-2">•</span>
            <span>{album.songs?.length || 0} songs</span>
          </div>
          
          {/* Album playback controls */}
          <div className="flex space-x-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handlePlayAlbum}
              disabled={!album.songs || album.songs.length === 0}
              className="flex items-center"
            >
              {isCurrentAlbum && isPlaying ? (
                <>
                  <FiPause className="mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <FiPlay className="mr-2" />
                  Play
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Song list section */}
      <div>
        <h2 className="text-xl font-semibold text-macchiato-text mb-4">Songs</h2>
        
        {album.songs && album.songs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {album.songs.map((song) => (
              <div key={song.id} className="h-full transform transition-all duration-300">
                <SongCard 
                  song={song}
                  showAlbum={false}
                  onAddToPlaylist={handleAddToQueue}
                  compact
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-macchiato-subtext0 text-center py-8">No songs in this album</p>
        )}
      </div>
      
      {/* Related content section - more from same artist */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-macchiato-text">More from {album.artistName}</h2>
          <Link to={`/artists/${album.artistId}`} className="text-macchiato-mauve hover:text-macchiato-pink">
            View All
          </Link>
        </div>
        
        {/* Placeholder for related content - would normally display other albums */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-macchiato-subtext0">Coming soon</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
