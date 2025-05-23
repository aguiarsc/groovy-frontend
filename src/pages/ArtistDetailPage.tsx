import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiUser, FiCalendar } from 'react-icons/fi';
import { AlbumCard } from '../components/music/AlbumCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { artistService } from '../services/artist.service';
import { albumService } from '../services/album.service';
import { ArtistDto, AlbumDto } from '../types';
import { getImageUrl } from '../utils/formatters';

/**
 * Artist Detail Page
 * 
 * Displays detailed information about a music artist, including their profile,
 * biography, and discography. Fetches and shows all albums by the artist.
 * Includes sections for popular songs and similar artists (coming soon).
 */
export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<ArtistDto | null>(null);
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchArtistData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const artistId = parseInt(id, 10);
        
        if (isNaN(artistId)) {
          setError('Invalid artist ID');
          setIsLoading(false);
          return;
        }
        
        const artistResponse = await artistService.getArtistById(artistId);
        if (artistResponse.data) {
          setArtist(artistResponse.data);
        } else if (artistResponse.error) {
          setError(artistResponse.error);
          setIsLoading(false);
          return;
        }
        
        const albumsResponse = await albumService.getAlbumsByArtistId(artistId);
        if (albumsResponse.data) {
          setAlbums(albumsResponse.data);
        } else if (albumsResponse.error) {
          console.error('Error fetching albums:', albumsResponse.error);
        }
      } catch (err) {
        console.error('Error fetching artist data:', err);
        setError('Failed to load artist information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArtistData();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
      </div>
    );
  }
  
  if (error || !artist) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold text-macchiato-text mb-4">{error || 'Artist not found'}</h2>
        <Link to="/artists">
          <Button variant="primary">Back to Artists</Button>
        </Link>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 h-64 bg-macchiato-surface0 rounded-lg shadow-neumorphic-dark flex items-center justify-center flex-shrink-0">
          {artist.profilePicture ? (
            <img 
              src={getImageUrl(artist.profilePicture)} 
              alt={artist.name} 
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <FiUser className="text-macchiato-mauve" size={64} />
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-macchiato-text mb-2">{artist.name}</h1>
          
          <div className="flex items-center text-macchiato-subtext0 mb-4">
            <FiCalendar className="mr-1" />
            <span>Joined {artist.createdAt ? new Date(artist.createdAt).toLocaleDateString() : 'Unknown date'}</span>
            <span className="mx-2">•</span>
            <span>{albums.length} albums</span>
          </div>
          
          {artist.biography && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-macchiato-text mb-2">Biography</h2>
              <p className="text-macchiato-subtext0 whitespace-pre-line">{artist.biography}</p>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-macchiato-text">Albums</h2>
        </div>
        
        {albums.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-macchiato-subtext0">No albums available</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
