import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { ArtistDto } from '../../types';
import { getImageUrl } from '../../utils/formatters';

interface ArtistCardProps {
  artist: ArtistDto;
}

/**
 * ArtistCard Component
 * 
 * Displays an artist profile card with image, name, and biography excerpt.
 * The entire card is clickable and links to the artist's detail page.
 * 
 * Features:
 * - Square profile picture with fallback icon for artists without images
 * - Displays artist name with proper truncation for long names
 * - Shows a two-line excerpt of the artist's biography (if available)
 * - Consistent glass-morphic styling with the application design system
 * - Subtle animation on hover for better user interaction feedback
 * - Neumorphic shadow effects for depth and visual appeal
 */
export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  return (
    <Link 
      to={`/artists/${artist.id}`}
      className="block bg-macchiato-surface0/60 backdrop-blur-glass rounded-lg overflow-hidden shadow-neumorphic-dark transition-all hover:shadow-neumorphic-light hover:translate-y-[-2px]"
    >
      {/* Artist profile image container - maintains square aspect ratio */}
      <div className="aspect-square relative">
        {artist.profilePicture ? (
          // If artist has a profile picture, display it
          <img 
            src={getImageUrl(artist.profilePicture)} 
            alt={artist.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          // Fallback icon when no profile picture is available
          <div className="w-full h-full flex items-center justify-center bg-macchiato-surface1">
            <FiUser size={48} className="text-macchiato-overlay0" />
          </div>
        )}
      </div>
      
      {/* Artist information section */}
      <div className="p-4">
        {/* Artist name with truncation for long names */}
        <h3 className="text-lg font-semibold text-macchiato-text truncate">
          {artist.name}
        </h3>
        
        {/* Biography excerpt - only shown if available */}
        {artist.biography && (
          <p className="text-sm text-macchiato-subtext0 mt-1 line-clamp-2">
            {artist.biography}
          </p>
        )}
      </div>
    </Link>
  );
};
