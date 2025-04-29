import React from 'react';
import {
  Box,
  Typography,
  Tooltip,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { ProfileAvatar, HeaderIconButton } from './StyledComponents';

const ProfileHeader = ({ 
  profileData, 
  editMode, 
  setEditMode, 
  setFormData, 
  setFormErrors, 
  handleSaveProfile 
}) => {
  return (
    <>
      <Box sx={{ position: 'relative', zIndex: 1, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4" color="white" fontWeight={600}>
          User Profile
        </Typography>
        <Box>
          <Tooltip title="Back to Home">
            <HeaderIconButton component={Link} to="/home">
              <HomeIcon />
            </HeaderIconButton>
          </Tooltip>
          {!editMode ? (
            <Tooltip title="Edit Profile">
              <HeaderIconButton onClick={() => setEditMode(true)}>
                <EditIcon />
              </HeaderIconButton>
            </Tooltip>
          ) : (
            <>
              <Tooltip title="Cancel">
                <HeaderIconButton
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      fullName: profileData.fullName || '',
                      email: profileData.email || '',
                      bio: profileData.bio || '',
                      location: profileData.location || '',
                      website: profileData.website || '',
                      phoneNumber: profileData.phoneNumber || '',
                    });
                    setFormErrors({});
                  }}
                >
                  <CancelIcon />
                </HeaderIconButton>
              </Tooltip>
              <Tooltip title="Save Changes">
                <HeaderIconButton onClick={handleSaveProfile}>
                  <SaveIcon />
                </HeaderIconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 4, mt: 2 }}>
        <ProfileAvatar src={profileData?.avatar || null}>
          {!profileData?.avatar && (
            <AccountCircleIcon sx={{ width: 80, height: 80 }} />
          )}
        </ProfileAvatar>
        <Box sx={{ ml: 3, zIndex: 1, pb: 1 }}>
          <Typography variant="h5" color="white" fontWeight={600}>
            {profileData?.fullName || 'User'}
          </Typography>
          <Typography variant="body1" color="white" sx={{ opacity: 0.8 }}>
            {profileData?.email || 'No email provided'}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ProfileHeader;