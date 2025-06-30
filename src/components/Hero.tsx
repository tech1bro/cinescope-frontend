import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Calendar, Loader2 } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { convertTMDBMovie } from '../utils/movieHelpers';
import { Movie } from '../types/movie';

export const Hero: React.FC = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        // Get a popular movie for the hero section
        const response = await tmdbService.getPopularMovies();
        if (response.results.length > 0) {
          const movie = convertTMDBMovie(response.results[0]);
          setFeaturedMovie(movie);
        }
      } catch (error) {
        console.error('Failed to fetch featured movie:', error);
        // Fallback to a default movie if API fails
        setFeaturedMovie({
          id: 27205,
          title: "Inception",
          poster: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500",
          backdrop: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920",
          rating: 8.8,
          year: 2010,
          genre: "Action, Sci-Fi, Thriller",
          overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovie();
  }, []);

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-950">
        <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
        <span className="ml-2 text-gray-400">Loading...</span>
      </section>
    );
  }

  const backgroundImage = featuredMovie?.backdrop || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920';

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/70 to-gray-950/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Your Next
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {' '}Favorite Movie
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Explore millions of movies, get personalized recommendations, and build your ultimate watchlist.
          </p>
          
          {/* Featured Movie Info */}
          {featuredMovie && (
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-800">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                  Featured
                </span>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{featuredMovie.rating}</span>
                  <Calendar className="h-4 w-4" />
                  <span>{featuredMovie.year}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{featuredMovie.title}</h3>
              <p className="text-gray-300 mb-4">
                {featuredMovie.overview}
              </p>
              {featuredMovie.genre && (
                <div className="flex flex-wrap gap-2">
                  {featuredMovie.genre.split(', ').map((genre) => (
                    <span key={genre} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/movies"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-2xl"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Exploring
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-purple-600/20 rounded-full blur-xl animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-40 left-20 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl animate-pulse hidden lg:block"></div>
    </section>
  );
};