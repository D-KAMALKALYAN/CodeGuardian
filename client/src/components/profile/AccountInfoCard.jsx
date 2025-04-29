import React from 'react';
import {
  Box,
  Grid,
  Typography,
  CardContent,
  Fade,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';
import { InfoCard, SectionTitle, SaveButton } from './StyledComponents';
import SaveIcon from '@mui/icons-material/Save';
import { formatDate } from './utils';

const AccountInfoCard = ({
  profileData,
  editMode,
  loading,
  handleSaveProfile
}) => {
  const theme = useTheme();

  return (
    <Fade in={true} style={{ transitionDelay: '300ms' }}>
      <InfoCard elevation={2}>
        <CardContent sx={{ p: 3 }}>
          <SectionTitle variant="h6">
            Account Information
          </SectionTitle>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon color="primary" sx={{ mr: 1.5 }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatDate(profileData?.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LockIcon color="primary" sx={{ mr: 1.5 }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Account Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Chip 
                      label="Active" 
                      size="small" 
                      sx={{ 
                        backgroundColor: theme.palette.success.main,
                        color: '#fff',
                        fontWeight: 500
                      }} 
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {formatDate(profileData?.updatedAt || profileData?.createdAt)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {editMode && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <SaveButton
                variant="contained"
                color="primary"
                onClick={handleSaveProfile}
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </SaveButton>
            </Box>
          )}
        </CardContent>
      </InfoCard>
    </Fade>
  );
};

export default AccountInfoCard;