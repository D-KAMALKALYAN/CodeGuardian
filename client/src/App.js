import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeContextProvider } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext'; // Import the provider
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './components/profile'; // Import the ProfilePage
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeContextProvider>
      <HistoryProvider> {/* Add the HistoryProvider */}
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

            <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />

            <Route
              path="/about"
              element={
                <PrivateRoute>
                  <Navbar />
                  <AboutPage />
                </PrivateRoute>
              }
            />
            <Route path="/history" element={
                  <PrivateRoute>
                    <Navbar /> {/* You might want to add this */}
                    <HistoryPage />
                  </PrivateRoute>
            } />
          </Routes>
        </Router>
      </HistoryProvider>
    </ThemeContextProvider>
  );
}

export default App;