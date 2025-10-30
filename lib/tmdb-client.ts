// Client-side utilities for TMDB (no API key needed)
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

export interface Movie {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
  adult: boolean
  original_language: string
  original_title: string
  video: boolean
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[]
  runtime: number
  status: string
  tagline: string
  budget: number
  revenue: number
  production_companies: { id: number; name: string; logo_path: string | null }[]
  credits?: {
    cast: CastMember[]
    crew: CrewMember[]
  }
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

// Helper to get poster URL (client-safe, no API key needed)
export function getPosterUrl(path: string | null, size: "w185" | "w342" | "w500" | "original" = "w342"): string {
  if (!path) return "/abstract-movie-poster.png"
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

// Helper to get backdrop URL (client-safe, no API key needed)
export function getBackdropUrl(path: string | null, size: "w780" | "w1280" | "original" = "w1280"): string {
  if (!path) return "/movie-backdrop.png"
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

// Helper to get profile URL (client-safe, no API key needed)
export function getProfileUrl(path: string | null, size: "w185" | "h632" | "original" = "w185"): string {
  if (!path) return "/diverse-person-profiles.png"
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

// Genre mapping
export const GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
} as const
