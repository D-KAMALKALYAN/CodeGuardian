import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create the context
export const ThemeContext = createContext();

// Create the provider component
export const ThemeContextProvider = ({ children }) => {
  // Check if dark mode was previously set in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Update localStorage when darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Create a theme based on the current mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#8B5CF6' : '#6366F1', // Purple/Indigo tones
      },
      secondary: {
        main: darkMode ? '#EC4899' : '#F472B6', // Pink tones
      },
      background: {
        default: darkMode ? '#111827' : '#F9FAFB',
        paper: darkMode ? '#1F2937' : '#FFFFFF',
      },
      // Additional accent colors
      error: {
        main: darkMode ? '#EF4444' : '#DC2626',
      },
      warning: {
        main: darkMode ? '#F59E0B' : '#D97706',
      },
      info: {
        main: darkMode ? '#3B82F6' : '#2563EB',
      },
      success: {
        main: darkMode ? '#10B981' : '#059669',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: darkMode 
              ? 'linear-gradient(90deg, #111827 0%, #4F46E5 100%)' 
              : 'linear-gradient(90deg, #6366F1 0%, #2563EB 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
    typography: {
      fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      h6: {
        fontWeight: 600,
        letterSpacing: 0.5,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};