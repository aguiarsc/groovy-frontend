/**
 * Dynamic Playlist Cover Image Generator
 * 
 * This utility generates visually distinctive cover images for playlists when a custom
 * cover has not been uploaded. It creates a canvas-based image with:
 * - A background color gradient derived from the playlist ID (for uniqueness)
 * - The playlist's initials or first few characters as the central text
 * - The playlist name at the bottom
 * 
 * @param {string} name - The name of the playlist
 * @param {number | string} id - Optional playlist ID to create consistent, unique colors
 * @returns {string} Data URL of the generated image (PNG format)
 */
export const generatePlaylistCover = (name: string, id?: number | string): string => {
  if (typeof document === 'undefined') {
    return '';
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 300;
  canvas.height = 300;
  
  if (!ctx) {
    return '';
  }
  
  ctx.fillStyle = '#181825';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  
  if (id) {
    const idNum = typeof id === 'string' ? id.charCodeAt(0) : id;
    const hue1 = (idNum * 20) % 360;
    const hue2 = (hue1 + 40) % 360;
    
    gradient.addColorStop(0, `hsla(${hue1}, 70%, 80%, 0.2)`);
    gradient.addColorStop(1, `hsla(${hue2}, 70%, 70%, 0.2)`);
  } else {
    gradient.addColorStop(0, 'rgba(203, 166, 247, 0.2)');
    gradient.addColorStop(1, 'rgba(245, 194, 231, 0.2)');
  }
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const initials = name
    .split(' ')
    .slice(0, 3)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  const displayText = initials || name.substring(0, 2).toUpperCase();
  
  ctx.font = 'bold 120px sans-serif';
  ctx.fillStyle = '#cad3f5';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(displayText, canvas.width / 2, canvas.height / 2 - 30);
  
  const displayName = name.length > 20 ? name.substring(0, 20) + '...' : name;
  ctx.font = '24px sans-serif';
  ctx.fillStyle = '#cad3f5';
  ctx.textAlign = 'center';
  ctx.fillText(displayName, canvas.width / 2, canvas.height - 50);
  
  try {
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating playlist cover:', error);
    return '';
  }
};
