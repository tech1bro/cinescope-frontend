import { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';
import { convertTMDBMovie } from '../utils/movieHelpers';
import { Movie, SearchFilters } from '../types/movie';

export const useMovies = (filters: SearchFilters = {}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (filters.query) {
        // Search movies
        response = await tmdbService.searchMovies(filters.query, filters.page || 1);
      } else {
        // Discover movies with filters
        response = await tmdbService.discoverMovies({
          page: filters.page || 1,
          genre: filters.genre,
          year: filters.year,
          sortBy: filters.sortBy,
          minRating: filters.minRating
        });
      }

      const convertedMovies = response.results.map(convertTMDBMovie);
      setMovies(convertedMovies);
      setTotalPages(response.total_pages);
      setCurrentPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [filters.query, filters.genre, filters.year, filters.sortBy, filters.minRating, filters.page]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      const newFilters = { ...filters, page: currentPage + 1 };
      // This would typically append to existing movies for infinite scroll
      // For now, we'll just update the page
    }
  };

  return {
    movies,
    loading,
    error,
    totalPages,
    currentPage,
    loadMore,
    refetch: fetchMovies
  };
};

export const useTrendingMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const response = await tmdbService.getTrendingMovies('week');
        const convertedMovies = response.results.slice(0, 8).map(convertTMDBMovie);
        setMovies(convertedMovies);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trending movies');
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return { movies, loading, error };
};

export const usePopularMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        const response = await tmdbService.getPopularMovies();
        const convertedMovies = response.results.slice(0, 8).map(convertTMDBMovie);
        setMovies(convertedMovies);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch popular movies');
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  return { movies, loading, error };
};