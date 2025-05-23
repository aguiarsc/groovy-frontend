import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { artistService } from '../services/artist.service';
import { ArtistDto } from '../types';
import { ArtistCard } from '../components/music/ArtistCard';
import { Filter } from '../components/layout/Filter';

/**
 * Artists Page
 * 
 * Displays a grid of music artists with filtering capabilities.
 * Allows users to filter artists by minimum album count and song count.
 * Each artist is presented as an interactive card with their details.
 */
export const ArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<ArtistDto[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<ArtistDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [albumCountFilter, setAlbumCountFilter] = useState(0);
  const [songCountFilter, setSongCountFilter] = useState(0);

  useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true);
      try {
        const response = await artistService.getAllArtists();
        if (response.data) {
          setArtists(response.data);
          setFilteredArtists(response.data);
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtists();
  }, []);

  useEffect(() => {
    let result = [...artists];
    
    if (albumCountFilter > 0 || songCountFilter > 0) {
      result = result.filter((artist) => {
        const albumCount = artist.albums?.length ?? 0;
        const songCount = artist.albums?.reduce((acc, album) => acc + (album.songs?.length ?? 0), 0) ?? 0;
        
        return (
          (albumCountFilter === 0 || albumCount >= albumCountFilter) && 
          (songCountFilter === 0 || songCount >= songCountFilter)
        );
      });
    }
    
    setFilteredArtists(result);
  }, [artists, albumCountFilter, songCountFilter]);

  const handleResetFilters = () => {
    setAlbumCountFilter(0);
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
        {filteredArtists.length === 0 ? (
          <p className="text-macchiato-subtext0 text-center py-8 col-span-full">No artists found</p>
        ) : (
          filteredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-macchiato-text">Artists</h1>
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
              label: 'Min Album Count',
              type: 'number',
              value: albumCountFilter,
              onChange: setAlbumCountFilter,
              min: 0
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
