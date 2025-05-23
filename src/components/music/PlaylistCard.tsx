import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiPause, FiList } from 'react-icons/fi';
import { Card } from '../ui/Card';
import { PlaylistDto } from '../../types';
import { usePlayer } from '../../hooks/usePlayer';
import { generatePlaylistCover } from '../../utils/imageGenerator';

interface PlaylistCardProps {
  playlist: PlaylistDto;
  className?: string;
}

/**
 * PlaylistCard Component
 * 
 * Displays a card representing a user playlist with visual and interactive elements.
 * The card shows a generated playlist cover image, playlist name, creator name, and song count.
 * 
 * Features:
 * - Dynamically generated cover image based on playlist name and ID
 * - Play/pause button overlay on hover
 * - Direct playback control of the playlist's songs
 * - Visual indicators for currently playing playlist
 * - Link to detailed playlist view
 * - Song count display
 */
export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, className = '' }) => {
  const { playQueue, isPlaying, togglePlay, currentPlaylist } = usePlayer();
  const [coverImage, setCoverImage] = useState<string>('');
  
  const isCurrentPlaylist = currentPlaylist?.id === playlist.id;
  
  useEffect(() => {
    setCoverImage(generatePlaylistCover(playlist.name, playlist.id));
  }, [playlist.name, playlist.id]);
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isCurrentPlaylist && isPlaying) {
      togglePlay();
    } else if (playlist.songs && playlist.songs.length > 0) {
      playQueue(playlist.songs, 0);
    }
  };
  
  return (
    <Card 
      className={`overflow-hidden ${className}`}
      hoverable
    >
      <Link to={`/playlists/${playlist.id}`}>
        {/* Playlist cover image container with overlay elements */}
        <div className="relative group">
          {/* Generated cover image or fallback icon */}
          <div className="aspect-square bg-macchiato-surface0 flex items-center justify-center">
            {coverImage ? (
              <img 
                src={coverImage}
                alt={`${playlist.name} cover`}
                className="w-full h-full object-cover"
              />
            ) : (
              <FiList className="text-macchiato-mauve" size={48} />
            )}
          </div>
          
          {/* Hover overlay with play button */}
          <div className="absolute inset-0 bg-macchiato-base/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <button
              onClick={handlePlayClick}
              className="w-12 h-12 rounded-full bg-macchiato-mauve text-macchiato-base flex items-center justify-center shadow-neumorphic-dark"
            >
              {isCurrentPlaylist && isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
            </button>
          </div>
        </div>
        
        {/* Playlist information footer */}
        <div className="p-3">
          {/* Playlist name with truncation for long names */}
          <h3 className="text-macchiato-text font-medium truncate">{playlist.name}</h3>
          {/* Creator's username */}
          <p className="text-macchiato-subtext0 text-sm truncate">By {playlist.userName}</p>
          {/* Song count - only shown if songs are available */}
          {playlist.songs && (
            <p className="text-macchiato-overlay1 text-xs mt-1">{playlist.songs.length} songs</p>
          )}
        </div>
      </Link>
    </Card>
  );
};
