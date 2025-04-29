import { styled } from '@mui/material/styles';
import { 
  Paper, 
  Avatar, 
  Card, 
  Typography, 
  TextField, 
  Button,
  IconButton
} from '@mui/material';

// Styled components for Profile layout and elements
export const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '120px',
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, #1a237e 0%, #121212 100%)'
      : 'linear-gradient(135deg, #1976d2 0%, #1a237e 100%)',
    zIndex: 0,
  }
}));

export const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  zIndex: 1,
  backgroundColor: theme.palette.primary.main,
}));

export const InfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 12,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
  }
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(3),
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '40px',
    height: '3px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '3px',
  }
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)',
    }
  }
}));

export const SaveButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '10px 24px',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  }
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  }
}));

export const HeaderIconButton = styled(IconButton)(({ theme }) => ({ 
  color: 'white',
  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
}));