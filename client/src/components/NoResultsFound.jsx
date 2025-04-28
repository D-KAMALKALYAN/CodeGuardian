import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Link } from 'react-router-dom';

const NoResultsFound = ({ message = "No results found" }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      flexDirection: 'column', 
      height: '60vh', 
      gap: 2,
      p: 3
    }}>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          maxWidth: 500,
          width: '100%'
        }}
      >
        <SearchOffIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.6 }} />
        
        <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: 600 }}>
          {message}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center">
          Complete a scan to start building your history.
        </Typography>
        
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
        >
          Go to Scanner
        </Button>
      </Paper>
    </Box>
  );
};

export default NoResultsFound;