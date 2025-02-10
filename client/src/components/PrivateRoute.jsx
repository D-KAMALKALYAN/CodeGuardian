import React from 'react';
import { Navigate } from 'react-router-dom';


function PrivateRoute({ children }) {
  const token = localStorage.getItem('token'); // Check if user is authenticated

  return token ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
