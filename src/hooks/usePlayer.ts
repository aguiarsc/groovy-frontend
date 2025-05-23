/**
 * Music Player Hook
 * 
 * This custom hook implements the core audio playback functionality for the application,
 * serving as the bridge between the UI components and the audio element. It handles:
 * - Audio element lifecycle management
 * - Song loading, playback control and progression
 * - Event handling (timeupdate, ended, errors)
 * - Queue management integration
 */

import { useRef, useEffect, useCallback } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { songService } from '../services/song.service';

let globalAudioElement: HTMLAudioElement | null = null;

export const usePlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { 
    currentSong,
    currentPlaylist,
    queue,
    isPlaying,
    volume,
    progress,
    duration,
    isPlayerVisible,
    isFullscreen,
    playSong,
    playQueue,
    playPlaylist,
    togglePlay,
    pause,
    play,
    next,
    previous,
    setVolume,
    setProgress,
    setDuration,
    addToQueue,
    removeFromQueue,
    clearQueue,
    stopAndClosePlayer,
    togglePlayerVisibility,
    toggleFullscreen
  } = usePlayerStore();

  /**
   * Update progress state based on audio element's current time
   * This enables UI elements like progress bars to reflect playback position
   */
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  }, [setProgress]);
  
  /**
   * Auto-advance to next track when current track ends
   */
  const handleEnded = useCallback(() => {
    next();
  }, [next]);
  
  /**
   * Set the duration state once the audio metadata is loaded
   * This is necessary for accurate progress bar calculations
   */
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, [setDuration]);

  /**
   * Handle playback errors by skipping to the next track or pausing
   * Adds minimal delay before advancing to prevent rapid-fire errors
   */
  const handleError = useCallback(() => {
    if (queue.length > 0) {
      setTimeout(() => next(), 500);
    } else {
      pause();
    }
  }, [next, pause, queue.length]);

  useEffect(() => {
    if (!globalAudioElement) {
      globalAudioElement = new Audio();
    }
    
    audioRef.current = globalAudioElement;
    
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    
  }, [volume]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.removeEventListener('timeupdate', handleTimeUpdate);
    audio.removeEventListener('ended', handleEnded);
    audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    audio.removeEventListener('error', handleError);
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
    };
  }, [handleTimeUpdate, handleEnded, handleLoadedMetadata, handleError]);
  
  useEffect(() => {
    const loadSong = async () => {
      if (currentSong && audioRef.current) {
        try {
          const songUrl = await songService.getStreamUrl(currentSong.id!);
          
          const currentSrc = audioRef.current.src;
          if (currentSrc && currentSrc === songUrl) {
            if (isPlaying && audioRef.current.paused) {
              audioRef.current.play().catch(() => {});
            }
            return;
          }
          
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.src = songUrl;
          audioRef.current.preload = "auto";
          audioRef.current.load();
          
          if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {});
            }
          }
        } catch {
        }
      }
    };
    
    loadSong();
  }, [currentSong, isPlaying]);
  
  useEffect(() => {
    const handlePlayPause = async () => {
      if (audioRef.current && currentSong) {
        if (isPlaying) {
          if (audioRef.current.paused) {
            try {
              const songUrl = await songService.getStreamUrl(currentSong.id!);
              
              if (!audioRef.current.src || !audioRef.current.src.includes(songUrl)) {
                audioRef.current.src = songUrl;
                audioRef.current.load();
              }
              
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {});
              }
            } catch {
            }
          }
        } else {
          if (!audioRef.current.paused) {
            audioRef.current.pause();
          }
        }
      }
    };
    
    handlePlayPause();
  }, [isPlaying, currentSong]);
  
  /**
   * Sync volume changes with the audio element
   */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  /**
   * Handle manual seeking in the audio track
   * Only updates if the difference is significant to prevent feedback loops
   */
  useEffect(() => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      const currentTime = audioRef.current.currentTime;
      const diff = Math.abs(currentTime - progress);

      if (diff > 1) {
        audioRef.current.currentTime = progress;
      }
    }
  }, [progress]);
  
  useEffect(() => {
    if (!isPlayerVisible && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlayerVisible]);
  
  const seekTo = (time: number) => {
    setProgress(time);
  };
  
  return {
    currentSong,
    currentPlaylist,
    queue,
    isPlaying,
    volume,
    progress,
    duration,
    isPlayerVisible,
    isFullscreen,
    playSong,
    playQueue,
    playPlaylist,
    togglePlay,
    pause,
    play,
    next,
    previous,
    setVolume,
    seekTo,
    addToQueue,
    removeFromQueue,
    clearQueue,
    stopAndClosePlayer,
    togglePlayerVisibility,
    toggleFullscreen
  };
};
