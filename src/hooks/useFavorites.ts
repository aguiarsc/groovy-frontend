import { useState, useEffect, useCallback } from 'react';
import { SongDto } from '../types';
import favoriteService from '../services/favorite.service';
import { useAuth } from './useAuth';

/**
 * User Favorites Management Hook
 * 
 * This custom hook provides a complete interface for managing a user's favorite songs:
 * - Loading and storing the user's favorite songs
 * - Checking if a song is in the favorites
 * - Adding and removing songs from favorites
 * - Handling loading states and errors
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<SongDto[]>([]);
  const [favoriteSongIds, setFavoriteSongIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setFavoriteSongIds(new Set());
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await favoriteService.getFavorites();
      
      if (response.data) {
        setFavorites(response.data);
        
        const idSet = new Set<number>();
        response.data.forEach(song => {
          if (song.id) {
            idSet.add(song.id);
          }
        });
        setFavoriteSongIds(idSet);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to load favorites');
      console.error('Error loading favorites:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const isFavorite = useCallback((songId: number): boolean => {
    return favoriteSongIds.has(songId);
  }, [favoriteSongIds]);

  const addToFavorites = useCallback(async (song: SongDto): Promise<boolean> => {
    if (!song.id || !isAuthenticated) return false;
    
    try {
      const response = await favoriteService.addToFavorites(song.id);
      
      if (response.data) {
        setFavorites(prev => {
          if (!prev.some(s => s.id === song.id)) {
            return [...prev, song];
          }
          return prev;
        });
        
        setFavoriteSongIds(prev => {
          const newSet = new Set(prev);
          newSet.add(song.id!);
          return newSet;
        });
        
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding song to favorites:', err);
      return false;
    }
  }, [isAuthenticated]);

  const removeFromFavorites = useCallback(async (songId: number): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      const response = await favoriteService.removeFromFavorites(songId);
      
      if (response.data) {
        setFavorites(prev => prev.filter(song => song.id !== songId));
        setFavoriteSongIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(songId);
          return newSet;
        });
        
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error removing song from favorites:', err);
      return false;
    }
  }, [isAuthenticated]);

  const toggleFavorite = useCallback(async (song: SongDto): Promise<boolean> => {
    if (!song.id || !isAuthenticated) return false;
    
    const isCurrentlyFavorite = isFavorite(song.id);
    
    if (isCurrentlyFavorite) {
      return await removeFromFavorites(song.id);
    } else {
      return await addToFavorites(song);
    }
  }, [isAuthenticated, isFavorite, addToFavorites, removeFromFavorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    favoriteSongIds,
    isLoading,
    error,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    loadFavorites
  };
};

export default useFavorites;
