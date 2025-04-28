import React, { forwardRef } from 'react';
import { 
  Snackbar, 
  Box, 
  Typography, 
  IconButton, 
  Slide 
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';

// Styled Alert container
const AlertContainer = styled(Box)(({ theme, severity }) => {
  const bgColors = {
    success: theme.palette.mode === 'dark' 
      ? 'linear-gradient(45deg, rgba(46, 125, 50, 0.95), rgba(76, 175, 80, 0.9))' 
      : 'linear-gradient(45deg, rgba(46, 125, 50, 0.9), rgba(76, 175, 80, 0.85))',
    error: theme.palette.mode === 'dark' 
      ? 'linear-gradient(45deg, rgba(183, 28, 28, 0.95), rgba(211, 47, 47, 0.9))' 
      : 'linear-gradient(45deg, rgba(183, 28, 28, 0.9), rgba(211, 47, 47, 0.85))',
    warning: theme.palette.mode === 'dark' 
      ? 'linear-gradient(45deg, rgba(237, 108, 2, 0.95), rgba(255, 152, 0, 0.9))' 
      : 'linear-gradient(45deg, rgba(237, 108, 2, 0.9), rgba(255, 152, 0, 0.85))',
    info: theme.palette.mode === 'dark' 
      ? 'linear-gradient(45deg, rgba(2, 136, 209, 0.95), rgba(3, 169, 244, 0.9))' 
      : 'linear-gradient(45deg, rgba(2, 136, 209, 0.9), rgba(3, 169, 244, 0.85))'
  };

  return {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    borderRadius: 12,
    background: bgColors[severity] || bgColors.info,
    backdropFilter: 'blur(10px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)'
      : '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    minWidth: 280,
    maxWidth: 500,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: 'rgba(255, 255, 255, 0.5)',
      animation: 'pulse 2s infinite',
    },
    '@keyframes pulse': {
      '0%': { opacity: 0.6 },
      '50%': { opacity: 1 },
      '100%': { opacity: 0.6 }
    }
  };
});

const IconWrapper = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    fontSize: 28,
    filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))'
  }
}));

const MessageWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  marginRight: theme.spacing(1)
}));

// Slide transition for alerts
const SlideTransition = forwardRef(function Transition(props, ref) {
  return <Slide {...props} direction="up" ref={ref} />;
});

const FuturisticAlert = ({ 
  open, 
  message, 
  severity = 'info', 
  onClose, 
  autoHideDuration = 6000,
  vertical = 'bottom',
  horizontal = 'center'
}) => {
  const theme = useTheme();
  
  const getIcon = () => {
    switch(severity) {
      case 'success': return <CheckCircleIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'info': default: return <InfoIcon />;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical, horizontal }}
      TransitionComponent={SlideTransition}
    >
      <AlertContainer severity={severity}>
        <IconWrapper>
          {getIcon()}
        </IconWrapper>
        <MessageWrapper>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {message}
          </Typography>
        </MessageWrapper>
        <IconButton 
          size="small" 
          onClick={onClose}
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </AlertContainer>
    </Snackbar>
  );
};

export default FuturisticAlert;