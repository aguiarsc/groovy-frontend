import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AlbumCard } from '../components/music/AlbumCard';
import { SongCard } from '../components/music/SongCard';
import { Button } from '../components/ui/Button';
import { albumService } from '../services/album.service';
import { songService } from '../services/song.service';
import { useAuth } from '../hooks/useAuth';
import { usePlayer } from '../hooks/usePlayer';
import { AlbumDto, SongDto } from '../types';

/**
 * Home Page
 * 
 * Main landing page displaying featured albums and popular songs.
 * Handles authentication state and session management.
 * Shows loading states and error handling for data fetching.
 */
export const HomePage: React.FC = () => {
  const { isAuthenticated, user, refreshAuth, verifyToken } = useAuth();
  const { addToQueue } = usePlayer();

  const [featuredAlbums, setFeaturedAlbums] = useState<AlbumDto[]>([]);
  const [popularSongs, setPopularSongs] = useState<SongDto[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAuthError, setHasAuthError] = useState(false);
  
  const [lastFetchAttempt, setLastFetchAttempt] = useState(0);

  const fetchData = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchAttempt < 5000) {
      return;
    }
    
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    setLastFetchAttempt(now);
    setIsLoading(true);
    
    setError(null);
    
    try {
      if (!verifyToken()) {
        setIsLoading(false);
        setHasAuthError(true);
        return;
      }
      
      const albumsResponse = await albumService.getAllAlbums();
      if (albumsResponse.data) {
        setFeaturedAlbums(albumsResponse.data.slice(0, 6));
      }
      
      const songsResponse = await songService.getAllSongs();
      if (songsResponse.data) {
        setPopularSongs(songsResponse.data.slice(0, 8));
      }
      
      setIsLoading(false);
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        setHasAuthError(true);
        setError('Your session has expired. Please refresh your session and try again.');
      } else {
        setError('Failed to load content. Please try again later.');
      }
      
      setIsLoading(false);
    }
  }, [isAuthenticated, user, verifyToken, lastFetchAttempt]);

  useEffect(() => {
    if (isAuthenticated && !hasAuthError) {
      fetchData();
    } else if (!isAuthenticated) {
      setFeaturedAlbums([]);
      setPopularSongs([]);
      setIsLoading(false);
    }
  }, [fetchData, hasAuthError, isAuthenticated]);
  

  const handleAddToQueue = (song: SongDto) => {
    addToQueue(song);
  };
  
  const handleRetry = async () => {
    setError(null);
    
    if (hasAuthError) {
      setIsLoading(true);
      const refreshed = await refreshAuth();
      setHasAuthError(false);
      
      if (!refreshed) {
      }
    }
    
    fetchData();
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button variant="primary" onClick={handleRetry}>
          {hasAuthError ? 'Refresh Session & Retry' : 'Retry'}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-10">
      {/* Featured Albums Section */}
      {featuredAlbums.length > 0 ? (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-macchiato-text">Featured Albums</h2>
            <Link to="/albums" className="text-macchiato-mauve hover:text-macchiato-pink">
              View All
            </Link>
          </div>
          
          {/* Grid layout adapts to different screen sizes with responsive columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center text-macchiato-subtext0 py-8">
          No albums available at the moment
        </div>
      )}
      
      {/* Popular Songs Section */}
      {popularSongs.length > 0 ? (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-macchiato-text">Popular Songs</h2>
            <Link to="/browse" className="text-macchiato-mauve hover:text-macchiato-pink">
              View All
            </Link>
          </div>
          
          {/* 
            Different grid layout for songs to accommodate more information
            Uses fewer columns to allow song cards more horizontal space
          */}
          <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-4 gap-6">
            {popularSongs.map((song) => (
              <SongCard 
                key={song.id} 
                song={song}
                onAddToPlaylist={handleAddToQueue}
                showFavoriteButton
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center text-macchiato-subtext0 py-8">
          No songs available at the moment
        </div>
      )}
    </div>
  );
};
