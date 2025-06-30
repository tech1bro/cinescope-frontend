const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const API_KEY = 'c5412f263109bb6b188a95ef7c3f49b7';

// TMDB API interfaces
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string;
}

export interface TMDBCredits {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBSearchResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

// API service class
class TMDBService {
  private apiKey = API_KEY;
  private baseUrl = TMDB_BASE_URL;

  private async fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('api_key', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get popular movies
  async getPopularMovies(page: number = 1): Promise<TMDBSearchResponse> {
    return this.fetchFromTMDB<TMDBSearchResponse>('/movie/popular', {
      page: page.toString()
    });
  }

  // Get trending movies
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBSearchResponse> {
    return this.fetchFromTMDB<TMDBSearchResponse>(`/trending/movie/${timeWindow}`);
  }

  // Get top rated movies
  async getTopRatedMovies(page: number = 1): Promise<TMDBSearchResponse> {
    return this.fetchFromTMDB<TMDBSearchResponse>('/movie/top_rated', {
      page: page.toString()
    });
  }

  // Get now playing movies
  async getNowPlayingMovies(page: number = 1): Promise<TMDBSearchResponse> {
    return this.fetchFromTMDB<TMDBSearchResponse>('/movie/now_playing', {
      page: page.toString()
    });
  }

  // Search movies
  async searchMovies(query: string, page: number = 1): Promise<TMDBSearchResponse> {
    return this.fetchFromTMDB<TMDBSearchResponse>('/search/movie', {
      query,
      page: page.toString()
    });
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    return this.fetchFromTMDB<TMDBMovieDetails>(`/movie/${movieId}`);
  }

  // Get movie credits
  async getMovieCredits(movieId: number): Promise<TMDBCredits> {
    return this.fetchFromTMDB<TMDBCredits>(`/movie/${movieId}/credits`);
  }

  // Get movie videos (trailers, etc.)
  async getMovieVideos(movieId: number) {
    return this.fetchFromTMDB(`/movie/${movieId}/videos`);
  }

  // Get similar movies
  async getSimilarMovies(movieId: number, page: number = 1): Promise<TMDBSearchResponse> {
    return this.fetchFromTMDB<TMDBSearchResponse>(`/movie/${movieId}/similar`, {
      page: page.toString()
    });
  }

  // Get movie recommendations
  async getMovieRecommendations(movieId: number, page: number = 1): Promise<TMDBSearchResponse> {
    return this.fetchFromTMDB<TMDBSearchResponse>(`/movie/${movieId}/recommendations`, {
      page: page.toString()
    });
  }

  // Get genres
  async getGenres(): Promise<{ genres: TMDBGenre[] }> {
    return this.fetchFromTMDB<{ genres: TMDBGenre[] }>('/genre/movie/list');
  }

  // Discover movies with filters
  async discoverMovies(params: {
    page?: number;
    genre?: string;
    year?: string;
    sortBy?: string;
    minRating?: number;
  } = {}): Promise<TMDBSearchResponse> {
    const queryParams: Record<string, string> = {
      page: (params.page || 1).toString(),
      sort_by: params.sortBy || 'popularity.desc'
    };

    if (params.genre) queryParams.with_genres = params.genre;
    if (params.year) queryParams.year = params.year;
    if (params.minRating) queryParams['vote_average.gte'] = params.minRating.toString();

    return this.fetchFromTMDB<TMDBSearchResponse>('/discover/movie', queryParams);
  }

  // Helper methods for image URLs
  getPosterUrl(posterPath: string | null, size: 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!posterPath) return '/placeholder-poster.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
  }

  getBackdropUrl(backdropPath: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!backdropPath) return '/placeholder-backdrop.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
  }

  getProfileUrl(profilePath: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'): string {
    if (!profilePath) return '/placeholder-profile.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${profilePath}`;
  }
}

export const tmdbService = new TMDBService();