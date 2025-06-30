import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { useAuth } from './AuthContext';

interface WatchlistItem extends Movie {
  dateAdded: string;
  watched: boolean;
}

interface FavoriteItem extends Movie {
  dateAdded: string;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  favorites: FavoriteItem[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  markAsWatched: (movieId: number) => void;
  markAsUnwatched: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
  isInFavorites: (movieId: number) => boolean;
  isWatched: (movieId: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load user's watchlist and favorites from localStorage
  useEffect(() => {
    if (user) {
      const savedWatchlist = localStorage.getItem(`cinescope_watchlist_${user.id}`);
      const savedFavorites = localStorage.getItem(`cinescope_favorites_${user.id}`);
      
      if (savedWatchlist) {
        try {
          setWatchlist(JSON.parse(savedWatchlist));
        } catch (error) {
          console.error('Error parsing watchlist:', error);
        }
      }
      
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
          console.error('Error parsing favorites:', error);
        }
      }
    } else {
      // Clear data when user logs out
      setWatchlist([]);
      setFavorites([]);
    }
  }, [user]);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cinescope_watchlist_${user.id}`, JSON.stringify(watchlist));
    }
  }, [watchlist, user]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cinescope_favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const addToWatchlist = (movie: Movie) => {
    if (!user) return;
    
    const watchlistItem: WatchlistItem = {
      ...movie,
      dateAdded: new Date().toISOString(),
      watched: false
    };
    
    setWatchlist(prev => {
      const exists = prev.find(item => item.id === movie.id);
      if (exists) return prev;
      return [...prev, watchlistItem];
    });
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist(prev => prev.filter(item => item.id !== movieId));
  };

  const addToFavorites = (movie: Movie) => {
    if (!user) return;
    
    const favoriteItem: FavoriteItem = {
      ...movie,
      dateAdded: new Date().toISOString()
    };
    
    setFavorites(prev => {
      const exists = prev.find(item => item.id === movie.id);
      if (exists) return prev;
      return [...prev, favoriteItem];
    });
  };

  const removeFromFavorites = (movieId: number) => {
    setFavorites(prev => prev.filter(item => item.id !== movieId));
  };

  const markAsWatched = (movieId: number) => {
    setWatchlist(prev => 
      prev.map(item => 
        item.id === movieId ? { ...item, watched: true } : item
      )
    );
  };

  const markAsUnwatched = (movieId: number) => {
    setWatchlist(prev => 
      prev.map(item => 
        item.id === movieId ? { ...item, watched: false } : item
      )
    );
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some(item => item.id === movieId);
  };

  const isInFavorites = (movieId: number) => {
    return favorites.some(item => item.id === movieId);
  };

  const isWatched = (movieId: number) => {
    const item = watchlist.find(item => item.id === movieId);
    return item?.watched || false;
  };

  const value = {
    watchlist,
    favorites,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    markAsWatched,
    markAsUnwatched,
    isInWatchlist,
    isInFavorites,
    isWatched
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};