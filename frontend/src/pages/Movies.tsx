import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Loader2 } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { useMovies } from '../hooks/useMovies';
import { useGenres } from '../hooks/useGenres';
import { SearchFilters } from '../types/movie';

export const Movies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const filters: SearchFilters = {
    query: searchQuery,
    genre: selectedGenre,
    year: selectedYear,
    sortBy,
    page: currentPage
  };

  const { movies, loading, error, totalPages } = useMovies(filters);
  const { genres } = useGenres();

  // Generate year options (current year back to 1900)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedGenre, selectedYear, sortBy]);

  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity (High to Low)' },
    { value: 'popularity.asc', label: 'Popularity (Low to High)' },
    { value: 'vote_average.desc', label: 'Rating (High to Low)' },
    { value: 'vote_average.asc', label: 'Rating (Low to High)' },
    { value: 'release_date.desc', label: 'Release Date (Newest)' },
    { value: 'release_date.asc', label: 'Release Date (Oldest)' },
    { value: 'title.asc', label: 'Title (A-Z)' },
    { value: 'title.desc', label: 'Title (Z-A)' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Discover Movies</h1>
          <p className="text-gray-400 text-lg">Find your next favorite movie from our vast collection</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-800">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            {/* Genre Filter */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id.toString()}>{genre.name}</option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="">All Years</option>
              {years.slice(0, 50).map((year) => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/50 border border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-200">Error: {error}</p>
          </div>
        )}

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-400">
            {loading ? 'Loading...' : `Showing ${movies.length} movies`}
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
            <span className="ml-2 text-gray-400">Loading movies...</span>
          </div>
        ) : (
          <>
            {/* Movies Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Previous
                </button>
                
                <span className="text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            )}

            {/* No Results */}
            {movies.length === 0 && !loading && (
              <div className="text-center py-12">
                <Filter className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">No movies found</h2>
                <p className="text-gray-400 mb-6">Try adjusting your search criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenre('');
                    setSelectedYear('');
                    setSortBy('popularity.desc');
                    setCurrentPage(1);
                  }}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};