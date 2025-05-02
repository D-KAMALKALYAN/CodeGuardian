import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig'; // Adjust the import path as needed

// Create an axios instance with the base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to attach auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration (401 errors)
    if (error.response && error.response.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      
      // Redirect to login page if needed
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Network errors
    if (error.message === 'Network Error') {
      console.error('Network error - please check your connection or the server might be down');
    }

    return Promise.reject(error);
  }
);

export const HistoryContext = createContext();

const historyReducer = (state, action) => {
  switch (action.type) {
    case 'GET_HISTORY':
      return {
        ...state,
        scans: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_SCAN':
      return {
        ...state,
        scans: [action.payload, ...state.scans],
        error: null
      };
    case 'DELETE_SCAN':
      return {
        ...state,
        scans: state.scans.filter(scan => scan._id !== action.payload),
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'HISTORY_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const HistoryProvider = ({ children }) => {
  const initialState = {
    scans: [],
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(historyReducer, initialState);

  // Clear any errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Get user's scan history
  const getHistory = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await apiClient.get('/api/history');
      
      dispatch({
        type: 'GET_HISTORY',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch history';
      console.error('History fetch error:', errorMessage);
      
      dispatch({
        type: 'HISTORY_ERROR',
        payload: errorMessage
      });
      
      throw err;
    }
  };

  // Add scan to history
  const addScan = async (url, scanResults) => {
    try {
      const res = await apiClient.post('/api/history', { url, scanResults });
      
      dispatch({
        type: 'ADD_SCAN',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add scan';
      console.error('Add scan error:', errorMessage);
      
      dispatch({
        type: 'HISTORY_ERROR',
        payload: errorMessage
      });
      
      throw err;
    }
  };

  // Delete scan from history
  const deleteScan = async (id) => {
    try {
      await apiClient.delete(`/api/history/${id}`);
      
      dispatch({
        type: 'DELETE_SCAN',
        payload: id
      });
      
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete scan';
      console.error('Delete scan error:', errorMessage);
      
      dispatch({
        type: 'HISTORY_ERROR',
        payload: errorMessage
      });
      
      throw err;
    }
  };

  // Download scan results
  const downloadScan = (scan) => {
    try {
      const fileName = `scan_${new Date(scan.scanDate).toISOString().slice(0,10)}_${scan._id}.json`;
      const dataStr = JSON.stringify(scan.scanResults, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      }, 100);
    } catch (err) {
      console.error('Download error:', err);
      
      dispatch({
        type: 'HISTORY_ERROR',
        payload: 'Failed to download scan results'
      });
      
      throw err;
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        scans: state.scans,
        loading: state.loading,
        error: state.error,
        getHistory,
        addScan,
        deleteScan,
        downloadScan,
        clearError
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;