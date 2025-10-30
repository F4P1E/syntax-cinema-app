// TMDB API utilities
const TMDB_API_KEY = process.env.TMDB_API_KEY || ""
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
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

// Helper to get poster URL
export function getPosterUrl(path: string | null, size: "w185" | "w342" | "w500" | "original" = "w342"): string {
  if (!path) return "/abstract-movie-poster.png"
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

// Helper to get backdrop URL
export function getBackdropUrl(path: string | null, size: "w780" | "w1280" | "original" = "w1280"): string {
  if (!path) return "/movie-backdrop.png"
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

// Helper to get profile URL
export function getProfileUrl(path: string | null, size: "w185" | "h632" | "original" = "w185"): string {
  if (!path) return "/diverse-person-profiles.png"
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

// Search movies
export async function searchMovies(query: string, page = 1): Promise<TMDBResponse<Movie>> {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
  )
  if (!response.ok) throw new Error("Failed to search movies")
  return response.json()
}

// Get trending movies
export async function getTrendingMovies(timeWindow: "day" | "week" = "week", page = 1): Promise<TMDBResponse<Movie>> {
  const response = await fetch(`${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}&page=${page}`)
  if (!response.ok) throw new Error("Failed to fetch trending movies")
  return response.json()
}

// Get popular movies
export async function getPopularMovies(page = 1): Promise<TMDBResponse<Movie>> {
  const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`)
  if (!response.ok) throw new Error("Failed to fetch popular movies")
  return response.json()
}

// Get now playing movies
export async function getNowPlayingMovies(page = 1): Promise<TMDBResponse<Movie>> {
  const response = await fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}`)
  if (!response.ok) throw new Error("Failed to fetch now playing movies")
  return response.json()
}

// Get upcoming movies
export async function getUpcomingMovies(page = 1): Promise<TMDBResponse<Movie>> {
  const response = await fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`)
  if (!response.ok) throw new Error("Failed to fetch upcoming movies")
  return response.json()
}

// Get top rated movies
export async function getTopRatedMovies(page = 1): Promise<TMDBResponse<Movie>> {
  const response = await fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`)
  if (!response.ok) throw new Error("Failed to fetch top rated movies")
  return response.json()
}

// Get movie details
export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`)
  if (!response.ok) throw new Error("Failed to fetch movie details")
  return response.json()
}

// Get movies by genre
export async function getMoviesByGenre(genreId: number, page = 1): Promise<TMDBResponse<Movie>> {
  const response = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`,
  )
  if (!response.ok) throw new Error("Failed to fetch movies by genre")
  return response.json()
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
