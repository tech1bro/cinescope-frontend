import { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';
import { Genre } from '../types/movie';

export const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const response = await tmdbService.getGenres();
        setGenres(response.genres);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch genres');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { genres, loading, error };
};