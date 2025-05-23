/**
 * Core Type Definitions
 * 
 * This file contains the TypeScript interfaces and types that define the
 * data models used throughout the application. These types ensure consistency
 * between the frontend and backend data structures and provide type safety
 * and autocompletion for the development process.
 */

// ==================== Authentication Types ====================

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

// ==================== User Types ====================

export interface UserDto {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  createdAt?: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  ARTIST = 'ARTIST'
}

export interface ArtistDto extends UserDto {
  biography?: string;
  profilePicture?: string;
  createdAt?: string;
  albums?: AlbumDto[];
  songs?: SongDto[];
}

// ==================== Music Content Types ====================

export interface SongDto {
  id?: number;
  title: string;
  duration: number;
  filePath?: string;
  albumId?: number;
  albumName?: string;
  artistId?: number;
  artistName?: string;
  genre?: string;
  releaseDate?: string;
}

export interface AlbumDto {
  id?: number;
  name: string;
  title?: string;
  artistId: number;
  artistName?: string;
  coverImage?: string;
  releaseDate?: string;
  songs?: SongDto[];
}

export interface PlaylistDto {
  id?: number;
  name: string;
  userId: number;
  userName?: string;
  coverImage?: string;
  songs?: SongDto[];
}

// ==================== API Types ====================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
