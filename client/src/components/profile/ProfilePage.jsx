import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Grid, 
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';

// Import components
import ProfileHeader from './ProfileHeader';
import PersonalInfoCard from './PersonalInfoCard';
import ContactInfoCard from './ContactInfoCard';
import AccountInfoCard from './AccountInfoCard';
import { ProfilePaper } from './StyledComponents';
import { isValidEmail, isValidWebsite, isValidPhone } from './utils';

// Import API client instead of axios directly
import apiClient, { getErrorMessage } from '../../config/apiClient';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    phoneNumber: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Using apiClient instead of axios directly - no need to handle tokens manually
      const response = await apiClient.get('/api/profile');
      
      console.log('Profile data:', response.data);
      setProfileData(response.data);
      setFormData({
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        bio: response.data.bio || '',
        location: response.data.location || '',
        website: response.data.website || '',
        phoneNumber: response.data.phoneNumber || '',
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setSnackbar({
        open: true,
        message: getErrorMessage(error), // Using helper for user-friendly messages
        severity: 'error',
      });
      
      // The apiClient will automatically handle 401 errors and redirect to login
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field if exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (formData.website && !isValidWebsite(formData.website)) {
      errors.website = 'Website URL is invalid';
    }
    
    if (formData.phoneNumber && !isValidPhone(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number format is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Using apiClient instead of axios directly
      await apiClient.put('/api/profile', formData);
      
      setProfileData({
        ...profileData,
        ...formData,
      });
      
      setEditMode(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: getErrorMessage(error), // Using helper for user-friendly messages
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  if (loading && !profileData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <ProfilePaper elevation={3}>
        <ProfileHeader 
          profileData={profileData}
          editMode={editMode}
          setEditMode={setEditMode}
          setFormData={setFormData}
          setFormErrors={setFormErrors}
          handleSaveProfile={handleSaveProfile}
        />

        <Grid container spacing={4}>
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <PersonalInfoCard 
              editMode={editMode}
              profileData={profileData}
              formData={formData}
              handleInputChange={handleInputChange}
              formErrors={formErrors}
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <ContactInfoCard 
              editMode={editMode}
              profileData={profileData}
              formData={formData}
              handleInputChange={handleInputChange}
              formErrors={formErrors}
            />
          </Grid>

          {/* Account Information */}
          <Grid item xs={12}>
            <AccountInfoCard 
              profileData={profileData}
              editMode={editMode}
              loading={loading}
              handleSaveProfile={handleSaveProfile}
            />
          </Grid>
        </Grid>
      </ProfilePaper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;