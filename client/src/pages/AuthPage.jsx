// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

function AuthPage() {
  const { type } = useParams();
  const isLogin = type === 'login';
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    try {
      const response = await axios.post(endpoint, formData);
      // Handle successful authentication
    } catch (error) {
      // Handle errors
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        {isLogin ? 'Login' : 'Signup'}
      </Typography>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <TextField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        )}
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
        {!isLogin && (
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isLogin ? 'Login' : 'Signup'}
        </Button>
      </form>
    </Container>
  );
}

export default AuthPage;
