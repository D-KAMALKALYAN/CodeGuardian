import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeContextProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ScanPage from './pages/ScanPage';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeContextProvider>
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
            path="/about"
            element={
              <PrivateRoute>
                <Navbar />
                <AboutPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/scan"
            element={
              <PrivateRoute>
                <Navbar />
                <ScanPage />
              </PrivateRoute>
            }
          />

          <Route path="/history" element={
                <PrivateRoute>
                  <HistoryPage />
                </PrivateRoute>
          } />

        </Routes>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;