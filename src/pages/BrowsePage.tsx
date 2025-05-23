import React, { useEffect, useState } from 'react';
import { FiGrid, FiList } from 'react-icons/fi';
import { SongCard } from '../components/music/SongCard';
import { Button } from '../components/ui/Button';
import { songService } from '../services/song.service';
import { SongDto } from '../types';
import { usePlayer } from '../hooks/usePlayer';
import { Filter } from '../components/layout/Filter';

/**
 * Browse Page
 * 
 * Displays a collection of songs with filtering and view options.
 * Supports grid and list views with filtering by artist and duration.
 * Includes sortable columns and the ability to add songs to the player queue.
 */
export const BrowsePage: React.FC = () => {
  const [songs, setSongs] = useState<SongDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [artistFilter, setArtistFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { addToQueue } = usePlayer();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const songsResponse = await songService.getAllSongs();
        if (songsResponse.data) {
          setSongs(songsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToQueue = (song: SongDto) => {
    addToQueue(song);
  };

  const filteredSongs = songs
    .filter((song) => 
      !artistFilter || 
      song.artistName?.toLowerCase().includes(artistFilter.toLowerCase())
    )
    .filter((song) => 
      durationFilter === 0 || 
      Math.floor(song.duration / 60) <= durationFilter
    )
    .sort((a, b) => 
      sortOrder === 'asc' ? a.duration - b.duration : b.duration - a.duration
    );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
        </div>
      );
    }
    return (
      <>
        {filteredSongs.length === 0 ? (
          <p className="text-macchiato-subtext0 text-center py-8">No songs found</p>
        ) : compactView ? (
          <div className="space-y-2">
            {filteredSongs.map((song) => (
              <div key={song.id} className="w-full">
                <SongCard
                  song={song}
                  onAddToPlaylist={handleAddToQueue}
                  showFavoriteButton
                  compact
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
            {filteredSongs.map((song) => (
              <div key={song.id} className="w-full hover:shadow-neumorphic-light">
                <SongCard
                  song={song}
                  onAddToPlaylist={handleAddToQueue}
                  showFavoriteButton
                  compact={false}
                />
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-macchiato-text">Browse Songs</h1>
        <div className="flex items-center space-x-2">
          <div className="flex border border-macchiato-overlay0/20 rounded-lg overflow-hidden ml-2">
            <button
              className={`px-3 py-2 flex items-center justify-center ${!compactView ? 'bg-macchiato-mauve text-macchiato-base' : 'bg-macchiato-surface0 text-macchiato-text hover:bg-macchiato-surface1'}`}
              onClick={() => setCompactView(false)}
              title="Grid view"
            >
              <FiGrid size={16} />
            </button>
            <button
              className={`px-3 py-2 flex items-center justify-center ${compactView ? 'bg-macchiato-mauve text-macchiato-base' : 'bg-macchiato-surface0 text-macchiato-text hover:bg-macchiato-surface1'}`}
              onClick={() => setCompactView(true)}
              title="List view"
            >
              <FiList size={16} />
            </button>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="ml-2"
          >
            Filter
          </Button>
        </div>
      </div>
      {showFilters && (
        <Filter
          filters={[
            {
              label: 'Artist',
              type: 'text',
              value: artistFilter,
              onChange: setArtistFilter,
            },
            {
              label: 'Max Duration (minutes)',
              type: 'number',
              value: durationFilter,
              onChange: setDurationFilter,
              min: 0
            },
            {
              label: 'Sort Order',
              type: 'select',
              value: sortOrder,
              onChange: (value: string) => setSortOrder(value as 'asc' | 'desc'),
              options: [
                { value: 'asc', label: 'Ascending' },
                { value: 'desc', label: 'Descending' },
              ],
            },
          ]}
          onReset={() => {
            setArtistFilter('');
            setDurationFilter(0);
            setSortOrder('asc');
          }}
        />
      )}
      {renderContent()}
    </div>
  );
};
