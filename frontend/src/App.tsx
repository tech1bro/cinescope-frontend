import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { MovieDetails } from './pages/MovieDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import Profile from './pages/Profile';

import { Watchlist } from './pages/Watchlist';
import { Favorites } from './pages/Favorites';

function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/watchlist" 
                  element={
                    <ProtectedRoute>
                      <Watchlist />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/favorites" 
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
          </div>
        </Router>
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;