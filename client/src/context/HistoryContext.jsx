import React, { createContext, useReducer } from 'react';
import axios from 'axios';

export const HistoryContext = createContext();

const historyReducer = (state, action) => {
  switch (action.type) {
    case 'GET_HISTORY':
      return {
        ...state,
        scans: action.payload,
        loading: false
      };
    case 'ADD_SCAN':
      return {
        ...state,
        scans: [action.payload, ...state.scans]
      };
    case 'DELETE_SCAN':
      return {
        ...state,
        scans: state.scans.filter(scan => scan._id !== action.payload)
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

  // Get user's scan history
  const getHistory = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
       // Get token from localStorage or wherever you store it
    const token = localStorage.getItem('token');
    
    // Include token in request headers
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const res = await axios.get('/api/history', config);
      
      dispatch({
        type: 'GET_HISTORY',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'HISTORY_ERROR',
        payload: err.response?.data.message || 'Failed to fetch history'
      });
    }
  };

  // Add scan to history
// Add scan to history
const addScan = async (url, scanResults) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Add the token to the request headers
    }
  };

  try {
    const res = await axios.post('/api/history', { url, scanResults }, config);
    
    dispatch({
      type: 'ADD_SCAN',
      payload: res.data
    });
    
    return res.data;
  } catch (err) {
    dispatch({
      type: 'HISTORY_ERROR',
      payload: err.response?.data.message || 'Failed to add scan'
    });
    // Re-throw the error so it can be caught by the calling function
    throw err;
  }
};

  // Delete scan from history
  const deleteScan = async (id) => {
    try {
      await axios.delete(`/api/history/${id}`);
      
      dispatch({
        type: 'DELETE_SCAN',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'HISTORY_ERROR',
        payload: err.response?.data.message || 'Failed to delete scan'
      });
    }
  };

  // Download scan results
  const downloadScan = (scan) => {
    const fileName = `scan_${new Date(scan.scanDate).toISOString().slice(0,10)}_${scan._id}.json`;
    const dataStr = JSON.stringify(scan.scanResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        downloadScan
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};