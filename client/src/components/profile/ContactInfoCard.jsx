import React from 'react';
import {
  Box,
  Grid,
  Typography,
  CardContent,
  Fade
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { InfoCard, SectionTitle, StyledTextField } from './StyledComponents';

const ContactInfoCard = ({ 
  editMode, 
  profileData, 
  formData, 
  handleInputChange, 
  formErrors 
}) => {
  const theme = useTheme();

  return (
    <Fade in={true} style={{ transitionDelay: '200ms' }}>
      <InfoCard elevation={2}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle variant="h6">
            Contact Information
          </SectionTitle>
          
          {editMode ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  error={!!formErrors.phoneNumber}
                  helperText={formErrors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  error={!!formErrors.website}
                  helperText={formErrors.website}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          ) : (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1">
                      {profileData?.phoneNumber || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Website
                    </Typography>
                    <Typography variant="body1">
                      {profileData?.website ? (
                        <a 
                          href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                        >
                          {profileData.website}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {profileData?.location || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </InfoCard>
    </Fade>
  );
};

export default ContactInfoCard;