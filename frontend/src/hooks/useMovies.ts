
import { useState, useEffect } from 'react';
import { convertTMDBMovie } from '../utils/movieHelpers';
import { Movie, SearchFilters } from '../types/movie';

// Use your TMDB API key directly (temporarily)
const TMDB_API_KEY = 'c5412f263109bb6b188a95ef7c3f49b7';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

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

      let url: string;
      const params = new URLSearchParams();
      params.append('api_key', TMDB_API_KEY);
      params.append('page', (filters.page || 1).toString());

      if (filters.query) {
        // Search movies
        params.append('query', filters.query);
        url = `${TMDB_BASE_URL}/search/movie?${params.toString()}`;
      } else {
        // Discover/browse movies
        if (filters.genre) params.append('with_genres', filters.genre.toString());
        if (filters.year) params.append('year', filters.year.toString());
        if (filters.minRating) params.append('vote_average.gte', filters.minRating.toString());
        
        // Handle sorting
        if (filters.sortBy) {
          params.append('sort_by', filters.sortBy);
        } else {
          params.append('sort_by', 'popularity.desc');
        }
        
        url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
      }

      console.log('Fetching from TMDB:', url);
      
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`TMDB API Error: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('TMDB Response:', data);

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid TMDB response format');
      }

      const convertedMovies = data.results.map(convertTMDBMovie);
      setMovies(convertedMovies);
      setTotalPages(data.total_pages || 0);
      setCurrentPage(data.page || 1);

    } catch (err) {
      console.error('fetchMovies Error:', err);
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
      const nextPage = currentPage + 1;
      const updatedFilters = { ...filters, page: nextPage };
      // You can replace state here if supporting infinite scroll
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

// Update your other hooks too
export const useTrendingMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`TMDB API Error: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        const convertedMovies = data.results.map(convertTMDBMovie);
        setMovies(convertedMovies.slice(0, 8));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trending movies');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  return { movies, loading, error };
};

export const usePopularMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`TMDB API Error: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        const convertedMovies = data.results.map(convertTMDBMovie);
        setMovies(convertedMovies.slice(0, 8));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch popular movies');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  return { movies, loading, error };
};

