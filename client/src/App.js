import React from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate  } from 'react-router-dom';
import { ThemeContextProvider } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './components/profile';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider> {/* Add the AuthProvider */}
        <HistoryProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Navbar />
                    <HomePage />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Navbar />
                    <ProfilePage />
                  </PrivateRoute>
                } 
              />
              <Route
                path="/about"
                element={
                  <PrivateRoute>
                    <Navbar />
                    <AboutPage />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/history" 
                element={
                  <PrivateRoute>
                    <Navbar />
                    <HistoryPage />
                  </PrivateRoute>
                } 
              />
              {/* Add a catch-all route to redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </HistoryProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;