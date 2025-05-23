import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiPause, FiMusic, FiCalendar, FiDisc, FiUser } from 'react-icons/fi';
import { Card } from '../ui/Card';
import { AlbumDto } from '../../types';
import { usePlayer } from '../../hooks/usePlayer';
import { getImageUrl } from '../../utils/formatters';

interface AlbumCardProps {
  album: AlbumDto;
  className?: string;
}

/**
 * AlbumCard Component
 * 
 * Displays a rich interactive card for an album with cover art, metadata,
 * and playback controls. The card links to the album detail page and allows
 * direct playback of the album's songs.
 *
 * - Cover image display with fallback icon
 * - Hover animations and scaling effects for engaging UX
 * - Play/pause button overlay on hover
 * - Visual indicators for currently playing album
 * - Audio equalizer animation when the album is playing
 * - Song count badge
 * - Release year badge directly on the cover
 * - Artist name and complete release date in the card footer
 */
export const AlbumCard: React.FC<AlbumCardProps> = ({ album, className = '' }) => {
  const { playQueue, isPlaying, currentSong, togglePlay } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);
  
  const isCurrentAlbum = currentSong?.albumId === album.id;
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isCurrentAlbum && isPlaying) {
      togglePlay();
    } else if (album.songs && album.songs.length > 0) {
      playQueue(album.songs, 0);
    }
  };

  const formattedReleaseDate = album.releaseDate 
    ? new Date(album.releaseDate).getFullYear() 
    : null;
  
  return (
    <div 
      className={`transform transition-all duration-300 ${isHovered ? 'scale-[1.02]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        className={`overflow-hidden ${className} ${isHovered ? 'shadow-xl' : ''}`}
        hoverable
      >
        <Link to={`/albums/${album.id}`}>
          {/* Album cover image container with overlay elements */}
          <div className="relative group">
            {/* Album cover or placeholder */}
            <div className="aspect-square bg-macchiato-surface0 flex items-center justify-center overflow-hidden">
              {album.coverImage ? (
                <img 
                  src={getImageUrl(album.coverImage)} 
                  alt={album.name} 
                  className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                  <FiMusic className="text-macchiato-mauve" size={48} />
                </div>
              )}
              
              {/* Release year badge */}
              {formattedReleaseDate && (
                <div className="absolute top-2 right-2 bg-macchiato-base/80 backdrop-blur-sm text-macchiato-text text-xs font-medium py-1 px-2 rounded-full">
                  {formattedReleaseDate}
                </div>
              )}
            </div>
            
            {/* Hover overlay with play button and song count */}
            <div className="absolute inset-0 bg-gradient-to-t from-macchiato-base/80 via-macchiato-base/40 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              {/* Play/pause button */}
              <button
                onClick={handlePlayClick}
                className="w-14 h-14 rounded-full bg-macchiato-mauve text-macchiato-base flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110"
              >
                {isCurrentAlbum && isPlaying ? <FiPause size={28} /> : <FiPlay size={28} />}
              </button>
              
              {/* Song count badge */}
              {album.songs && album.songs.length > 0 && (
                <div className="absolute bottom-3 left-3 flex items-center text-macchiato-text text-xs bg-macchiato-surface0/80 backdrop-blur-sm py-1 px-2 rounded-full">
                  <FiDisc className="mr-1" size={12} />
                  {album.songs.length} {album.songs.length === 1 ? 'song' : 'songs'}
                </div>
              )}
            </div>
          </div>
          
          {/* Album information footer */}
          <div className="p-4">
            {/* Album title with playing animation if current */}
            <h3 className="text-macchiato-text font-medium truncate text-lg">
              {album.name}
              {/* Audio equalizer animation when album is playing */}
              {isCurrentAlbum && isPlaying && (
                <span className="ml-2 inline-flex items-center">
                  <span className="animate-pulse-1 inline-block w-1 h-3 bg-macchiato-mauve rounded-full mx-0.5"></span>
                  <span className="animate-pulse-2 inline-block w-1 h-4 bg-macchiato-mauve rounded-full mx-0.5"></span>
                  <span className="animate-pulse-3 inline-block w-1 h-2 bg-macchiato-mauve rounded-full mx-0.5"></span>
                </span>
              )}
            </h3>
            
            {/* Artist name */}
            <div className="flex items-center text-macchiato-subtext0 text-sm mt-1">
              <FiUser size={12} className="mr-1 text-macchiato-mauve" />
              <p className="truncate">{album.artistName}</p>
            </div>
            
            {/* Full release date in readable format */}
            {album.releaseDate && (
              <div className="flex items-center text-macchiato-overlay1 text-xs mt-2">
                <FiCalendar size={10} className="mr-1 text-macchiato-mauve" />
                <p>{new Date(album.releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
            )}
          </div>
        </Link>
      </Card>
    </div>
  );
};
