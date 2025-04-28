import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Container,
  useMediaQuery,
  Slide,
  useScrollTrigger,
  Avatar,
  Tooltip,
  Zoom,
  Badge
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SecurityIcon from '@mui/icons-material/Security';
import ThemeToggle from './theme/ThemeToggle';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

// Styled components
const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '0.05em',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(90deg, #ffffff 30%, #a2d2ff 100%)'
    : 'linear-gradient(90deg, #ffffff 30%, #a2d2ff 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: theme.palette.mode === 'dark'
    ? '0 0 15px rgba(255,255,255,0.3)'
    : '0 0 15px rgba(255,255,255,0.5)',
  transition: 'all 0.3s ease',
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  margin: '0 4px',
  padding: '8px 16px',
  position: 'relative',
  transition: 'all 0.2s ease',
  borderRadius: '8px',
  overflow: 'hidden',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
  },
  '&::after': active ? {
    content: '""',
    position: 'absolute',
    bottom: '5px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '3px',
    backgroundColor: '#ffffff',
    borderRadius: '3px',
  } : {},
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    transition: 'all 0.5s ease',
  },
  '&:hover::before': {
    left: '100%',
  }
}));

const LogoImage = styled('img')(({ theme, scrolled }) => ({
  width: 36,
  height: 36,
  marginRight: 10,
  transition: 'transform 0.3s ease',
  transform: scrolled ? 'scale(0.9)' : 'scale(1)',
  filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.3))',
}));

// Hide navbar on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    // Listen for storage events to update login status
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [location]);

  // Change navbar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Nav items for logged in users
  const authNavItems = [
    { name: 'Home', path: '/home', icon: <HomeIcon /> },
    { name: 'About', path: '/about', icon: <InfoIcon /> },
    { name: 'Profile', path: '/profile', icon: <PersonIcon /> },
    { name: 'History', path: '/history', icon: <HistoryIcon /> },
  ];

  // Nav items for guests (not logged in)
  const guestNavItems = [
    { name: 'Login', path: '/', icon: <LoginIcon />, queryParam: '?tab=login' },
    { name: 'Sign Up', path: '/', icon: <PersonAddIcon />, queryParam: '?tab=signup' },
  ];

  const navItems = isLoggedIn ? authNavItems : guestNavItems;
  const isActive = (path, queryParam) => {
    const pathMatch = location.pathname === path;
    if (!queryParam) return pathMatch;

    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');

    if (queryParam.includes('login')) return pathMatch && (!tab || tab === 'login');
    if (queryParam.includes('signup')) return pathMatch && tab === 'signup';

    return pathMatch;
  };

  // Drawer content based on auth status
  const drawer = (
    <Box onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} sx={{ width: 250 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          p: 2, 
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #121212 0%, #1a237e 100%)' 
            : 'linear-gradient(135deg, #1976d2 0%, #1a237e 100%)'
        }}
      >
        <LogoImage
          src="ninja.png"
          alt="Ninja icon"
          scrolled={scrolled}
        />
        <Typography variant="h6" sx={{ color: '#fff' }}>
          CodeGuardian
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.name} 
            component={Link} 
            to={item.queryParam ? `${item.path}${item.queryParam}` : item.path}
            sx={{ 
              backgroundColor: isActive(item.path, item.queryParam) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.15)',
              },
              borderRadius: 1,
              mx: 1,
              mb: 1,
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}

        {isLoggedIn && (
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{ 
              borderRadius: 1,
              mx: 1,
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.15)',
              },
            }}
          >
            <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: theme.palette.error.main }} />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <HideOnScroll>
      <AppBar 
        position="sticky" 
        elevation={scrolled ? 4 : 0}
        sx={{
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.15)' : 'none',
          background: theme.palette.mode === 'dark' 
            ? scrolled 
              ? 'linear-gradient(90deg, rgba(18, 18, 24, 0.95) 0%, rgba(26, 35, 126, 0.95) 100%)' 
              : 'linear-gradient(90deg, rgba(18, 18, 24, 0.85) 0%, rgba(26, 35, 126, 0.85) 100%)'
            : scrolled 
              ? 'linear-gradient(90deg, rgba(25, 118, 210, 0.95) 0%, rgba(26, 35, 126, 0.95) 100%)'
              : 'linear-gradient(90deg, rgba(25, 118, 210, 0.85) 0%, rgba(26, 35, 126, 0.85) 100%)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile Menu */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo and Title */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexGrow: isMobile ? 1 : 0,
                cursor: 'pointer'
              }}
              onClick={() => navigate(isLoggedIn ? '/home' : '/')}
            >
              <Badge
                overlap="circular"
                badgeContent={
                  <Tooltip title="Secure Protection" arrow TransitionComponent={Zoom}>
                    <SecurityIcon 
                      sx={{ 
                        fontSize: 16, 
                        color: theme.palette.mode === 'dark' ? '#90caf9' : '#fff',
                        filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.3))'
                      }} 
                    />
                  </Tooltip>
                }
                sx={{ mr: 1 }}
              >
                <Avatar 
                  src="ninja.png" 
                  alt="Ninja icon"
                  sx={{
                    width: 36,
                    height: 36,
                    transition: 'transform 0.3s ease',
                    transform: scrolled ? 'scale(0.9)' : 'scale(1)',
                    bgcolor: 'transparent',
                  }}
                />
              </Badge>

              <LogoText 
                variant="h6" 
                component="div" 
                sx={{ 
                  display: { xs: 'none', sm: 'block' },
                  fontSize: scrolled ? '1.15rem' : '1.25rem',
                }}
              >
                CodeGuardian
              </LogoText>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  ml: 'auto',
                  gap: 0.5 
                }}
              >
                {navItems.map((item) => (
                  <Tooltip 
                    key={item.name}
                    title={item.name} 
                    arrow 
                    TransitionComponent={Zoom}
                    enterDelay={500}
                  >
                    <NavButton 
                      component={Link} 
                      to={item.queryParam ? `${item.path}${item.queryParam}` : item.path}
                      color="inherit"
                      startIcon={item.icon}
                      active={isActive(item.path, item.queryParam) ? 1 : 0}
                    >
                      {item.name}
                    </NavButton>
                  </Tooltip>
                ))}

                {isLoggedIn && (
                  <Tooltip title="Logout" arrow TransitionComponent={Zoom}>
                    <Button 
                      color="inherit" 
                      onClick={handleLogout}
                      startIcon={<LogoutIcon />}
                      sx={{
                        ml: 0.5,
                        py: 1,
                        px: 2,
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(244, 67, 54, 0.2)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Logout
                    </Button>
                  </Tooltip>
                )}

                <ThemeToggle />
              </Box>
            )}

            {/* Mobile Theme Toggle */}
            {isMobile && <ThemeToggle />}
          </Toolbar>
        </Container>

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            '& .MuiDrawer-paper': {
              borderRadius: '0 16px 16px 0',
            },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
}

export default Navbar;