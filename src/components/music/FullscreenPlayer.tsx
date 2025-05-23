import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FiPlay, 
  FiPause, 
  FiSkipBack, 
  FiSkipForward, 
  FiVolume2, 
  FiVolumeX,
  FiList,
  FiMusic,
  FiInfo,
  FiClock,
  FiUser,
  FiMinimize
} from 'react-icons/fi';
import { Slider } from '../ui/Slider';
import { usePlayer } from '../../hooks/usePlayer';
import { formatDuration, getImageUrl } from '../../utils/formatters';
import { artistService } from '../../services/artist.service';
import { ArtistDto } from '../../types';
import { FavoriteButton } from './FavoriteButton';

/**
 * FullscreenPlayer Component
 * 
 * An immersive fullscreen player interface that provides comprehensive playback controls
 * and detailed information about the currently playing track, artist, and queue.
 * 
 * - Large album artwork display with animation during playback
 * - Comprehensive playback controls (play/pause, skip, volume, seek)
 * - Dynamic background that matches the album art
 * - Artist information panel with biography
 * - Song metadata display (duration, genre, release year)
 * - Queue management and visibility
 * - Favorite button integration
 * - Full accessibility support
 * 
 * This component creates a modal-like experience that overlays the entire application
 * and provides a focused music listening experience.
 */
export const FullscreenPlayer: React.FC = () => {
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
    toggleFullscreen
  } = usePlayer();
  
  const isMobile = window.innerWidth <= 675;
  
  const handleExitFullscreen = useCallback(() => {
    if (isMobile) {
      setTimeout(toggleFullscreen, 100);
    } else {
      toggleFullscreen();
    }
    // Reset swipe state when exiting
    setSwipeOffset(0);
    setTouchStartY(null);
    setTouchMoveY(null);
  }, [toggleFullscreen, isMobile]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setTouchMoveY(null);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY;
    
    // Only allow swipe down
    if (deltaY > 0) {
      setTouchMoveY(currentY);
      setSwipeOffset(deltaY);
    }
  };
  
  const handleTouchEnd = () => {
    if (touchStartY === null || touchMoveY === null) return;
    
    const deltaY = touchMoveY - touchStartY;
    
    // If swiped down enough, close the player
    if (deltaY > 100) {
      handleExitFullscreen();
    } else {
      // Reset position if not swiped enough
      setSwipeOffset(0);
    }
    
    // Reset touch state
    setTouchStartY(null);
    setTouchMoveY(null);
  };
  
  const [showQueue, setShowQueue] = useState(false);
  const [showArtistInfo, setShowArtistInfo] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [artistInfo, setArtistInfo] = useState<ArtistDto | null>(null);
  const [isLoadingArtist, setIsLoadingArtist] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchMoveY, setTouchMoveY] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchArtistInfo = async () => {
      if (!currentSong) return;
      
      setIsLoadingArtist(true);
      try {
        let response;
        
        if (currentSong.artistId) {
          response = await artistService.getArtistById(currentSong.artistId);
        } 
        else if (currentSong.artistName) {
          response = await artistService.getArtistByName(currentSong.artistName);
        }
        
        if (response?.data) {
          setArtistInfo(response.data);
        } else {
          setArtistInfo(null);
        }
      } catch (error) {
        console.error('Error fetching artist info:', error);
        setArtistInfo(null);
      } finally {
        setIsLoadingArtist(false);
      }
    };
    
    fetchArtistInfo();
  }, [currentSong]);
  
  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume);
    }
  };
  
  if (!currentSong) return null;
  
  return (
    <div 
      ref={playerRef}
      className="fixed inset-0 bg-macchiato-base/95 backdrop-blur-xl z-[90] flex flex-col items-center justify-center overflow-hidden touch-none"
      style={{
        transform: swipeOffset > 0 ? `translateY(${Math.min(swipeOffset, 100)}px)` : 'none',
        opacity: swipeOffset > 0 ? 1 - (swipeOffset / 200) : 1,
        transition: touchStartY === null ? 'transform 0.2s ease-out, opacity 0.2s ease-out' : 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic background that matches the album artwork */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl"
        style={{ 
          backgroundImage: currentSong.albumId ? 
            `url(${getImageUrl(`album${currentSong.albumId}.jpg`)})` : 
            'none' 
        }}
      />
      
      {/* Exit fullscreen button - positioned absolutely at the top right */}
      <button 
        onClick={handleExitFullscreen}
        className="fixed top-4 right-4 text-macchiato-overlay2 hover:text-macchiato-text transition-colors p-3 bg-macchiato-mantle/80 rounded-full z-[100] shadow-lg hover:bg-macchiato-surface0 touch-auto"
        aria-label="Exit fullscreen"
      >
        <FiMinimize size={24} />
      </button>
      
      {/* Swipe indicator */}
      <div 
        className="absolute top-4 w-12 h-1 bg-macchiato-overlay1/50 rounded-full mb-4 z-[100]"
        style={{
          opacity: touchStartY !== null ? 1 : 0.5,
          transition: 'opacity 0.2s ease-out'
        }}
      />
      
      {/* Main content container with album art and controls */}
      <div className="max-w-7xl w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 p-8 z-10">
        {/* Album artwork section */}
        <div className="relative w-full max-w-md flex-shrink-0">
          <div className="w-full aspect-square bg-macchiato-surface0 rounded-xl shadow-neumorphic-dark overflow-hidden transition-transform duration-300"
               style={{ transform: isPlaying ? 'scale(1.02)' : 'scale(1)' }}>
            {currentSong.albumId ? (
              <img 
                src={getImageUrl(`album${currentSong.albumId}.jpg`)} 
                alt={currentSong.albumName || 'Album cover'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FiMusic className="text-macchiato-mauve" size={80} />
              </div>
            )}
          </div>
        </div>
        
        {/* Song details and controls section */}
        <div className="flex flex-col w-full max-w-2xl">
          {/* Song and artist information */}
          <div className="mb-8">
            {/* Song title and favorite button */}
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-macchiato-text mb-2">{currentSong.title}</h1>
              <FavoriteButton song={currentSong} size="lg" />
            </div>
            
            {/* Artist name and album with artist info toggle */}
            <div className="flex items-center space-x-2 mb-4">
              <button 
                onClick={() => setShowArtistInfo(!showArtistInfo)}
                className="text-xl text-macchiato-mauve hover:underline flex items-center"
              >
                <span>{currentSong.artistName}</span>
                <FiInfo className="ml-2" size={16} />
              </button>
              
              {currentSong.albumName && (
                <>
                  <span className="text-macchiato-overlay1">•</span>
                  <span className="text-macchiato-text">{currentSong.albumName}</span>
                </>
              )}
            </div>
            
            {/* Collapsible artist information panel */}
            {showArtistInfo && (
              <div className="bg-macchiato-mantle/70 backdrop-blur-sm p-4 rounded-lg mb-6 animate-fadeIn">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="w-12 h-12 bg-macchiato-surface0 rounded-full flex items-center justify-center">
                    <FiUser className="text-macchiato-mauve" size={24} />
                  </div>
                  <div>
                    <h3 className="text-macchiato-text font-medium">{currentSong.artistName}</h3>
                    <p className="text-macchiato-subtext0 text-sm">Artist</p>
                  </div>
                </div>
                <p className="text-macchiato-subtext1">
                  {isLoadingArtist ? (
                    "Loading artist information..."
                  ) : artistInfo?.biography ? (
                    artistInfo.biography
                  ) : (
                    `${currentSong.artistName} is a talented musician known for their unique style and captivating performances. Their music spans multiple genres and has garnered a dedicated following.`
                  )}
                </p>
              </div>
            )}
            
            {/* Song metadata (duration, genre, release year) */}
            <div className="flex items-center space-x-4 text-macchiato-subtext0">
              <div className="flex items-center">
                <FiClock className="mr-1" size={14} />
                <span>{formatDuration(duration)}</span>
              </div>
              {currentSong.genre && (
                <div>
                  <span className="capitalize">{currentSong.genre}</span>
                </div>
              )}
              {currentSong.releaseDate && (
                <div>
                  <span>{new Date(currentSong.releaseDate).getFullYear()}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Playback progress slider */}
          <div className="w-full flex items-center space-x-3 mb-6">
            <span className="text-macchiato-subtext0 text-sm font-medium">
              {formatDuration(progress)}
            </span>
            
            <Slider 
              min={0}
              max={duration}
              value={progress}
              onChange={seekTo}
              className="flex-1"
            />
            
            <span className="text-macchiato-subtext0 text-sm font-medium">
              {formatDuration(duration)}
            </span>
          </div>
          
          {/* Main playback controls (previous, play/pause, next) */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <button 
              onClick={previous}
              className="text-macchiato-overlay2 hover:text-macchiato-text transition-colors"
            >
              <FiSkipBack size={36} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-macchiato-mauve text-macchiato-base flex items-center justify-center shadow-neumorphic-dark hover:bg-macchiato-mauve/90 transition-colors"
            >
              {isPlaying ? <FiPause size={40} /> : <FiPlay size={40} className="ml-2" />}
            </button>
            
            <button 
              onClick={next}
              className="text-macchiato-overlay2 hover:text-macchiato-text transition-colors"
            >
              <FiSkipForward size={36} />
            </button>
          </div>
          
          {/* Secondary controls (volume, queue) */}
          <div className="flex items-center justify-between">
            {/* Volume controls with mute toggle */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleMute}
                className="text-macchiato-overlay2 hover:text-macchiato-text transition-colors"
              >
                {volume === 0 ? <FiVolumeX size={24} /> : <FiVolume2 size={24} />}
              </button>
              
              <Slider 
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={setVolume}
                className="w-32"
              />
            </div>
            
            {/* Queue toggle button */}
            <button 
              onClick={() => setShowQueue(!showQueue)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${showQueue ? 'bg-macchiato-mauve text-macchiato-base' : 'bg-macchiato-surface0 text-macchiato-text'} transition-colors`}
            >
              <FiList size={18} />
              <span>Queue ({queue.length})</span>
            </button>
          </div>
          
          {/* Collapsible queue panel */}
          {showQueue && (
            <div className="mt-6 bg-macchiato-mantle/70 backdrop-blur-sm rounded-lg p-4 max-h-60 overflow-y-auto animate-slideUp">
              <h3 className="text-macchiato-text font-medium mb-3">Up Next</h3>
              
              {queue.length === 0 ? (
                <p className="text-macchiato-subtext0">No songs in queue</p>
              ) : (
                <ul className="space-y-2">
                  {queue.map((song, index) => (
                    <li 
                      key={`${song.id}-${index}`}
                      className="flex items-center justify-between p-2 hover:bg-macchiato-surface0/50 rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-macchiato-surface0 rounded-md flex items-center justify-center overflow-hidden">
                          {song.albumId ? (
                            <img 
                              src={getImageUrl(`album${song.albumId}.jpg`)} 
                              alt={song.albumName || 'Album cover'} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FiMusic className="text-macchiato-mauve" size={16} />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-macchiato-text truncate">{song.title}</p>
                          <p className="text-macchiato-subtext0 text-sm truncate">{song.artistName}</p>
                        </div>
                      </div>
                      <span className="text-macchiato-subtext0 text-xs">
                        {formatDuration(song.duration)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
