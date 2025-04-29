import React from 'react';
import {
  Box,
  Grid,
  Typography,
  CardContent,
  Fade
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import { InfoCard, SectionTitle, StyledTextField } from './StyledComponents';

const PersonalInfoCard = ({ 
  editMode, 
  profileData, 
  formData, 
  handleInputChange, 
  formErrors 
}) => {
  return (
    <Fade in={true} style={{ transitionDelay: '100ms' }}>
      <InfoCard elevation={2}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle variant="h6">
            Personal Information
          </SectionTitle>
          
          {editMode ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={!!formErrors.fullName}
                  helperText={formErrors.fullName}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                />
              </Grid>
            </Grid>
          ) : (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountCircleIcon color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="body1" fontWeight={500}>
                      {profileData?.fullName || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="body1">
                      {profileData?.email || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Bio
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {profileData?.bio || 'No bio provided'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </InfoCard>
    </Fade>
  );
};

export default PersonalInfoCard;