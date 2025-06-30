import React, { useState } from 'react';
import { Search, Eye, EyeOff, Trash2, Calendar } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { useWatchlist } from '../contexts/WatchlistContext';
import { Link } from 'react-router-dom';

export const Watchlist: React.FC = () => {
  const { watchlist, removeFromWatchlist, markAsWatched, markAsUnwatched } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterBy, setFilterBy] = useState('all');

  const filteredWatchlist = watchlist
    .filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === 'all' || 
        (filterBy === 'watched' && movie.watched) ||
        (filterBy === 'unwatched' && !movie.watched);
      return matchesSearch && matchesFilter;
    })
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

  const handleRemoveFromWatchlist = (movieId: number) => {
    removeFromWatchlist(movieId);
  };

  const handleToggleWatched = (movieId: number, isWatched: boolean) => {
    if (isWatched) {
      markAsUnwatched(movieId);
    } else {
      markAsWatched(movieId);
    }
  };

  const watchedCount = watchlist.filter(movie => movie.watched).length;
  const unwatchedCount = watchlist.length - watchedCount;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">My Watchlist</h1>
          <div className="flex flex-wrap gap-4 text-gray-400">
            <span>{watchlist.length} total movies</span>
            <span>•</span>
            <span>{unwatchedCount} to watch</span>
            <span>•</span>
            <span>{watchedCount} watched</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your watchlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="all">All Movies</option>
              <option value="unwatched">To Watch</option>
              <option value="watched">Watched</option>
            </select>

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

        {/* Watchlist */}
        {filteredWatchlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWatchlist.map((movie) => (
              <div key={movie.id} className="relative group">
                <MovieCard movie={movie} />
                
                {/* Watched Overlay */}
                {movie.watched && (
                  <div className="absolute inset-0 bg-green-900/40 rounded-xl flex items-center justify-center">
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Watched
                    </div>
                  </div>
                )}
                
                {/* Action Overlay */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleToggleWatched(movie.id, movie.watched)}
                    className={`p-2 rounded-full text-white transition-colors ${
                      movie.watched 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    title={movie.watched ? 'Mark as unwatched' : 'Mark as watched'}
                  >
                    {movie.watched ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleRemoveFromWatchlist(movie.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                    title="Remove from watchlist"
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
            <Calendar className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {searchQuery || filterBy !== 'all' ? 'No matching movies found' : 'Your watchlist is empty'}
            </h2>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterBy !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start adding movies you want to watch later'
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