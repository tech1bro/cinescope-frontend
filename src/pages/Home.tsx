import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, TrendingUp, Calendar, Users, Loader2 } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { Hero } from '../components/Hero';
import { useTrendingMovies, usePopularMovies } from '../hooks/useMovies';

export const Home: React.FC = () => {
  const { movies: trendingMovies, loading: trendingLoading } = useTrendingMovies();
  const { movies: popularMovies, loading: popularLoading } = usePopularMovies();

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Stats Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-4">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-gray-400">Movies</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">100K+</div>
              <div className="text-gray-400">Users</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg mx-auto mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">1M+</div>
              <div className="text-gray-400">Reviews</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-600 rounded-lg mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-gray-400">Updated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Movies */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Trending Now</h2>
              <p className="text-gray-400">Most popular movies this week</p>
            </div>
            <Link
              to="/movies"
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              View All
            </Link>
          </div>
          
          {trendingLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
              <span className="ml-2 text-gray-400">Loading trending movies...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Movies */}
      <section className="py-16 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Popular Movies</h2>
              <p className="text-gray-400">All-time favorites</p>
            </div>
            <Link
              to="/movies"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Explore More
            </Link>
          </div>
          
          {popularLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-400">Loading popular movies...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Discover Your Next Favorite Movie?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of movie lovers and get personalized recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/movies"
              className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-gray-600 hover:border-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};