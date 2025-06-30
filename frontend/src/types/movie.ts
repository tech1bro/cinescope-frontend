export interface Movie {
  id: number;
  title: string;
  poster: string;
  backdrop?: string;
  rating: number;
  year: number;
  genre: string;
  overview?: string;
  runtime?: number;
  director?: string;
  cast?: string[];
  budget?: number;
  revenue?: number;
  genres?: string[];
  releaseDate?: string;
  voteCount?: number;
  popularity?: number;
}

export interface MovieDetails extends Movie {
  tagline?: string;
  status?: string;
  homepage?: string;
  imdbId?: string;
  productionCompanies?: string[];
  productionCountries?: string[];
  spokenLanguages?: string[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profilePath: string | null;
}

export interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface SearchFilters {
  query?: string;
  genre?: string;
  year?: string;
  sortBy?: string;
  minRating?: number;
  page?: number;
}