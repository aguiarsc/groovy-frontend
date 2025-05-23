import React from 'react';
import { SongCard } from '../components/music/SongCard';
import { Button } from '../components/ui/Button';
import { SongDto } from '../types';
import { usePlayer } from '../hooks/usePlayer';
import { useFavorites } from '../hooks/useFavorites';

/**
 * Favorites Page
 * 
 * Displays a user's favorite songs with options to play them or remove from favorites.
 * Shows a loading state while fetching favorites and an empty state when no favorites exist.
 * Includes a 'Play All' button to queue all favorite songs.
 */
export const FavoritesPage: React.FC = () => {
  const { favorites, isLoading, removeFromFavorites } = useFavorites();
  const { addToQueue } = usePlayer();
  
  const handleAddToQueue = (song: SongDto) => {
    addToQueue(song);
  };
  
  const handleRemoveFromFavorites = async (songId: number) => {
    await removeFromFavorites(songId);
  };
  
  const handlePlayAll = () => {
    favorites.forEach(song => addToQueue(song));
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
        </div>
      );
    }
    
    if (favorites.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-macchiato-subtext0 mb-4">You haven't added any songs to your favorites yet.</p>
          <Button variant="primary" to="/browse">Browse Music</Button>
        </div>
      );
    }
    
    return (
      <>
        {favorites.map((song) => (
          <div key={song.id} className="h-full transform transition-all duration-300 hover:shadow-lg rounded-xl overflow-hidden">
            <SongCard 
              song={song}
              onAddToPlaylist={handleAddToQueue}
              onRemoveFromFavorites={() => handleRemoveFromFavorites(song.id!)}
              showFavoriteButton
              compact
            />
          </div>
        ))}
      </>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-macchiato-text">Your Favorites</h1>
          {favorites.length > 0 && (
            <p className="text-macchiato-subtext0">{favorites.length} {favorites.length === 1 ? 'song' : 'songs'}</p>
          )}
        </div>
        
        {favorites.length > 0 && (
          <Button variant="primary" onClick={handlePlayAll}>
            Play All
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4">
        {renderContent()}
      </div>
    </div>
  );
};
