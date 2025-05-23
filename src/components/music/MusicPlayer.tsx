import React, { useState, useEffect, useRef } from 'react';
import { 
  FiPlay, 
  FiPause, 
  FiSkipBack, 
  FiSkipForward, 
  FiVolume2, 
  FiVolumeX,
  FiList,
  FiMusic,
  FiX,
  FiMinimize2,
  FiMaximize2,
  FiMaximize
} from 'react-icons/fi';
import { Slider } from '../ui/Slider';
import { usePlayer } from '../../hooks/usePlayer';
import { formatDuration, getImageUrl } from '../../utils/formatters';
import { FullscreenPlayer } from './FullscreenPlayer';
import { QueuePanel } from './QueuePanel';
import { FavoriteButton } from './FavoriteButton';
import { useAuth } from '../../hooks/useAuth';

/**
 * Music player component that provides playback controls and song information
 * 
 * This component serves as the primary playback interface for the application,
 * allowing users to:
 * - View current song information (title, artist, album art)
 * - Control playback (play/pause, previous/next, progress seeking)
 * - Adjust volume and mute audio
 * - Access the song queue
 * - Toggle player modes (minimized, fullscreen)
 * 
 * The player has three states:
 * 1. Full player with all controls
 * 2. Minimized player with only essential information
 * 3. Fullscreen immersive player
 * 
 * @returns {JSX.Element | null} The rendered player UI or null if no song is selected
 */
export const MusicPlayer: React.FC = () => {
  const { 
    currentSong,
    queue,
    isPlaying,
    volume,
    progress,
    duration,
    togglePlay,
    previous,
    next,
    setVolume,
    seekTo,
    stopAndClosePlayer,
    isPlayerVisible,
    isFullscreen,
    toggleFullscreen
  } = usePlayer();
  
  const { isAuthenticated } = useAuth();
  const [showQueue, setShowQueue] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 675);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 675);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !touchStartY) return;
    
    const xDiff = touchStart - e.touches[0].clientX;
    const yDiff = touchStartY - e.touches[0].clientY;
    
    // Horizontal swipe (for closing the player)
    if (Math.abs(xDiff) > Math.abs(yDiff) && xDiff > 50) {
      handleClose();
    }
  };

  const handlePlayerClick = () => {
    if (isMobile) {
      toggleFullscreen();
    }
  };
  
  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume);
    }
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    stopAndClosePlayer();
  };
  
  if (isFullscreen) {
    return <FullscreenPlayer />;
  }
  
  if (!currentSong || !isPlayerVisible) return null;

  if (isMobile) {
    return (
      <div 
        ref={playerRef}
        className="fixed bottom-0 left-0 right-0 bg-macchiato-mantle/95 backdrop-blur-glass border-t border-macchiato-overlay0/20 shadow-neumorphic-dark px-3 py-2 z-50"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onClick={handlePlayerClick}
      >
        <div className="flex items-center justify-between">
          {/* Album art */}
          <div className="w-12 h-12 bg-macchiato-surface0 rounded-md shadow-neumorphic-dark flex-shrink-0 overflow-hidden">
            {currentSong.albumId && currentSong.albumName ? (
              <img 
                src={getImageUrl(`album${currentSong.albumId}.jpg`)} 
                alt={currentSong.albumName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <FiMusic className="text-macchiato-mauve w-full h-full p-2" />
            )}
          </div>

          {/* Song info and progress bar */}
          <div className="flex-1 min-w-0 px-3 overflow-hidden">
            <div className="flex flex-col w-full">
              <h4 className="text-macchiato-text font-medium truncate">{currentSong.title}</h4>
              <p className="text-macchiato-subtext0 text-sm truncate">{currentSong.artistName}</p>
              <div 
                ref={progressBarRef}
                className="w-full h-1 bg-macchiato-surface0/50 rounded-full mt-2 overflow-hidden cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <div 
                  className="h-full bg-macchiato-mauve rounded-full"
                  style={{ width: `${(progress / duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-macchiato-subtext0 mt-1">
                <span>{formatDuration(progress)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>
          </div>

          {/* Play/pause and close button */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-12 h-12 rounded-full bg-macchiato-mauve text-macchiato-base flex items-center justify-center shadow-neumorphic-dark hover:bg-macchiato-mauve/90 transition-colors"
            >
              {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} className="ml-1" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full text-macchiato-overlay2 hover:text-macchiato-red transition-colors"
              title="Close player"
              aria-label="Close player"
            >
              <FiX size={22} />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-macchiato-mantle/90 backdrop-blur-glass border-t border-macchiato-overlay0/20 shadow-neumorphic-dark px-4 ${isMinimized ? 'py-2' : 'py-3'} transition-all duration-300 z-50`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left section - displays current song details and album artwork */}
        <div className="flex items-center space-x-3 w-1/4 min-w-0">
          {/* Album artwork with fallback icon */}
          <div className="w-12 h-12 bg-macchiato-surface0 rounded-md shadow-neumorphic-dark flex items-center justify-center overflow-hidden">
            {currentSong.albumId && currentSong.albumName ? (
              <img 
                src={getImageUrl(`album${currentSong.albumId}.jpg`)} 
                alt={currentSong.albumName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <FiMusic className="text-macchiato-mauve" size={20} />
            )}
          </div>
          {/* Song title and artist name with truncation for overflow */}
          <div className="truncate">
            <h4 className="text-macchiato-text font-medium truncate">{currentSong.title}</h4>
            <p className="text-macchiato-subtext0 text-sm truncate">{currentSong.artistName}</p>
          </div>
          
          {/* Favorite button only shown to authenticated users */}
          {isAuthenticated && currentSong && (
            <FavoriteButton song={currentSong} size="sm" />
          )}
        </div>

        {/* Only renders the main playback controls when player is not minimized */}
        {!isMinimized && (
          <div className="flex flex-col items-center w-2/4">
            {/* Primary playback control buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={previous}
                className="text-macchiato-overlay2 hover:text-macchiato-text transition-colors"
              >
                <FiSkipBack size={20} />
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-macchiato-mauve text-macchiato-base flex items-center justify-center shadow-neumorphic-dark hover:bg-macchiato-mauve/90 transition-colors"
              >
                {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
              </button>
              
              <button 
                onClick={next}
                className="text-macchiato-overlay2 hover:text-macchiato-text transition-colors"
              >
                <FiSkipForward size={20} />
              </button>
            </div>
            
            {/* Playback progress slider with duration indicators */}
            <div className="w-full flex items-center space-x-3 mt-2">
              <span className="text-macchiato-subtext0 text-xs">
                {formatDuration(progress)}
              </span>
              
              <Slider 
                min={0}
                max={duration}
                value={progress}
                onChange={seekTo}
                className="flex-1"
              />
              
              <span className="text-macchiato-subtext0 text-xs">
                {formatDuration(duration)}
              </span>
            </div>
          </div>
        )}
        
        {/* Right section - volume, queue, and player mode controls */}
        <div className="flex items-center space-x-2 sm:space-x-4 w-1/4 justify-end">
          {/* Volume controls only shown in full player mode */}
          {!isMinimized && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMute}
                className="text-macchiato-overlay2 hover:text-macchiato-text transition-colors"
              >
                {volume === 0 ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
              </button>
              
              <Slider 
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={setVolume}
                className="w-20"
              />
            </div>
          )}
          
          {/* Queue management button and panel */}
          {!isMinimized && (
            <div className="relative">
              <button 
                onClick={() => setShowQueue(!showQueue)}
                className={`text-macchiato-overlay2 hover:text-macchiato-text transition-colors ${showQueue ? 'text-macchiato-mauve' : ''}`}
                title="Show queue"
              >
                <FiList size={20} />
                {/* Badge showing number of songs in queue */}
                {queue.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-macchiato-mauve text-macchiato-base text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {queue.length}
                  </span>
                )}
              </button>
              
              {/* Conditionally render queue panel */}
              {showQueue && <QueuePanel onClose={() => setShowQueue(false)} />}
            </div>
          )}
          
          {/* Player mode control */}
          <button 
            onClick={toggleFullscreen}
            className="text-macchiato-overlay2 hover:text-macchiato-text transition-colors"
            title="Fullscreen player"
          >
            <FiMaximize size={18} />
          </button>
          
          <button 
            onClick={toggleMinimize}
            className="text-macchiato-overlay2 hover:text-macchiato-text transition-colors"
            title={isMinimized ? "Expand player" : "Minimize player"}
          >
            {isMinimized ? <FiMaximize2 size={18} /> : <FiMinimize2 size={18} />}
          </button>
          
          <button 
            onClick={handleClose}
            className="text-macchiato-overlay2 hover:text-macchiato-red transition-colors"
            title="Close player"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
