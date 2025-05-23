import config from '../config';

/**
 * Formats song duration from seconds to MM:SS format
 * 
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string in MM:SS format
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Formats date strings to localized format
 * 
 * Converts ISO date strings to the user's locale format for a consistent
 * and culturally appropriate date display across the application.
 * 
 * @param {string} dateString - ISO date string to format
 * @returns {string} Formatted date string according to the user's locale
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

/**
 * Truncates text with ellipsis if it exceeds the maximum length
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Constructs the full URL for an image from the backend
 * 
 * This utility centralizes the logic for building image URLs, making it easier
 * to change the base URL during development or deployment. It also handles
 * cases where the filename is already a complete URL.
 * 
 * @param {string} filename - Image filename or full URL
 * @returns {string} Complete URL to the image resource
 */
export const getImageUrl = (filename: string): string => {
  if (!filename) return '';
  
  if (filename.startsWith('http')) {
    return filename;
  }
  
  return `${config.API_BASE_URL}/api/files/${filename}`;
};
