import React, { useEffect, useState } from 'react';
import { AlbumCard } from '../components/music/AlbumCard';
import { Button } from '../components/ui/Button';
import { albumService } from '../services/album.service';
import { AlbumDto } from '../types';
import { Filter } from '../components/layout/Filter';

/**
 * Albums Page Component
 * 
 * Displays a grid of music albums with filtering capabilities.
 * Allows users to filter albums by artist name and minimum song count.
 * Features a responsive grid layout that adapts to different screen sizes.
 */
export const AlbumsPage: React.FC = () => {
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<AlbumDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [artistFilter, setArtistFilter] = useState('');
  const [songCountFilter, setSongCountFilter] = useState(0);

  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      try {
        const response = await albumService.getAllAlbums();
        if (response.data) {
          setAlbums(response.data);
          setFilteredAlbums(response.data);
        }
      } catch (error) {
        console.error('Error fetching albums:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  useEffect(() => {
    let result = [...albums];
    
    if (artistFilter) {
      result = result.filter((album) =>
        album.artistName?.toLowerCase().includes(artistFilter.toLowerCase())
      );
    }
    
    if (songCountFilter > 0) {
      result = result.filter((album) => 
        (album.songs?.length || 0) >= songCountFilter
      );
    }
    
    setFilteredAlbums(result);
  }, [albums, artistFilter, songCountFilter]);

  const handleResetFilters = () => {
    setArtistFilter('');
    setSongCountFilter(0);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredAlbums.length === 0 ? (
          <p className="text-macchiato-subtext0 text-center py-8 col-span-full">No albums found</p>
        ) : (
          filteredAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-macchiato-text">Albums</h1>
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filter
        </Button>
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
              label: 'Min Song Count',
              type: 'number',
              value: songCountFilter,
              onChange: setSongCountFilter,
              min: 0
            },
          ]}
          onReset={handleResetFilters}
        />
      )}
      {renderContent()}
    </div>
  );
};
