import React, { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiPlus, FiHeart, FiMusic, FiClock, FiCalendar, FiTag, FiMoreHorizontal, FiUser, FiDisc } from 'react-icons/fi';
import { Card } from '../ui/Card';
import { SongDto } from '../../types';
import { usePlayer } from '../../hooks/usePlayer';
import { useFavorites } from '../../hooks/useFavorites';
import { formatDuration } from '../../utils/formatters';
import config from '../../config';

interface SongCardProps {
  song: SongDto;
  showAlbum?: boolean;
  showArtist?: boolean;
  onAddToPlaylist?: (song: SongDto) => void;
  onAddToFavorites?: (song: SongDto) => void;
  onRemoveFromFavorites?: () => void;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  compact?: boolean;
}

/**
 * Component that displays song information in a card format
 * 
 * The SongCard can be rendered in two modes:
 * 1. Compact mode - Used in lists, playlists, and search results
 * 2. Full mode - Used for featured content and detailed views
 * 
 * Features:
 * - Play/pause the song directly from the card
 * - Add to playlist/queue
 * - Add/remove from favorites
 * - Display song details (artist, album, duration, etc.)
 * - Visual indication for the currently playing song
 * - Expandable details section in compact mode
 * 
 * @param {SongCardProps} props - Component properties
 * @returns {JSX.Element} Rendered song card
 */
export const SongCard: React.FC<SongCardProps> = ({
  song,
  showAlbum = true,
  showArtist = true,
  onAddToPlaylist,
  onAddToFavorites,
  onRemoveFromFavorites,
  showFavoriteButton = false,
  isFavorite: propIsFavorite,
  compact = false
}) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { isFavorite: checkFavorite, toggleFavorite } = useFavorites();
  
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const isCurrentSong = currentSong?.id === song.id;
  
  const isFavorite = propIsFavorite !== undefined 
    ? propIsFavorite 
    : (song.id ? checkFavorite(song.id) : false);
  
  useEffect(() => {
    setImageError(false);
  }, [song.id]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song);
    }
  };
  
  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToPlaylist) {
      onAddToPlaylist(song);
    }
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isFavorite && onRemoveFromFavorites) {
      onRemoveFromFavorites();
    } else if (!isFavorite && onAddToFavorites) {
      onAddToFavorites(song);
    } else if (song.id) {
      toggleFavorite(song);
    }
  };

  const toggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };
  
  const getSongImageUrl = (): string | undefined => {
    if (imageError) {
      return undefined;
    }
    
    if (song.albumId) {
      return `${config.API_BASE_URL}/api/files/album${song.albumId}.jpg`;
    }
    
    else if (song.artistId) {
      return `${config.API_BASE_URL}/api/files/artist${song.artistId}.jpg`;
    }
    
    return undefined;
  };
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const renderAlbumArt = (size: 'small' | 'large') => {
    const imageUrl = getSongImageUrl();
    const iconSize = size === 'small' ? 24 : 48;
    
    return (
      <div className="w-full h-full relative overflow-hidden">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl}
            alt={song.albumName || song.artistName || 'Song cover'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-macchiato-surface0 to-macchiato-surface1">
            <FiMusic 
              className="text-macchiato-mauve" 
              size={iconSize}
            />
          </div>
        )}
      </div>
    );
  };

  if (compact) {
    return (
      <div 
        className="transition-all duration-300 ease-in-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card 
          className={`flex items-center justify-between p-3 hover:bg-macchiato-surface0/80 transition-colors ${
            isCurrentSong ? 'border-l-4 border-macchiato-mauve shadow-neumorphic-dark' : ''
          } ${isHovered ? 'shadow-neumorphic-hover' : ''}`}
          hoverable
        >
          {/* Left section: Album art and play button */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative w-12 h-12 rounded-md overflow-hidden shadow-lg flex-shrink-0 bg-macchiato-surface0 aspect-square">
              {renderAlbumArt('small')}
              
              {/* Play button overlay on hover */}
              {isHovered && (
                <div 
                  className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                  onClick={handlePlayClick}
                >
                  {isCurrentSong && isPlaying ? (
                    <FiPause className="text-white" size={24} />
                  ) : (
                    <FiPlay className="text-white" size={24} />
                  )}
                </div>
              )}
            </div>
            
            {/* Middle section: Song info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <h3 className="font-medium text-macchiato-text truncate">
                  {song.title}
                </h3>
                
                {/* Animation for currently playing song */}
                {isCurrentSong && isPlaying && (
                  <span className="ml-2 inline-flex items-center">
                    <span className="animate-pulse-1 inline-block w-1 h-3 bg-macchiato-mauve rounded-full mx-0.5"></span>
                    <span className="animate-pulse-2 inline-block w-1 h-4 bg-macchiato-mauve rounded-full mx-0.5"></span>
                    <span className="animate-pulse-3 inline-block w-1 h-2 bg-macchiato-mauve rounded-full mx-0.5"></span>
                  </span>
                )}
              </div>
              
              {/* Secondary information line */}
              <div className="flex text-xs text-macchiato-subtext0 truncate space-x-2">
                {showArtist && song.artistName && (
                  <span className="truncate">{song.artistName}</span>
                )}
                
                {showArtist && showAlbum && song.artistName && song.albumName && (
                  <span>•</span>
                )}
                
                {showAlbum && song.albumName && (
                  <span className="truncate">{song.albumName}</span>
                )}
                
                {(showAlbum || showArtist) && (
                  <span>•</span>
                )}
                
                <span>{formatDuration(song.duration)}</span>
              </div>
            </div>
          </div>
          
          {/* Right section: Action buttons */}
          <div className="flex items-center space-x-2">
            {showFavoriteButton && (
              <button
                onClick={handleFavoriteClick}
                className={`transition-colors ${
                  isFavorite 
                    ? 'text-macchiato-red' 
                    : 'text-macchiato-overlay1 hover:text-macchiato-red'
                }`}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <FiHeart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
            
            {onAddToPlaylist && (
              <button
                onClick={handleAddToPlaylist}
                className="text-macchiato-overlay1 hover:text-macchiato-mauve transition-colors"
                title="Add to queue"
              >
                <FiPlus size={18} />
              </button>
            )}
            
            <button
              onClick={toggleDetails}
              className="text-macchiato-overlay1 hover:text-macchiato-mauve transition-colors"
              title={showDetails ? "Hide details" : "Show details"}
            >
              <FiMoreHorizontal size={18} />
            </button>
          </div>
        </Card>
        
        {/* Expandable details section */}
        {showDetails && (
          <div className="mt-1 p-3 rounded-md bg-macchiato-surface0/70 text-sm space-y-1 text-macchiato-subtext0">
            {song.genre && (
              <div className="flex items-center">
                <FiTag className="mr-2 text-macchiato-mauve" size={14} />
                <span>{song.genre}</span>
              </div>
            )}
            
            {song.releaseDate && (
              <div className="flex items-center">
                <FiCalendar className="mr-2 text-macchiato-mauve" size={14} />
                <span>
                  {new Date(song.releaseDate).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="transition-all duration-300 ease-in-out group">
      <Card 
        className="overflow-hidden hover:shadow-neumorphic-hover h-full"
        hoverable
      >
        <div className="flex flex-col h-full">
          {/* Album artwork section with aspect ratio */}
          <div className="relative w-full overflow-hidden bg-gradient-to-br from-macchiato-surface0 to-macchiato-surface1">
            <div className="aspect-square">
              {renderAlbumArt('large')}
              
              {/* Play button overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
                onClick={handlePlayClick}
              >
                <button 
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110 ${
                    isCurrentSong && isPlaying 
                      ? 'bg-macchiato-mauve text-macchiato-base' 
                      : 'bg-macchiato-surface1 text-macchiato-text hover:bg-macchiato-surface1/90'
                  }`}
                >
                  {isCurrentSong && isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Song details section */}
          <div className="p-4 flex flex-col justify-between flex-grow">
            <div>
              {/* Song title with playing animation */}
              <h3 className="text-macchiato-text font-medium text-xl flex items-center">
                {song.title}
                {isCurrentSong && isPlaying && (
                  <span className="ml-2 inline-flex items-center">
                    <span className="animate-pulse-1 inline-block w-1.5 h-4 bg-macchiato-mauve rounded-full mx-0.5"></span>
                    <span className="animate-pulse-2 inline-block w-1.5 h-5 bg-macchiato-mauve rounded-full mx-0.5"></span>
                    <span className="animate-pulse-3 inline-block w-1.5 h-3 bg-macchiato-mauve rounded-full mx-0.5"></span>
                  </span>
                )}
              </h3>
              
              {/* Song metadata with icons */}
              <div className="flex flex-col mt-2 space-y-1">
                {showArtist && (
                  <div className="flex items-center text-macchiato-subtext0">
                    <FiUser className="mr-2 text-macchiato-mauve" size={14} />
                    <span className="text-macchiato-text">{song.artistName}</span>
                  </div>
                )}
                
                {showAlbum && song.albumName && (
                  <div className="flex items-center text-macchiato-subtext0">
                    <FiDisc className="mr-2 text-macchiato-mauve" size={14} />
                    <span className="text-macchiato-text">{song.albumName}</span>
                  </div>
                )}
                
                {song.genre && (
                  <div className="flex items-center text-macchiato-subtext0">
                    <FiTag className="mr-2 text-macchiato-mauve" size={14} />
                    <span className="text-macchiato-text">{song.genre}</span>
                  </div>
                )}
                
                <div className="flex items-center text-macchiato-subtext0">
                  <FiClock className="mr-2 text-macchiato-mauve" size={14} />
                  <span className="text-macchiato-text">{formatDuration(song.duration)}</span>
                </div>
                
                {song.releaseDate && (
                  <div className="flex items-center text-macchiato-subtext0">
                    <FiCalendar className="mr-2 text-macchiato-mauve" size={14} />
                    <span className="text-macchiato-text">
                      {new Date(song.releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-4 mt-4">
              {showFavoriteButton && (
                <button
                  onClick={handleFavoriteClick}
                  className={`transition-colors ${
                    isFavorite 
                      ? 'text-macchiato-red' 
                      : 'text-macchiato-overlay1 hover:text-macchiato-red'
                  }`}
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <FiHeart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              )}
              
              {onAddToPlaylist && (
                <button
                  onClick={handleAddToPlaylist}
                  className="text-macchiato-overlay1 hover:text-macchiato-mauve transition-colors"
                  title="Add to queue"
                >
                  <FiPlus size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
