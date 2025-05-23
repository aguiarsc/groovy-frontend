import { create } from 'zustand';
import { SongDto, PlaylistDto } from '../types';

/**
 * Interface defining the state and actions for the music player
 * 
 * This store manages the entire playback experience, including:
 * - Current song and playlist tracking
 * - Queue management
 * - Playback state (playing/paused)
 * - Audio settings (volume, progress, duration)
 * - Player UI state (visibility, fullscreen mode)
 */
interface PlayerState {
  currentSong: SongDto | null;
  currentPlaylist: PlaylistDto | null;
  queue: SongDto[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isPlayerVisible: boolean;
  isFullscreen: boolean;
  
  playSong: (song: SongDto) => void;
  playQueue: (songs: SongDto[], startIndex: number) => void;
  playPlaylist: (playlist: PlaylistDto, startIndex?: number) => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  
  addToQueue: (song: SongDto) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  updateQueueOrder: (newQueue: SongDto[]) => void;
  
  stopAndClosePlayer: () => void;
  togglePlayerVisibility: () => void;
  toggleFullscreen: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  currentPlaylist: null,
  queue: [],
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  isPlayerVisible: true,
  isFullscreen: false,

  playSong: (song: SongDto) => {
    const { isPlaying, currentSong } = get();
    
    if (currentSong?.id === song.id) {
      if (!isPlaying) {
        set({ isPlaying: true });
      }
      return;
    }
    
    console.log(`playerStore: Playing song: ${song.title}`);
    set({ 
      currentSong: song,
      isPlaying: true,
      progress: 0,
      isPlayerVisible: true
    });
  },
  
  playQueue: (songs: SongDto[], startIndex: number) => {
    if (!songs.length || startIndex >= songs.length) {
      console.warn('Invalid queue or start index');
      return;
    }
    
    const newQueue = [...songs];
    const currentSong = newQueue[startIndex];
    
    newQueue.splice(startIndex, 1);
    
    console.log(`playerStore: Playing queue starting with: ${currentSong.title}`);
    set({ 
      currentSong,
      queue: newQueue,
      isPlaying: true,
      progress: 0,
      isPlayerVisible: true
    });
  },
  
  playPlaylist: (playlist: PlaylistDto, startIndex: number = 0) => {
    if (!playlist.songs || !playlist.songs.length) {
      console.warn('Playlist has no songs');
      return;
    }
    
    const { playQueue } = get();
    console.log(`playerStore: Playing playlist: ${playlist.name}`);
    
    set({ currentPlaylist: playlist });
    playQueue(playlist.songs, startIndex);
  },
  
  togglePlay: () => {
    const { isPlaying, currentSong } = get();
    
    if (currentSong) {
      console.log(`playerStore: Toggle play/pause - now ${!isPlaying ? 'playing' : 'paused'}`);
      set({ isPlaying: !isPlaying });
    }
  },

  play: () => {
    const { currentSong } = get();
    if (currentSong) {
      console.log('playerStore: Play');
      set({ isPlaying: true });
    }
  },

  pause: () => {
    console.log('playerStore: Pause');
    set({ isPlaying: false });
  },

  next: () => {
    const { queue, currentPlaylist } = get();
    
    if (queue.length > 0) {
      const nextSong = queue[0];
      const newQueue = [...queue];
      newQueue.shift();
      
      console.log(`playerStore: Playing next song: ${nextSong.title}`);
      set({ 
        currentSong: nextSong,
        queue: newQueue,
        progress: 0,
        isPlaying: true
      });
    } else if (currentPlaylist && currentPlaylist.songs && currentPlaylist.songs.length > 0) {
      console.log('playerStore: Restarting playlist from beginning');
      set({
        currentSong: currentPlaylist.songs[0],
        queue: currentPlaylist.songs.slice(1),
        progress: 0,
        isPlaying: true
      });
    } else {
      console.log('playerStore: No more songs in queue');
      set({ 
        isPlaying: false,
        progress: 0
      });
    }
  },
  
  previous: () => {
    const { progress, currentSong, currentPlaylist } = get();
    
    if (progress > 3) {
      console.log('playerStore: Restarting current song');
      set({ progress: 0 });
      return;
    }
    
    if (currentPlaylist && currentPlaylist.songs && currentPlaylist.songs.length > 0) {
      const currentIndex = currentPlaylist.songs.findIndex(
        song => song.id === currentSong?.id
      );
      
      if (currentIndex > 0) {
        const previousSong = currentPlaylist.songs[currentIndex - 1];
        const newQueue = [...currentPlaylist.songs];
        newQueue.splice(0, currentIndex);
        
        console.log(`playerStore: Playing previous song: ${previousSong.title}`);
        set({
          currentSong: previousSong,
          queue: newQueue,
          progress: 0,
          isPlaying: true
        });
      } else {
        console.log('playerStore: Restarting first song in playlist');
        set({ progress: 0 });
      }
    }
  },
  
  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },
  setProgress: (progress: number) => {
    set({ progress });
  },
  
  setDuration: (duration: number) => {
    set({ duration });
  },
  
  addToQueue: (song: SongDto) => {
    const { queue } = get();
    console.log(`playerStore: Adding to queue: ${song.title}`);
    set({ queue: [...queue, song] });
  },
  
  removeFromQueue: (index: number) => {
    const { queue } = get();
    if (index >= 0 && index < queue.length) {
      const newQueue = [...queue];
      const removedSong = newQueue[index];
      newQueue.splice(index, 1);
      console.log(`playerStore: Removing from queue: ${removedSong.title}`);
      set({ queue: newQueue });
    }
  },

  clearQueue: () => {
    console.log('playerStore: Clearing queue');
    set({ queue: [] });
  },
  
  updateQueueOrder: (newQueue: SongDto[]) => {
    console.log('playerStore: Updating queue order');
    set({ queue: newQueue });
  },
  
  stopAndClosePlayer: () => {
    console.log('playerStore: Stopping and closing player');
    set({ 
      isPlaying: false,
      currentSong: null,
      currentPlaylist: null,
      queue: [],
      progress: 0,
      isPlayerVisible: false,
      isFullscreen: false
    });
  },

  togglePlayerVisibility: () => {
    const { isPlayerVisible } = get();
    console.log(`playerStore: ${isPlayerVisible ? 'Hiding' : 'Showing'} player`);
    set({ 
      isPlayerVisible: !isPlayerVisible,
      isFullscreen: !isPlayerVisible ? false : get().isFullscreen
    });
  },
  
  toggleFullscreen: () => {
    const { isFullscreen, isPlayerVisible } = get();
    
    if (!isPlayerVisible) {
      set({ 
        isPlayerVisible: true,
        isFullscreen: true
      });
    } else {
      set({ isFullscreen: !isFullscreen });
    }
  }
}));

export const usePlayerStoreSelector = <T>(selector: (state: PlayerState) => T) => 
  usePlayerStore(selector);
