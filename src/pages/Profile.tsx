import React from 'react';
import { User, Settings, Heart, Eye, Star, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWatchlist } from '../contexts/WatchlistContext';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { watchlist, favorites } = useWatchlist();

  if (!user) return null;

  const watchedMovies = watchlist.filter(movie => movie.watched);
  const unwatchedMovies = watchlist.filter(movie => !movie.watched);

  const recentActivity = [
    ...favorites.slice(0, 2).map(movie => ({
      id: `fav-${movie.id}`,
      type: 'favorited' as const,
      movie: movie.title,
      date: movie.dateAdded
    })),
    ...watchlist.slice(0, 2).map(movie => ({
      id: `watch-${movie.id}`,
      type: movie.watched ? 'watched' as const : 'watchlisted' as const,
      movie: movie.title,
      date: movie.dateAdded
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-800">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <User className="h-16 w-16 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-gray-400 mb-4">{user.email}</p>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-400 mb-6">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
                  <Settings className="h-5 w-5 mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 text-center">
            <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{watchedMovies.length}</div>
            <div className="text-gray-400 text-sm">Watched</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{favorites.length}</div>
            <div className="text-gray-400 text-sm">Favorites</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 text-center">
            <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{unwatchedMovies.length}</div>
            <div className="text-gray-400 text-sm">To Watch</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{watchlist.length}</div>
            <div className="text-gray-400 text-sm">Total</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === 'watched' && <Eye className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'favorited' && <Heart className="h-5 w-5 text-red-500" />}
                      {activity.type === 'watchlisted' && <Calendar className="h-5 w-5 text-green-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white">
                        {activity.type === 'watched' && 'Watched'}
                        {activity.type === 'favorited' && 'Added to favorites'}
                        {activity.type === 'watchlisted' && 'Added to watchlist'}
                        <span className="font-semibold"> {activity.movie}</span>
                      </p>
                      <p className="text-gray-400 text-sm">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No recent activity</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/favorites"
                className="w-full flex items-center space-x-3 p-4 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-left transition-colors"
              >
                <Heart className="h-5 w-5 text-purple-400" />
                <span className="text-white">View Favorites ({favorites.length})</span>
              </Link>
              <Link
                to="/watchlist"
                className="w-full flex items-center space-x-3 p-4 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-left transition-colors"
              >
                <Calendar className="h-5 w-5 text-blue-400" />
                <span className="text-white">Manage Watchlist ({watchlist.length})</span>
              </Link>
              <Link
                to="/movies"
                className="w-full flex items-center space-x-3 p-4 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-left transition-colors"
              >
                <Star className="h-5 w-5 text-green-400" />
                <span className="text-white">Discover Movies</span>
              </Link>
              <button className="w-full flex items-center space-x-3 p-4 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-lg text-left transition-colors">
                <Settings className="h-5 w-5 text-yellow-400" />
                <span className="text-white">Account Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};