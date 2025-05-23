import React from 'react';
import { FiHeart } from 'react-icons/fi';
import { SongDto } from '../../types';
import { useFavorites } from '../../hooks/useFavorites';
import { useAuth } from '../../hooks/useAuth';

interface FavoriteButtonProps {
  song: SongDto;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

/**
 * FavoriteButton Component
 * 
 * A toggleable heart icon button that allows users to add or remove songs from their favorites.
 * The button changes appearance based on the current favorite status of the song.
 * 
 * Features:
 * - Visual feedback with filled/unfilled heart icon based on favorite status
 * - Multiple size variants for different UI contexts
 * - Authentication-aware (only displays for authenticated users)
 * - Prevents event propagation to avoid triggering parent click handlers
 * - Accessibility support with appropriate aria labels and titles
 */
export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  song,
  size = 'md',
  className = '',
  onFavoriteChange
}) => {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const songIsFavorite = song.id ? isFavorite(song.id) : false;
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };
  
  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };
  
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated || !song.id) return;
    
    const newStatus = await toggleFavorite(song);
    
    if (onFavoriteChange) {
      onFavoriteChange(newStatus);
    }
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-colors ${
        songIsFavorite
          ? 'text-macchiato-red'
          : 'text-macchiato-overlay1 hover:text-macchiato-red'
      } ${className}`}
      title={songIsFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-label={songIsFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <FiHeart 
        size={iconSizes[size]} 
        className={songIsFavorite ? 'fill-current' : ''}
      />
    </button>
  );
};

export default FavoriteButton;
