import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, Plus, Play, Calendar, Clock, Users, Loader2, DollarSign, Check } from 'lucide-react';
import { useMovieDetails } from '../hooks/useMovieDetails';
import { useMovieTrailers } from '../hooks/useMovieTrailers';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useAuth } from '../contexts/AuthContext';
import { TrailerModal } from '../components/TrailerModal';
import { tmdbService } from '../services/tmdb';
import { formatCurrency, formatRuntime, getRatingBgColor } from '../utils/movieHelpers';

export const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const movieId = parseInt(id || '0');
  const { movie, credits, loading, error } = useMovieDetails(movieId);
  const { trailers, loading: trailersLoading } = useMovieTrailers(movieId);
  const { isAuthenticated } = useAuth();
  const { 
    addToWatchlist, 
    removeFromWatchlist, 
    addToFavorites, 
    removeFromFavorites,
    isInWatchlist,
    isInFavorites 
  } = useWatchlist();
  
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedTrailerKey, setSelectedTrailerKey] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
        <span className="ml-2 text-gray-400">Loading movie details...</span>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Movie not found</h2>
          <p className="text-gray-400">{error || 'The requested movie could not be found.'}</p>
        </div>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isInFavorites(movie.id);
  const mainTrailer = trailers.find(trailer => trailer.type === 'Trailer') || trailers[0];

  const handleWatchlistToggle = () => {
    if (!isAuthenticated) return;
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleFavoritesToggle = () => {
    if (!isAuthenticated) return;
    
    if (inFavorites) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleWatchTrailer = () => {
    if (mainTrailer) {
      setSelectedTrailerKey(mainTrailer.key);
      setShowTrailer(true);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/40"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Poster */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-80 h-auto rounded-2xl shadow-2xl"
                  />
                  {mainTrailer && (
                    <button 
                      onClick={handleWatchTrailer}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Play className="h-16 w-16 text-white" />
                    </button>
                  )}
                </div>
              </div>

              {/* Movie Info */}
              <div>
                <h1 className="text-5xl font-bold text-white mb-4">{movie.title}</h1>
                
                {movie.tagline && (
                  <p className="text-xl text-gray-300 italic mb-4">"{movie.tagline}"</p>
                )}
                
                <div className="flex items-center space-x-6 mb-6">
                  <div className={`flex items-center space-x-2 ${getRatingBgColor(movie.rating)} text-white px-3 py-1 rounded-full font-bold`}>
                    <Star className="h-4 w-4 fill-current" />
                    <span>{movie.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span>{movie.year}</span>
                  </div>
                  {movie.runtime && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock className="h-4 w-4" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                </div>

                {movie.genres && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map((genre) => (
                      <span key={genre} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {movie.overview}
                </p>

                <div className="flex flex-wrap gap-4">
                  {mainTrailer && (
                    <button 
                      onClick={handleWatchTrailer}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all transform hover:scale-105"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Watch Trailer
                    </button>
                  )}
                  
                  {isAuthenticated && (
                    <>
                      <button 
                        onClick={handleFavoritesToggle}
                        className={`inline-flex items-center px-6 py-3 font-bold rounded-lg transition-colors ${
                          inFavorites 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600'
                        }`}
                      >
                        {inFavorites ? <Check className="h-5 w-5 mr-2" /> : <Heart className="h-5 w-5 mr-2" />}
                        {inFavorites ? 'In Favorites' : 'Add to Favorites'}
                      </button>
                      
                      <button 
                        onClick={handleWatchlistToggle}
                        className={`inline-flex items-center px-6 py-3 font-bold rounded-lg transition-colors ${
                          inWatchlist 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                        }`}
                      >
                        {inWatchlist ? <Check className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                        {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="py-16 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-6">Cast & Crew</h2>
              
              {movie.director && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Director</h3>
                  <p className="text-gray-300">{movie.director}</p>
                </div>
              )}

              {credits && credits.cast.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Main Cast</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {credits.cast.slice(0, 8).map((actor) => (
                      <div key={actor.id} className="text-center">
                        <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-2 overflow-hidden">
                          {actor.profilePath ? (
                            <img
                              src={tmdbService.getProfileUrl(actor.profilePath)}
                              alt={actor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Users className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm font-medium">{actor.name}</p>
                        <p className="text-gray-500 text-xs">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trailers Section */}
              {trailers.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Trailers & Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trailers.slice(0, 4).map((trailer) => (
                      <div 
                        key={trailer.id}
                        className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          setSelectedTrailerKey(trailer.key);
                          setShowTrailer(true);
                        }}
                      >
                        <div className="aspect-video bg-gray-900 flex items-center justify-center">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                        <div className="p-3">
                          <p className="text-white font-medium text-sm">{trailer.name}</p>
                          <p className="text-gray-400 text-xs">{trailer.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="bg-gray-900/50 rounded-2xl p-6 h-fit">
              <h3 className="text-xl font-semibold text-white mb-6">Movie Info</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-gray-400">Release Date:</span>
                  <span className="text-white ml-2">
                    {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                {movie.runtime && (
                  <div>
                    <span className="text-gray-400">Runtime:</span>
                    <span className="text-white ml-2">{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
                {movie.budget && movie.budget > 0 && (
                  <div>
                    <span className="text-gray-400">Budget:</span>
                    <span className="text-white ml-2">{formatCurrency(movie.budget)}</span>
                  </div>
                )}
                {movie.revenue && movie.revenue > 0 && (
                  <div>
                    <span className="text-gray-400">Revenue:</span>
                    <span className="text-white ml-2">{formatCurrency(movie.revenue)}</span>
                  </div>
                )}
                {movie.status && (
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white ml-2">{movie.status}</span>
                  </div>
                )}
                {movie.voteCount && (
                  <div>
                    <span className="text-gray-400">Vote Count:</span>
                    <span className="text-white ml-2">{movie.voteCount.toLocaleString()}</span>
                  </div>
                )}
                {movie.genres && movie.genres.length > 0 && (
                  <div>
                    <span className="text-gray-400">Genres:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <span key={genre} className="px-2 py-1 bg-gray-800 text-gray-300 text-sm rounded">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {movie.productionCompanies && movie.productionCompanies.length > 0 && (
                  <div>
                    <span className="text-gray-400">Production:</span>
                    <div className="mt-2">
                      {movie.productionCompanies.slice(0, 3).map((company, index) => (
                        <span key={index} className="text-white text-sm block">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerKey={selectedTrailerKey}
        movieTitle={movie.title}
      />
    </div>
  );
};