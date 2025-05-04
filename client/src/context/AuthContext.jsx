import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../config/apiClient';
import { isValidTokenFormat } from '../utils/authUtils';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Function to check if user is authenticated
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    
    if (!token || !isValidTokenFormat(token)) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsLoading(false);
      if (token && !isValidTokenFormat(token)) {
        localStorage.removeItem('token');
      }
      return;
    }

    try {
      // Get current user data
      const response = await apiClient.get('/api/auth/user');
      setCurrentUser(response.data);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      console.error('Auth validation error:', error);
      setAuthError(error);
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token'); // Clear invalid token
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      
      if (response.data.token && isValidTokenFormat(response.data.token)) {
        localStorage.setItem('token', response.data.token);
        await checkAuthStatus(); // Refresh user data
        return { success: true };
      } else {
        throw new Error('Invalid token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error);
      setIsAuthenticated(false);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const response = await apiClient.post('/api/auth/signup', userData);
      
      if (response.data.token && isValidTokenFormat(response.data.token)) {
        localStorage.setItem('token', response.data.token);
        await checkAuthStatus(); // Refresh user data
        return { success: true };
      } else {
        // If the signup was successful but no token was returned
        if (response.status === 201) {
          return { success: true, requiresLogin: true };
        }
        throw new Error('Invalid token received from server');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setAuthError(error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Check auth status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // The value that will be provided to consumers of this context
  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    authError,
    login,
    signup,
    logout,
    checkAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};