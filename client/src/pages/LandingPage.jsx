import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Tabs, 
  Tab, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  useMediaQuery,
  Button,
  Card,
  CardContent,
  Avatar,
  Fade,
  Zoom,
  Slide,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import SpeedIcon from '@mui/icons-material/Speed';
import LockIcon from '@mui/icons-material/Lock';
import Navbar from '../components/Navbar';

// Styled components
const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  textAlign: 'center',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
    : 'linear-gradient(45deg, #2196F3 30%, #1565C0 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(2),
  fontSize: '3.5rem',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.75rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
  filter: 'drop-shadow(0px 2px 8px rgba(33, 150, 243, 0.5))',
  transition: 'all 0.3s ease',
  letterSpacing: '-0.5px',
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: 400,
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#424242',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
    marginBottom: theme.spacing(4),
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: 3,
  },
  '& .MuiTab-root': {
    minWidth: 120,
    fontWeight: 600,
    transition: 'all 0.2s',
    textTransform: 'none',
    fontSize: '1rem',
    padding: theme.spacing(1.5, 3),
    '&:hover': {
      color: theme.palette.primary.main,
      opacity: 1,
    },
    '&.Mui-selected': {
      color: theme.palette.mode === 'dark' ? '#90CAF9' : theme.palette.primary.main,
      fontWeight: 700,
    },
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(25, 28, 36, 0.8)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.05)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px rgba(0, 0, 0, 0.5)'
      : '0 12px 40px rgba(31, 38, 135, 0.2)',
  },
}));

const FeatureIcon = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
    : 'linear-gradient(45deg, #2196F3 30%, #1565C0 90%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(2),
}));

const LandingBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(10),
  background: theme.palette.mode === 'dark'
    ? 'radial-gradient(circle at 50% 50%, #121212 0%, #050505 100%)'
    : 'radial-gradient(circle at 50% 50%, #f5f5f5 0%, #e0e0e0 100%)',
}));

const AuthPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  background: theme.palette.mode === 'dark' 
    ? 'rgba(25, 28, 36, 0.5)'
    : 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.05)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

// Feature Section Title - Improved for better responsiveness
const FeatureSectionTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 700,
  marginBottom: theme.spacing(6),
  fontSize: '2.5rem',
  color: theme.palette.mode === 'dark' ? '#f5f5f5' : '#333333',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.25rem',
    marginBottom: theme.spacing(5),
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
    marginBottom: theme.spacing(4),
  }
}));

function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  
  // Create refs for scrolling
  const authSectionRef = useRef(null);
  
  // Parse tab from URL query parameters
  const [tabIndex, setTabIndex] = useState(0);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'signup') {
      setTabIndex(1);
      // Optional: scroll to signup section when URL has signup parameter
      if (authSectionRef.current) {
        authSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setTabIndex(0);
    }
  }, [location]);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    navigate(newIndex === 0 ? '/' : '/?tab=signup', { replace: true });
  };
  
  // Scroll to auth section
  const scrollToAuthSection = () => {
    if (authSectionRef.current) {
      authSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      // Also change to signup tab
      setTabIndex(1);
      navigate('/?tab=signup', { replace: true });
    }
  };

  const features = [
    {
      title: "Vulnerability Detection",
      description: "Identify security vulnerabilities in your code before they become threats.",
      icon: <ShieldIcon fontSize="large" />
    },
    {
      title: "Code Analysis",
      description: "Deep analysis of your codebase to detect potential security issues.",
      icon: <CodeIcon fontSize="large" />
    },
    {
      title: "Bug Tracking",
      description: "Track and manage security bugs with detailed reports and remediation suggestions.",
      icon: <BugReportIcon fontSize="large" />
    },
    {
      title: "Performance Optimization",
      description: "Optimize your code for better performance and security.",
      icon: <SpeedIcon fontSize="large" />
    },
    {
      title: "Secure Authentication",
      description: "Ensure your authentication mechanisms are robust and secure.",
      icon: <LockIcon fontSize="large" />
    },
    {
      title: "Continuous Protection",
      description: "Real-time monitoring and protection against emerging threats.",
      icon: <SecurityIcon fontSize="large" />
    }
  ];

  return (
    <>
      <Navbar />
      <LandingBox>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box mb={isMobile ? 4 : 8} mt={isMobile ? 4 : 8}>
            <Fade in={true} timeout={1000}>
              <Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 3 
                  }}
                >
                  <Avatar
                    src="ninja.png"
                    alt="CodeGuardian logo"
                    sx={{
                      width: isMobile ? 80 : 120,
                      height: isMobile ? 80 : 120,
                      boxShadow: '0 0 30px rgba(33, 150, 243, 0.3)',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                </Box>
                <HeroTitle variant="h1">
                  CodeGuardian
                </HeroTitle>
                <Subtitle variant="h5">
                  Your First Line of Defense Against Vulnerabilities
                </Subtitle>
              </Box>
            </Fade>

            {/* Auth Section - Added ref for scrolling */}
            <Grid container spacing={4} justifyContent="center" ref={authSectionRef}>
              <Grid item xs={12} md={6}>
                <Zoom in={true} timeout={800}>
                  <AuthPaper elevation={4}>
                    <StyledTabs value={tabIndex} onChange={handleTabChange} centered>
                      <Tab label="Login" />
                      <Tab label="Sign Up" />
                    </StyledTabs>
                    <Box>
                      {tabIndex === 0 && (
                        <Fade in={tabIndex === 0} timeout={500}>
                          <Box><LoginForm /></Box>
                        </Fade>
                      )}
                      {tabIndex === 1 && (
                        <Fade in={tabIndex === 1} timeout={500}>
                          <Box><SignupForm /></Box>
                        </Fade>
                      )}
                    </Box>
                  </AuthPaper>
                </Zoom>
              </Grid>
            </Grid>
          </Box>

          {/* Features Section - Improved responsiveness and alignment */}
          <Box mt={isMobile ? 6 : 10} px={isMobile ? 1 : 0}>
            <Fade in={true} timeout={1500}>
              <FeatureSectionTitle variant="h3">
                Powerful Security Features
              </FeatureSectionTitle>
            </Fade>
            
            <Grid container spacing={isMobile ? 2 : 4} justifyContent="center">
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Slide 
                    direction="up" 
                    in={true} 
                    timeout={700 + (index * 150)}
                    mountOnEnter
                    unmountOnExit
                  >
                    <FeatureCard>
                      <CardContent sx={{ 
                        textAlign: 'center', 
                        p: isMobile ? 2 : 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}>
                        <FeatureIcon>
                          {feature.icon}
                        </FeatureIcon>
                        <Typography 
                          variant="h6" 
                          fontWeight="600" 
                          gutterBottom
                          sx={{
                            fontSize: isMobile ? '1.1rem' : '1.25rem'
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          color="text.secondary"
                          sx={{
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </FeatureCard>
                  </Slide>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA Section - Updated with scroll functionality */}
          <Box 
            mt={isMobile ? 6 : 10} 
            textAlign="center"
            sx={{
              animation: 'fadeIn 1.5s ease-in-out',
              px: isMobile ? 2 : 0
            }}
          >
            <Fade in={true} timeout={2000}>
              <Box>
                <Typography 
                  variant="h4" 
                  fontWeight="700" 
                  mb={3}
                  sx={{
                    fontSize: isMobile ? '1.75rem' : '2.25rem',
                  }}
                >
                  Start Securing Your Code Today
                </Typography>
                <Typography 
                  variant="body1" 
                  mb={4} 
                  mx="auto"
                  sx={{ 
                    maxWidth: '700px',
                    fontSize: isMobile ? '0.95rem' : '1rem' 
                  }}
                >
                  Join thousands of developers who trust CodeGuardian to keep their applications secure and protected from vulnerabilities.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={scrollToAuthSection}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    textTransform: 'none',
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #2196F3 30%, #1565C0 90%)',
                    boxShadow: '0 4px 20px rgba(33, 150, 243, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 25px rgba(33, 150, 243, 0.6)',
                    },
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Fade>
          </Box>
        </Container>
      </LandingBox>

      {/* Add CSS animations */}
      <style jsx="true">{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.7);
          }
          
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 15px rgba(33, 150, 243, 0);
          }
          
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export default LandingPage;