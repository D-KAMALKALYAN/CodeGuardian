import React, { useState, useContext } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  CircularProgress, 
  IconButton,
  InputAdornment,
  useMediaQuery,
  Fade,
  Paper,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient, { getErrorMessage } from "../config/apiClient"; // Updated import
import { ThemeContext } from '../context/ThemeContext';
import { styled, useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FuturisticAlert from './common/FuturisticAlert';

// Styled components
const SignupPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  maxWidth: 450,
  width: '100%',
  backdropFilter: 'blur(10px)',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(25, 28, 36, 0.8)'
    : 'rgba(255, 255, 255, 0.9)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 2px rgba(255, 255, 255, 0.05) inset'
    : '0 8px 32px rgba(31, 38, 135, 0.15), 0 0 2px rgba(255, 255, 255, 0.3) inset',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.05)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.1)' 
      : 'rgba(255, 255, 255, 0.7)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(0, 0, 0, 0.2)' 
        : 'rgba(255, 255, 255, 0.9)',
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(0, 0, 0, 0.2)' 
        : 'rgba(255, 255, 255, 0.9)',
    },
  },
  '& label.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const SignupButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: '12px 0',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #2196F3 0%, #2979FF 100%)'
    : 'linear-gradient(45deg, #1976D2 30%, #2979FF 90%)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 20px rgba(33, 150, 243, 0.3)'
    : '0 4px 20px rgba(25, 118, 210, 0.3)',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.01)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 6px 25px rgba(33, 150, 243, 0.4)'
      : '0 6px 25px rgba(25, 118, 210, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0) scale(0.99)',
  },
  '&.Mui-disabled': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(0, 0, 0, 0.12)',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #2196F3 0%, #4FC3F7 100%)'
    : 'linear-gradient(45deg, #1976D2 0%, #2979FF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(3),
  letterSpacing: '0.5px',
}));

function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');
  
  const navigate = useNavigate();
  const theme = useTheme();
  const { darkMode } = useContext(ThemeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const showAlert = (message, severity = 'error') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // Use the centralized apiClient instead of direct axios call
      const response = await apiClient.post('/api/auth/signup', formData);

      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        showAlert('Account created successfully! Redirecting to homepage...', 'success');
        
        // Delay navigation slightly for smooth animation
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      }
    } catch (error) {
      // Use the centralized error handling helper
      const errorMessage = getErrorMessage(error);
      
      // Special handling for user already exists error (409)
      if (error.response?.status === 409) {
        showAlert('User already exists. Please log in or use another email.');
      } else {
        showAlert(errorMessage);
      }
      
      // The apiClient already handles logging
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Fade in={true} timeout={800}>
        <SignupPaper elevation={6}>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Title variant={isMobile ? "h5" : "h4"} align="center">
              Create Account
            </Title>
            
            <StyledTextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <StyledTextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <StyledTextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <StyledTextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <SignupButton
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 4, mb: 2 }}
              startIcon={loading ? null : <PersonAddIcon />}
            >
             {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </SignupButton>
          </Box>
        </SignupPaper>
      </Fade>

      {/* FuturisticAlert component */}
      <FuturisticAlert
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleCloseAlert}
        autoHideDuration={6000}
      />
    </Container>
  );
}

export default SignupForm;