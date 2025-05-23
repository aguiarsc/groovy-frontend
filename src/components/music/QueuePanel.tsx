import React, { useState } from 'react';
import { FiMusic, FiX, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { usePlayer } from '../../hooks/usePlayer';
import { formatDuration, getImageUrl } from '../../utils/formatters';
import { SongDto } from '../../types';

interface QueuePanelProps {
  onClose: () => void;
}

/**
 * QueuePanel Component
 * 
 * A floating panel that displays the current playback queue, currently playing song,
 * and provides controls for queue management (reordering, removing, and clearing).
 * 
 * Features:
 * - Displays currently playing song with album art and metadata
 * - Shows all queued songs with album art, title, artist, and duration
 * - Allows reordering songs in the queue via up/down controls
 * - Provides removal of individual songs from the queue
 * - Offers a clear queue function with confirmation dialog
 * - Shows total queue duration
 * - Scrollable list for long queues with fixed header
 * - Fallback UI for empty queue state
 */
export const QueuePanel: React.FC<QueuePanelProps> = ({ onClose }) => {
  const { 
    currentSong, 
    queue, 
    removeFromQueue, 
    clearQueue,
    playSong
  } = usePlayer();
  
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const moveSongUp = (index: number) => {
    if (index <= 0) return;
    
    const newQueue = [...queue];
    [newQueue[index], newQueue[index - 1]] = [newQueue[index - 1], newQueue[index]];
    
    const removedSong = newQueue[index];
    removeFromQueue(index);
    removeFromQueue(index - 1);
    
    setTimeout(() => {
      playSong(removedSong);
      setTimeout(() => {
        playSong(newQueue[index - 1]);
      }, 100);
    }, 100);
  };
  

  const moveSongDown = (index: number) => {
    if (index >= queue.length - 1) return;
    
    const newQueue = [...queue];
    [newQueue[index], newQueue[index + 1]] = [newQueue[index + 1], newQueue[index]];
    
    const removedSong = newQueue[index];
    removeFromQueue(index);
    removeFromQueue(index);
    
    setTimeout(() => {
      playSong(removedSong);
      setTimeout(() => {
        playSong(newQueue[index]);
      }, 100);
    }, 100);
  };
  
  const totalDuration = queue.reduce((total, song: SongDto) => total + (song.duration || 0), 0);
  
  return (
    <div className="absolute bottom-full right-0 mb-2 w-96 max-h-[70vh] flex flex-col bg-macchiato-base/90 backdrop-blur-lg border border-macchiato-overlay0/30 rounded-lg shadow-neumorphic-dark overflow-hidden z-50">
      {/* Panel header with title, duration, and action buttons */}
      <div className="flex items-center justify-between p-4 border-b border-macchiato-overlay0/20">
        <div>
          <h3 className="text-macchiato-text font-medium">Queue ({queue.length})</h3>
          {queue.length > 0 && (
            <p className="text-macchiato-subtext0 text-xs">
              Total: {formatDuration(totalDuration)}
            </p>
          )}
        </div>
        
        {/* Queue management buttons */}
        <div className="flex items-center space-x-2">
          {queue.length > 0 && (
            <>
              {/* Clear queue button with confirmation dialog */}
              {showClearConfirm ? (
                <div className="flex items-center">
                  <button 
                    onClick={() => {
                      clearQueue();
                      setShowClearConfirm(false);
                    }}
                    className="text-xs bg-macchiato-red px-2 py-1 rounded text-macchiato-base"
                  >
                    Confirm
                  </button>
                  <button 
                    onClick={() => setShowClearConfirm(false)}
                    className="text-xs ml-2 text-macchiato-overlay2 hover:text-macchiato-text"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowClearConfirm(true)}
                  className="text-macchiato-overlay2 hover:text-macchiato-red transition-colors"
                  title="Clear queue"
                >
                  <FiTrash2 size={18} />
                </button>
              )}
            </>
          )}
          
          {/* Close panel button */}
          <button 
            onClick={onClose}
            className="text-macchiato-overlay2 hover:text-macchiato-red transition-colors"
            title="Close queue"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>
      
      {/* Currently playing song section */}
      {currentSong && (
        <div className="p-4 border-b border-macchiato-overlay0/20">
          <h4 className="text-macchiato-subtext0 text-xs uppercase tracking-wider mb-2">Now Playing</h4>
          <div className="flex items-center space-x-3 animate-pulse-subtle">
            {/* Album cover with fallback */}
            <div className="w-10 h-10 bg-macchiato-surface0 rounded-md flex-shrink-0 overflow-hidden">
              {currentSong.albumId ? (
                <img 
                  src={getImageUrl(`album${currentSong.albumId}.jpg`)}
                  alt={currentSong.albumName || 'Album cover'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.classList.add('flex', 'items-center', 'justify-center');
                      const icon = document.createElement('div');
                      icon.className = 'text-macchiato-mauve';
                      icon.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
                      parent.appendChild(icon);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiMusic className="text-macchiato-mauve" size={16} />
                </div>
              )}
            </div>
            
            {/* Song title and artist */}
            <div className="min-w-0 flex-1">
              <p className="text-macchiato-text font-medium truncate">{currentSong.title}</p>
              <p className="text-macchiato-subtext0 text-sm truncate">{currentSong.artistName}</p>
            </div>
            
            {/* Song duration */}
            <span className="text-macchiato-subtext1 text-xs">
              {formatDuration(currentSong.duration)}
            </span>
          </div>
        </div>
      )}
      
      {/* Queue list container with scrollable area */}
      <div className="flex-1 overflow-y-auto">
        {queue.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-macchiato-subtext0">No songs in queue</p>
            <p className="text-macchiato-overlay0 text-sm mt-1">
              Add songs to the queue by clicking the "+" button on any song
            </p>
          </div>
        ) : (
          <ul className="pb-2">
            {queue.map((song: SongDto, index) => (
              <li 
                key={`${song.id}-${index}`}
                className="flex items-center px-4 py-2 border-b border-macchiato-overlay0/10 last:border-b-0 hover:bg-macchiato-surface0/50 transition-colors"
              >
                {/* Track number in queue */}
                <div className="text-macchiato-overlay1 w-6 text-center text-sm">
                  {index + 1}
                </div>
                
                {/* Album artwork with fallback */}
                <div className="w-8 h-8 bg-macchiato-surface0 rounded overflow-hidden mx-2 flex-shrink-0">
                  {song.albumId ? (
                    <img 
                      src={getImageUrl(`album${song.albumId}.jpg`)}
                      alt={song.albumName || 'Album cover'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Handle image load failure
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.classList.add('flex', 'items-center', 'justify-center');
                          const icon = document.createElement('div');
                          icon.className = 'text-macchiato-mauve';
                          icon.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
                          parent.appendChild(icon);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiMusic className="text-macchiato-mauve" size={14} />
                    </div>
                  )}
                </div>
                
                {/* Song title and artist (clickable to play this song) */}
                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => playSong(song)}>
                  <p className="text-macchiato-text text-sm truncate hover:text-macchiato-mauve">
                    {song.title}
                  </p>
                  <p className="text-macchiato-subtext0 text-xs truncate">
                    {song.artistName}
                  </p>
                </div>
                
                {/* Song duration */}
                <span className="text-macchiato-subtext1 text-xs mx-2">
                  {formatDuration(song.duration)}
                </span>
                
                {/* Reordering controls */}
                <div className="flex flex-col mx-1">
                  <button
                    onClick={() => moveSongUp(index)}
                    disabled={index === 0}
                    className={`text-xs ${index === 0 ? 'text-macchiato-overlay0 cursor-not-allowed' : 'text-macchiato-overlay1 hover:text-macchiato-mauve cursor-pointer'}`}
                    title="Move up"
                  >
                    <FiArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveSongDown(index)}
                    disabled={index === queue.length - 1}
                    className={`text-xs ${index === queue.length - 1 ? 'text-macchiato-overlay0 cursor-not-allowed' : 'text-macchiato-overlay1 hover:text-macchiato-mauve cursor-pointer'}`}
                    title="Move down"
                  >
                    <FiArrowDown size={14} />
                  </button>
                </div>
                
                {/* Remove from queue button */}
                <button
                  onClick={() => removeFromQueue(index)}
                  className="text-macchiato-overlay1 hover:text-macchiato-red transition-colors ml-2"
                  title="Remove from queue"
                >
                  <FiX size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
