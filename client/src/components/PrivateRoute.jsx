import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import apiClient from '../config/apiClient';
import { Box, CircularProgress, Typography } from '@mui/material';
import { isValidTokenFormat } from '../utils/authUtils';

function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
    
      // Check for obvious token format issues
      if (!isValidTokenFormat(token)) {
        console.error('Invalid token format detected');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
    
      try {
        // Try to access a protected endpoint to validate the token
        await apiClient.get('/api/auth/user');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token validation failed:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  if (isLoading) {
    // Show a loading spinner while validating authentication
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #111, #1a1a2e)'
              : 'radial-gradient(circle, #f5f7fa, #e4e8f0)',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifying session...
        </Typography>
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;