import React, { useState } from 'react';
import { Search, Heart, Trash2, Calendar } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { useWatchlist } from '../contexts/WatchlistContext';
import { Link } from 'react-router-dom';

export const Favorites: React.FC = () => {
  const { favorites, removeFromFavorites } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');

  const filteredFavorites = favorites
    .filter(movie => 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.year - a.year;
        case 'rating':
          return b.rating - a.rating;
        case 'dateAdded':
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

  const handleRemoveFromFavorites = (movieId: number) => {
    removeFromFavorites(movieId);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">My Favorites</h1>
          <p className="text-gray-400 text-lg">
            {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} in your favorites
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="dateAdded">Date Added</option>
              <option value="title">Title</option>
              <option value="year">Year</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Favorites */}
        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((movie) => (
              <div key={movie.id} className="relative group">
                <MovieCard movie={movie} />
                
                {/* Action Overlay */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleRemoveFromFavorites(movie.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Date Added */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs">
                    Added {new Date(movie.dateAdded).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {searchQuery ? 'No matching favorites found' : 'No favorites yet'}
            </h2>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Start adding movies to your favorites'
              }
            </p>
            <Link
              to="/movies"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-105"
            >
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};