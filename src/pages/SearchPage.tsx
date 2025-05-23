import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiMusic, FiDisc, FiUsers } from 'react-icons/fi';
import { songService } from '../services/song.service';
import { albumService } from '../services/album.service';
import { artistService } from '../services/artist.service';
import { SongDto, AlbumDto, ArtistDto } from '../types';
import { SongCard } from '../components/music/SongCard';
import { AlbumCard } from '../components/music/AlbumCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { usePlayer } from '../hooks/usePlayer';

/**
 * Search Page
 * 
 * Displays search results across songs, albums, and artists based on user query.
 * Features tabbed navigation to filter between different result types.
 * Handles loading states and provides a responsive grid layout for results.
 */
export const SearchPage: React.FC = () => {
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
      if (!query) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const [songsResponse, albumsResponse, artistsResponse] = await Promise.all([
          songService.searchSongs(query),
          albumService.searchAlbums(query),
          artistService.searchArtists(query)
        ]);
        
        setSongs(songsResponse.data || []);
        setAlbums(albumsResponse.data || []);
        setArtists(artistsResponse.data || []);
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
    
    if (!query) {
      return (
        <div className="text-center py-12">
          <p className="text-macchiato-subtext0">Enter a search query to find songs, albums, and artists.</p>
        </div>
      );
    }
    
    if (songs.length === 0 && albums.length === 0 && artists.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-macchiato-subtext0">No results found for "{query}"</p>
          <p className="text-macchiato-overlay1 mt-2">Try a different search term or browse our catalog.</p>
          <div className="mt-4">
            <Button variant="primary" to="/browse">Browse Music</Button>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'all') {
      return (
        <div className="space-y-8">
          {songs.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-macchiato-text flex items-center">
                  <FiMusic className="mr-2" />
                  Songs
                </h2>
                {songs.length > 5 && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveTab('songs')}
                  >
                    View All ({songs.length})
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {songs.slice(0, 5).map((song) => (
                  <SongCard 
                    key={song.id} 
                    song={song}
                    onAddToPlaylist={handleAddToQueue}
                  />
                ))}
              </div>
            </section>
          )}

          {albums.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-macchiato-text flex items-center">
                  <FiDisc className="mr-2" />
                  Albums
                </h2>
                {albums.length > 5 && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveTab('albums')}
                  >
                    View All ({albums.length})
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {albums.slice(0, 5).map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}
          
          {artists.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-macchiato-text flex items-center">
                  <FiUsers className="mr-2" />
                  Artists
                </h2>
                {artists.length > 5 && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveTab('artists')}
                  >
                    View All ({artists.length})
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {artists.slice(0, 5).map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}
        </div>
      );
    }
    
    if (activeTab === 'songs') {
      return (
        <section>
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-macchiato-text flex items-center">
              <FiMusic className="mr-2" />
              Songs ({songs.length})
            </h2>
          </div>
          {renderSongs()}
        </section>
      );
    }
    
    if (activeTab === 'albums') {
      return (
        <section>
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-macchiato-text flex items-center">
              <FiDisc className="mr-2" />
              Albums ({albums.length})
            </h2>
          </div>
          {renderAlbums()}
        </section>
      );
    }
    
    if (activeTab === 'artists') {
      return (
        <section>
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-macchiato-text flex items-center">
              <FiUsers className="mr-2" />
              Artists ({artists.length})
            </h2>
          </div>
          {renderArtists()}
        </section>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-macchiato-text">
          Search Results for "{query}"
        </h1>
        
        {/* Tabs */}
        {!isLoading && (songs.length > 0 || albums.length > 0 || artists.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Card 
              className={`px-4 py-2 cursor-pointer ${activeTab === 'all' ? 'bg-macchiato-surface0 text-macchiato-mauve' : 'bg-macchiato-mantle text-macchiato-text'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </Card>
            {songs.length > 0 && (
              <Card 
                className={`px-4 py-2 cursor-pointer ${activeTab === 'songs' ? 'bg-macchiato-surface0 text-macchiato-mauve' : 'bg-macchiato-mantle text-macchiato-text'}`}
                onClick={() => setActiveTab('songs')}
              >
                Songs ({songs.length})
              </Card>
            )}
            {albums.length > 0 && (
              <Card 
                className={`px-4 py-2 cursor-pointer ${activeTab === 'albums' ? 'bg-macchiato-surface0 text-macchiato-mauve' : 'bg-macchiato-mantle text-macchiato-text'}`}
                onClick={() => setActiveTab('albums')}
              >
                Albums ({albums.length})
              </Card>
            )}
            {artists.length > 0 && (
              <Card 
                className={`px-4 py-2 cursor-pointer ${activeTab === 'artists' ? 'bg-macchiato-surface0 text-macchiato-mauve' : 'bg-macchiato-mantle text-macchiato-text'}`}
                onClick={() => setActiveTab('artists')}
              >
                Artists ({artists.length})
              </Card>
            )}
          </div>
        )}
      </div>
      
      {renderContent()}
    </div>
  );
};
