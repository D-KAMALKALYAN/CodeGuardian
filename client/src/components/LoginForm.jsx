// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (error) {
      // Get error message from backend response or fallback to default message
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      console.error('Error during login:', error.response?.data || error.message);
      alert(`CodeGuardian says: ${errorMessage}`); // Show the error message in an alert
    }
  };
  
  

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Login
      </Button>
    </Box>
  );
}

export default LoginForm;
