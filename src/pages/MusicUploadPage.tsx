import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiPlus, FiTrash2, FiMusic, FiDisc } from 'react-icons/fi';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { songService } from '../services/song.service';
import { albumService } from '../services/album.service';
import { useAuth } from '../hooks/useAuth';
import { AlbumDto } from '../types';

interface SongUploadForm {
  title: string;
  file: File | null;
  duration: number;
}

/**
 * Music Upload Page
 * 
 * Enables artists to upload new music albums with multiple songs.
 * Handles file uploads, form validation, and submission to the backend.
 * Includes album details, cover art, and track management functionality.
 */
export const MusicUploadPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [albumName, setAlbumName] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [albumCover, setAlbumCover] = useState<File | null>(null);
  const [albumCoverPreview, setAlbumCoverPreview] = useState<string | null>(null);
  
  const [songs, setSongs] = useState<SongUploadForm[]>([{ title: '', file: null, duration: 0 }]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleAlbumCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAlbumCover(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setAlbumCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSongFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      
      audio.onloadedmetadata = () => {
        const updatedSongs = [...songs];
        updatedSongs[index] = {
          ...updatedSongs[index],
          file,
          duration: Math.round(audio.duration)
        };
        setSongs(updatedSongs);
      };
    }
  };
  
  const handleSongTitleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSongs = [...songs];
    updatedSongs[index] = {
      ...updatedSongs[index],
      title: e.target.value
    };
    setSongs(updatedSongs);
  };
  
  const addSong = () => {
    setSongs([...songs, { title: '', file: null, duration: 0 }]);
  };
  
  const removeSong = (index: number) => {
    if (songs.length > 1) {
      const updatedSongs = [...songs];
      updatedSongs.splice(index, 1);
      setSongs(updatedSongs);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!albumName.trim()) {
      setError('Album name is required');
      return;
    }
    
    if (!releaseDate) {
      setError('Release date is required');
      return;
    }
    
    const invalidSongs = songs.filter(song => !song.title.trim() || !song.file);
    if (invalidSongs.length > 0) {
      setError('All songs must have a title and audio file');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      const albumData: AlbumDto = {
        name: albumName,
        artistId: user?.id || 0,
        releaseDate: new Date(releaseDate).toISOString(),
      };
      
      const albumResponse = await albumService.createAlbum(albumData);
      
      if (!albumResponse.data || !albumResponse.data.id) {
        throw new Error(albumResponse.error || 'Failed to create album');
      }
      
      const albumId = albumResponse.data.id;
      
      if (albumCover) {
        const coverResponse = await albumService.uploadAlbumCover(albumId, albumCover);
        if (!coverResponse.data) {
          console.error('Warning: Failed to upload album cover, but continuing with song uploads');
        }
      }
      
      const songPromises = songs.map(async (song) => {
        if (!song.file) return Promise.resolve();
        
        const formData = new FormData();
        formData.append('file', song.file);
        formData.append('title', song.title);
        formData.append('albumId', albumId.toString());
        formData.append('duration', song.duration.toString());
        
        const fileExtension = song.file.name.split('.').pop();
        const cleanTitle = song.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const customFilename = `${cleanTitle}_${Date.now()}.${fileExtension}`;
        formData.append('customFilename', customFilename);
        
        try {
          const response = await songService.uploadSong(formData);
          if (!response.data) {
            console.error(`Failed to upload song: ${song.title}`);
          }
          return response;
        } catch (error) {
          console.error(`Error uploading song: ${song.title}`, error);
          throw error;
        }
      });
      
      try {
        await Promise.all(songPromises);
        setSuccessMessage('Album and songs uploaded successfully!');
      } catch (songError) {
        console.error('Error uploading songs:', songError);
        setError('Album created but some songs failed to upload. Please try again.');
      }
      
      setAlbumName('');
      setReleaseDate('');
      setAlbumCover(null);
      setAlbumCoverPreview(null);
      setSongs([{ title: '', file: null, duration: 0 }]);
      
      setTimeout(() => {
        navigate('/artist/dashboard');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error uploading album:', err);
      setError(err.message || 'Failed to upload album and songs');
    } finally {
      setIsUploading(false);
    }
  };
  
  if (!user || user.role !== 'ARTIST') {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold text-macchiato-text mb-4">Access Denied</h2>
        <p className="text-macchiato-subtext0 mb-4">You must be logged in as an artist to upload music.</p>
        <Button
          variant="primary"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-macchiato-text">Upload Music</h1>
      
      {error && (
        <div className="bg-macchiato-red/20 border border-macchiato-red text-macchiato-red px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-macchiato-green/20 border border-macchiato-green text-macchiato-green px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-macchiato-text mb-4 flex items-center">
            <FiDisc className="mr-2" />
            Album Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Album Name"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                placeholder="Enter album name"
                fullWidth
              />
              
              <Input
                label="Release Date"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                fullWidth
                className="mt-4"
              />
            </div>
            
            <div>
              <label className="block text-macchiato-text font-medium mb-2">
                Album Cover
              </label>
              
              <div 
                className="border-2 border-dashed border-macchiato-overlay0 rounded-lg h-48 flex items-center justify-center cursor-pointer hover:border-macchiato-mauve transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {albumCoverPreview ? (
                  <img 
                    src={albumCoverPreview} 
                    alt="Album cover preview" 
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center p-4">
                    <FiUpload className="mx-auto h-12 w-12 text-macchiato-overlay0" />
                    <p className="mt-2 text-sm text-macchiato-subtext0">Click to upload album cover</p>
                    <p className="text-xs text-macchiato-overlay1">PNG, JPG, GIF up to 2MB</p>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAlbumCoverChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        </Card>
        
        {/* Songs */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-macchiato-text flex items-center">
              <FiMusic className="mr-2" />
              Songs
            </h2>
            
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addSong}
              className="flex items-center"
            >
              <FiPlus className="mr-1" />
              Add Song
            </Button>
          </div>
          
          <div className="space-y-4">
            {songs.map((song, index) => (
              <div key={index} className="p-4 bg-macchiato-surface0 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-macchiato-text">Song {index + 1}</h3>
                  
                  {songs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSong(index)}
                      className="text-macchiato-overlay1 hover:text-macchiato-red transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Song Title"
                    value={song.title}
                    onChange={(e) => handleSongTitleChange(index, e)}
                    placeholder="Enter song title"
                    fullWidth
                  />
                  
                  <div>
                    <label className="block text-macchiato-text font-medium mb-2">
                      Audio File
                    </label>
                    
                    <div className="flex items-center">
                      <input
                        type="file"
                        onChange={(e) => handleSongFileChange(index, e)}
                        className="hidden"
                        accept="audio/*"
                        id={`song-file-${index}`}
                      />
                      
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => document.getElementById(`song-file-${index}`)?.click()}
                        className="flex items-center"
                      >
                        <FiUpload className="mr-2" />
                        {song.file ? 'Change File' : 'Upload File'}
                      </Button>
                      
                      {song.file && (
                        <span className="ml-3 text-sm text-macchiato-subtext0">
                          {song.file.name} ({song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : 'Loading...'})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isUploading}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Album'}
          </Button>
        </div>
      </form>
    </div>
  );
};
