// src/components/SignupForm.jsx
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('CodeGuardian says: Passwords do not match!');
      return;
    }
  
    try {
      // Send signup request
      const response = await axios.post('/api/auth/signup', formData);
  
      // Redirect to login page after successful signup
      if (response.status === 201) {
        alert('CodeGuardian says: Signup successful! Redirecting to Loginpage...');
        navigate('/login');
      } else {
        alert('CodeGuardian says: Unexpected response from the server.');
      }
    } catch (error) {
      // console.error('Signup failed:', error.response?.data || error.message);
      // alert(error.response?.data?.message || 'An error occurred during signup.');


      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      console.error('Signup failed:', error.response?.data || error.message);
      alert(`CodeGuardian says: Signup failed ${errorMessage}`); // Show the error message in an alert
    }
  };
  

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
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
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Sign Up
      </Button>
    </Box>
  );
}

export default SignupForm;
