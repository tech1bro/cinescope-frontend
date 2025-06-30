import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Plus, Calendar, Check } from 'lucide-react';
import { Movie } from '../types/movie';
import { getRatingColor } from '../utils/movieHelpers';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useAuth } from '../contexts/AuthContext';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { isAuthenticated } = useAuth();
  const { 
    addToWatchlist, 
    removeFromWatchlist, 
    addToFavorites, 
    removeFromFavorites,
    isInWatchlist,
    isInFavorites 
  } = useWatchlist();

  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isInFavorites(movie.id);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) return;
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleFavoritesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) return;
    
    if (inFavorites) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Action Buttons */}
        {isAuthenticated && (
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={handleFavoritesClick}
              className={`p-2 backdrop-blur-sm rounded-full transition-colors ${
                inFavorites 
                  ? 'bg-red-600 text-white' 
                  : 'bg-black/60 text-white hover:bg-red-600'
              }`}
              title={inFavorites ? 'Remove from favorites' : 'Add to favorites'}
            >
              {inFavorites ? <Check className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
            </button>
            <button 
              onClick={handleWatchlistClick}
              className={`p-2 backdrop-blur-sm rounded-full transition-colors ${
                inWatchlist 
                  ? 'bg-green-600 text-white' 
                  : 'bg-black/60 text-white hover:bg-blue-600'
              }`}
              title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
          <Star className={`h-3 w-3 fill-current ${getRatingColor(movie.rating)}`} />
          <span className="text-white text-xs font-medium">{movie.rating}</span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <Link
          to={`/movie/${movie.id}`}
          className="block hover:text-purple-400 transition-colors"
        >
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
            {movie.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{movie.year || 'N/A'}</span>
          </div>
          {movie.voteCount && (
            <span className="text-xs">{movie.voteCount} votes</span>
          )}
        </div>

        {movie.genre && (
          <div className="flex flex-wrap gap-1">
            {movie.genre.split(', ').slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {movie.overview && (
          <p className="text-gray-400 text-sm mt-2 line-clamp-2">
            {movie.overview}
          </p>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};