/**
 * Global API Client
 * 
 * A centralized API client with proper error handling,
 * authentication, and logging capabilities.
 */

import axios from 'axios';
import API_BASE_URL from './apiConfig'; // Adjust path as needed

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - adds auth token and handles request preparation
apiClient.interceptors.request.use(
  (config) => {
    // Get auth token
    const token = localStorage.getItem('token');
    
    // Only add token if it exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles common errors and responses
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    }
    
    return response;
  },
  (error) => {
    // Extract error details
    const errorResponse = {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    };
    
    // Special handling for common errors
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401: // Unauthorized - token expired or invalid
          console.error('[API] Authentication error - invalid or expired token');
          
          // Clear invalid token
          localStorage.removeItem('token');
          
          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            // Store the current path to redirect back after login
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            window.location.href = '/login';
          }
          break;
          
        case 403: // Forbidden - permissions issue
          console.error('[API] Permission denied');
          break;
          
        case 404: // Not found
          console.error(`[API] Resource not found: ${errorResponse.url}`);
          break;
          
        case 500: // Server error
        case 502: // Bad gateway
        case 503: // Service unavailable
        case 504: // Gateway timeout
          console.error(`[API] Server error (${error.response.status}): ${error.response.data?.message || 'Unknown server error'}`);
          break;
          
        default:
          console.error(`[API] Error ${error.response.status}:`, error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error('[API] Network error - no response received');
      
      // Check if server is unreachable
      if (error.message === 'Network Error') {
        // Could show a "server unreachable" UI notification here
      }
    } else {
      // Error in setting up the request
      console.error('[API] Error in request setup:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Helper method to check if the error is a network error
 * @param {Error} error - The error from an API call
 * @returns {boolean} True if it's a network error
 */
export const isNetworkError = (error) => {
  return error.message === 'Network Error' || !error.response;
};

/**
 * Helper method to check if the error is an auth error
 * @param {Error} error - The error from an API call
 * @returns {boolean} True if it's an auth error (401)
 */
export const isAuthError = (error) => {
  return error.response?.status === 401;
};

/**
 * Helper method to get a user-friendly error message
 * @param {Error} error - The error from an API call
 * @returns {string} A user-friendly error message
 */
export const getErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return 'Network error. Please check your connection or try again later.';
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  switch (error.response?.status) {
    case 401:
      return 'Authentication required. Please login again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export default apiClient;