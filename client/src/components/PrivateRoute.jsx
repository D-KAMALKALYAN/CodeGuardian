// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('token'); // Adjust this logic based on your authentication mechanism

  return isAuthenticated ? children : <Navigate to="/" />;
}

export default PrivateRoute;
