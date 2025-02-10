import React, { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from "./config";

function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null); // 🔹 Holds API error messages
  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear field-specific errors
    setServerError(null); // Clear any API error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    setServerError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, formData);

      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        window.dispatchEvent(new Event('storage')); // Ensure PrivateRoute updates
        navigate('/home');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setServerError('User already exists. Please log in or use another email.');
        } else {
          setServerError(error.response.data.message || 'Signup failed. Try again.');
        }
      } else {
        setServerError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Create an Account
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      <TextField
        label="Full Name *"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        error={!!errors.fullName}
        helperText={errors.fullName}
        fullWidth
        margin="normal"
        // required
      />
      <TextField
        label="Email *"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
        margin="normal"
        // required
      />
      <TextField
        label="Password *"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
        margin="normal"
        // required
      />
      <TextField
        label="Confirm Password *"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        fullWidth
        margin="normal"
        // required
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
      </Button>
    </Box>
  );
}

export default SignupForm;
