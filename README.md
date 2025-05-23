# Groovy Music Streaming Frontend

<div align="center">
  <h3>🎵 Modern React-based UI for the Groovy Music Streaming Platform 🎵</h3>
</div>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#application-structure">Structure</a> •
  <a href="#key-components">Components</a> •
  <a href="#state-management">State Management</a> •
  <a href="#api-integration">API Integration</a> •
  <a href="#styling">Styling</a> •
  <a href="#performance">Performance</a> •
  <a href="#best-practices">Best Practices</a> •
</p>

---

## Overview

The Groovy Frontend is a modern, reactive user interface built with React and TypeScript. It provides an intuitive and engaging experience for music streaming, leveraging modern web technologies and design principles. The application connects to the Groovy Backend API to deliver a seamless music streaming experience.

### Core Capabilities

- **Interactive Music Player**: Feature-rich audio player with queue management
- **User Authentication**: Secure login, registration, and profile management
- **Content Discovery**: Browse and search functionality for music content
- **Playlist Management**: Create, edit, and share personal playlists
- **Artist Profiles**: Detailed artist information and discography
- **Responsive Design**: Optimized for various screen sizes and devices
- **Theme Support**: Aesthetic "macchiato" color theme and consistent styling

---

## Features

### User Features

#### Authentication and Profile
- User registration and login
- Password-protected accounts
- Profile customization
- Role-based interface (User/Artist/Admin)

#### Music Playback
- High-quality audio streaming
- Play, pause, skip, and volume controls
- Seeking
- Queue management
- Fullscreen immersive player

#### Content Management
- Favorites system for quick access to loved songs
- Playlist creation and management
- Music library organization

#### Discovery
- Browse featured content
- Search by artist, song, or album
- Filter and sort options

### Artist Features

- Artist dashboard for content management
- Music upload interface
- Statistics and analytics
- Profile customization

### Admin Features

- User management interface
- Content moderation tools
- System monitoring dashboard

---

## Tech Stack

### Core Technologies
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **React Router 6**: Declarative routing
- **Zustand**: State management
- **Vite**: Build tool and development server

### UI Component Libraries
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Icon library
- **Custom UI Components**: Hand-crafted reusable components

### Data Management
- **TanStack Query (React Query)**: Server state management
- **Axios**: HTTP client
- **Zustand**: Client state management

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Vite**: Fast HMR development

---

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher
- A running instance of the Groovy Backend

## Application Structure

The frontend follows a feature-based organization structure:

```
src/
├── assets/              # Static assets (images, fonts)
├── components/          # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components
│   ├── music/           # Music-related components
│   └── ui/              # Generic UI components
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API service integrations
├── store/               # Zustand state stores
├── styles/              # Global styles and theme
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

### Key Directories

#### Components
Reusable UI components organized by feature domain. Each component follows these principles:
- Single responsibility
- Comprehensive documentation
- Proper prop typing
- Consistent styling

#### Pages
Full page components that compose multiple components. They:
- Handle routing parameters
- Coordinate data fetching
- Manage page-specific state
- Connect to global state

#### Services
API integration layer that:
- Abstracts backend communication
- Handles authentication
- Formats requests and responses
- Manages error handling

#### Store
State management using Zustand:
- Authentication state
- Player state
- UI preferences

---

## Key Components

### Authentication Components

#### `LoginForm`
- Credential validation
- Error handling
- Redirection after successful login

#### `RegisterForm`
- New user registration
- Field validation
- Role selection

#### `ProtectedRoute`
- Role-based route protection
- Authentication verification
- Redirect handling

### Music Components

#### `MusicPlayer`
Central component for audio playback with:
- Transport controls (play/pause, next/previous)
- Progress tracking and seeking
- Volume control
- Queue management
- Visualization

#### `SongCard`
Displays song information with:
- Play button
- Add to playlist functionality
- Favorite toggle
- Context menu

#### `AlbumCard` and `ArtistCard`
Visual representations with:
- Cover/profile images
- Basic information
- Navigation to detail views

#### `PlaylistCard`
Interactive playlist display with:
- Cover generation from songs
- Play button
- Song count
- Edit capabilities

### UI Components

#### `Button`
Versatile button component with:
- Multiple variants (primary, secondary, danger, ghost)
- Size options
- Loading state
- Icon support

#### `Input`
Form input component with:
- Validation states
- Label integration
- Error message display
- Icon support

#### `Slider`
Interactive range slider used for:
- Volume control
- Progress seeking
- General range selection

#### `Card`
Container component with consistent styling for:
- Content grouping
- Visual hierarchy
- Hover effects

---

## State Management

Groovy uses Zustand for state management, providing a simple yet powerful solution that avoids the complexity of Redux while maintaining high performance.

### Authentication State

`authStore.ts` manages:
- Current user information
- Authentication status
- Login/logout functionality
- Token management

```typescript
// Usage example
const { user, isAuthenticated, login, logout } = useAuthStore();
```

### Player State

`playerStore.ts` controls:
- Current song
- Playback status
- Queue management
- Volume and progress
- UI state (fullscreen, minimized)

```typescript
// Usage example
const { 
  currentSong,
  isPlaying,
  playSong,
  togglePlay,
  addToQueue
} = usePlayerStore();
```

### Component-Level State

For localized state needs, React's `useState` and `useReducer` are used within components.

```typescript
// Example of local component state
const [isExpanded, setIsExpanded] = useState(false);
```

---

## API Integration

### Service Layer

The application uses a service-based approach to API communication:

```
services/
├── api.ts             # Core API configuration
├── auth.service.ts    # Authentication endpoints
├── song.service.ts    # Song management
├── album.service.ts   # Album operations
├── artist.service.ts  # Artist-related endpoints
├── playlist.service.ts # Playlist management
├── favorite.service.ts # Favorites functionality
└── user.service.ts    # User profile operations
```

### Core API Configuration

`api.ts` provides a configured Axios instance with:
- Base URL configuration
- Authentication interceptors
- Error handling
- Response formatting

```typescript
// Example of API configuration
const api = axios.create({
  baseURL: 'https://.../api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Data Fetching with React Query

TanStack Query (React Query) is used for data fetching, providing:
- Caching
- Background refetching
- Loading/error states
- Pagination support

```typescript
// Example of React Query usage
const { data: songs, isLoading, error } = useQuery(
  ['songs'], 
  songService.getAllSongs
);
```

---

## Styling

### Tailwind CSS

The frontend uses Tailwind CSS for utility-based styling:
- Consistent design language
- Responsive design utilities
- Dark mode support
- Custom theme configuration

### Theme Configuration

The application implements a custom "macchiato" theme with:
- Rich color palette
- Consistent spacing
- Typography system
- Component-specific styling

### Neumorphic Design Elements

Custom styling includes neumorphic elements:
- Subtle shadows
- Soft UI elements
- Tactile interactive components

### Global Styles

Global styling includes:
- CSS reset/normalization
- Base typography
- Animation definitions
- Utility classes

---

## Performance Optimization

### Component Optimization

- Memoization with `React.memo`, `useMemo`, and `useCallback`
- Virtualization for long lists
- Lazy loading for components
- Code splitting by route

### Asset Optimization

- Image optimization and appropriate formats
- Font loading strategy
- Preloading of critical resources
- Lazy loading of non-critical assets

---

## Code Documentation and Standards

### TypeScript Type Safety

The codebase utilizes TypeScript for type safety:
- Comprehensive interface definitions
- Strict null checks
- Type guards for runtime safety
- Generic types for reusable components

### Component Documentation

Components follow a consistent documentation pattern:
- JSDoc for components and functions
- Purpose explanation

### Consistent Naming

The project follows naming conventions:
- PascalCase for components
- camelCase for variables and functions
- UPPER_CASE for constants
- kebab-case for CSS classes and files

---

## Best Practices

### Accessibility

The application implements accessibility best practices:
- Semantic HTML structure
- ARIA attributes where needed
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly content

### Responsive Design

UI components adapt to different screen sizes:
- Mobile-first approach
- Responsive breakpoints
- Flexible layouts
- Touch-friendly interactions

### Error Handling

Robust error management strategies:
- User-friendly error messages
- Fallback UI components
- API error handling
- Form validation feedback

### Security Considerations

Frontend security measures:
- XSS prevention
- CSRF protection
- Secure authentication storage
- Input sanitization
- Proper HTTP security headers

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>🎵 Developed as a final grade project for DAW course 🎵</p>
</div>
