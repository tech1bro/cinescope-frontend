import { TMDBMovie, TMDBMovieDetails, tmdbService } from '../services/tmdb';
import { Movie, MovieDetails } from '../types/movie';

// Convert TMDB movie to our Movie interface
export const convertTMDBMovie = (tmdbMovie: TMDBMovie): Movie => {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    poster: tmdbService.getPosterUrl(tmdbMovie.poster_path),
    backdrop: tmdbService.getBackdropUrl(tmdbMovie.backdrop_path),
    rating: Math.round(tmdbMovie.vote_average * 10) / 10,
    year: new Date(tmdbMovie.release_date || '').getFullYear() || 0,
    genre: '', // Will be populated when we have genre mapping
    overview: tmdbMovie.overview,
    releaseDate: tmdbMovie.release_date,
    voteCount: tmdbMovie.vote_count,
    popularity: tmdbMovie.popularity
  };
};

// Convert TMDB movie details to our MovieDetails interface
export const convertTMDBMovieDetails = (tmdbDetails: TMDBMovieDetails): MovieDetails => {
  return {
    id: tmdbDetails.id,
    title: tmdbDetails.title,
    poster: tmdbService.getPosterUrl(tmdbDetails.poster_path),
    backdrop: tmdbService.getBackdropUrl(tmdbDetails.backdrop_path),
    rating: Math.round(tmdbDetails.vote_average * 10) / 10,
    year: new Date(tmdbDetails.release_date || '').getFullYear() || 0,
    genre: tmdbDetails.genres.map(g => g.name).join(', '),
    genres: tmdbDetails.genres.map(g => g.name),
    overview: tmdbDetails.overview,
    runtime: tmdbDetails.runtime,
    budget: tmdbDetails.budget,
    revenue: tmdbDetails.revenue,
    tagline: tmdbDetails.tagline,
    status: tmdbDetails.status,
    homepage: tmdbDetails.homepage,
    imdbId: tmdbDetails.imdb_id,
    releaseDate: tmdbDetails.release_date,
    voteCount: tmdbDetails.vote_count,
    popularity: tmdbDetails.popularity,
    productionCompanies: tmdbDetails.production_companies.map(c => c.name),
    productionCountries: tmdbDetails.production_countries.map(c => c.name),
    spokenLanguages: tmdbDetails.spoken_languages.map(l => l.english_name)
  };
};

// Format currency
export const formatCurrency = (amount: number): string => {
  if (amount === 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format runtime
export const formatRuntime = (minutes: number): string => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Get year from date string
export const getYearFromDate = (dateString: string): number => {
  return new Date(dateString).getFullYear();
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Get rating color
export const getRatingColor = (rating: number): string => {
  if (rating >= 8) return 'text-green-500';
  if (rating >= 7) return 'text-yellow-500';
  if (rating >= 6) return 'text-orange-500';
  return 'text-red-500';
};

// Get rating background color
export const getRatingBgColor = (rating: number): string => {
  if (rating >= 8) return 'bg-green-500';
  if (rating >= 7) return 'bg-yellow-500';
  if (rating >= 6) return 'bg-orange-500';
  return 'bg-red-500';
};