import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SongCard } from '../components/music/SongCard';
import { AlbumCard } from '../components/music/AlbumCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { Button } from '../components/ui/Button';
import { songService } from '../services/song.service';
import { albumService } from '../services/album.service';
import { artistService } from '../services/artist.service';
import { SongDto, AlbumDto, ArtistDto } from '../types';
import { usePlayer } from '../hooks/usePlayer';

/**
 * Search Results Page
 * 
 * Displays search results for songs, albums, and artists based on the search query.
 * Features tabbed navigation to filter between different result types.
 * Handles loading states and provides a clean, responsive layout for results.
 */
export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [songs, setSongs] = useState<SongDto[]>([]);
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [artists, setArtists] = useState<ArtistDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'albums' | 'artists'>('all');
  
  const { addToQueue } = usePlayer();
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      setIsLoading(true);
      
      try {
        const [songsResponse, albumsResponse, artistsResponse] = await Promise.all([
          songService.searchSongs(query),
          albumService.searchAlbums(query),
          artistService.searchArtists(query)
        ]);
        
        if (songsResponse.data) {
          setSongs(songsResponse.data);
        }
        
        if (albumsResponse.data) {
          setAlbums(albumsResponse.data);
        }
        
        if (artistsResponse.data) {
          setArtists(artistsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);
  
  const handleAddToQueue = (song: SongDto) => {
    addToQueue(song);
  };
  
  const renderSongs = () => {
    if (songs.length === 0) {
      return <p className="text-macchiato-subtext0 text-center py-4">No songs found</p>;
    }
    
    return (
      <div className="space-y-2">
        {songs.map((song) => (
          <SongCard 
            key={song.id} 
            song={song}
            onAddToPlaylist={handleAddToQueue}
          />
        ))}
      </div>
    );
  };
  
  const renderAlbums = () => {
    if (albums.length === 0) {
      return <p className="text-macchiato-subtext0 text-center py-4">No albums found</p>;
    }
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    );
  };
  
  const renderArtists = () => {
    if (artists.length === 0) {
      return <p className="text-macchiato-subtext0 text-center py-4">No artists found</p>;
    }
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    );
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
        </div>
      );
    }
    
    if (activeTab === 'songs') {
      return renderSongs();
    }
    
    if (activeTab === 'albums') {
      return renderAlbums();
    }
    
    if (activeTab === 'artists') {
      return renderArtists();
    }
    
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-macchiato-text mb-4">Songs</h2>
          {renderSongs()}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-macchiato-text mb-4">Albums</h2>
          {renderAlbums()}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-macchiato-text mb-4">Artists</h2>
          {renderArtists()}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-macchiato-text">
          Search Results for "{query}"
        </h1>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={activeTab === 'all' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('all')}
          >
            All
          </Button>
          <Button
            variant={activeTab === 'songs' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('songs')}
          >
            Songs ({songs.length})
          </Button>
          <Button
            variant={activeTab === 'albums' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('albums')}
          >
            Albums ({albums.length})
          </Button>
          <Button
            variant={activeTab === 'artists' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('artists')}
          >
            Artists ({artists.length})
          </Button>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};
