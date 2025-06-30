import { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';
import { convertTMDBMovieDetails } from '../utils/movieHelpers';
import { MovieDetails, MovieCredits } from '../types/movie';

export const useMovieDetails = (movieId: number) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch movie details and credits in parallel
        const [movieDetails, movieCredits] = await Promise.all([
          tmdbService.getMovieDetails(movieId),
          tmdbService.getMovieCredits(movieId)
        ]);

        const convertedMovie = convertTMDBMovieDetails(movieDetails);
        
        // Add director from crew
        const director = movieCredits.crew.find(person => person.job === 'Director');
        if (director) {
          convertedMovie.director = director.name;
        }

        // Add main cast
        convertedMovie.cast = movieCredits.cast.slice(0, 10).map(person => person.name);

        setMovie(convertedMovie);
        setCredits({
          cast: movieCredits.cast.map(person => ({
            id: person.id,
            name: person.name,
            character: person.character,
            profilePath: person.profile_path,
            order: person.order
          })),
          crew: movieCredits.crew.map(person => ({
            id: person.id,
            name: person.name,
            job: person.job,
            department: person.department,
            profilePath: person.profile_path
          }))
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  return { movie, credits, loading, error };
};