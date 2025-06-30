import { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';

interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export const useMovieTrailers = (movieId: number) => {
  const [trailers, setTrailers] = useState<MovieVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdbService.getMovieVideos(movieId);
        
        // Filter for YouTube trailers and teasers
        const videoTrailers = response.results.filter((video: MovieVideo) => 
          video.site === 'YouTube' && 
          (video.type === 'Trailer' || video.type === 'Teaser')
        );
        
        setTrailers(videoTrailers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trailers');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchTrailers();
    }
  }, [movieId]);

  const getYouTubeUrl = (key: string) => `https://www.youtube.com/watch?v=${key}`;
  const getYouTubeEmbedUrl = (key: string) => `https://www.youtube.com/embed/${key}`;
  const getYouTubeThumbnail = (key: string) => `https://img.youtube.com/vi/${key}/maxresdefault.jpg`;

  return {
    trailers,
    loading,
    error,
    getYouTubeUrl,
    getYouTubeEmbedUrl,
    getYouTubeThumbnail
  };
};