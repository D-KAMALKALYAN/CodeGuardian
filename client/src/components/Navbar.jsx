// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        {/* Ninja Icon */}
        <img
          src="ninja.png"
          alt="Ninja icon"
          style={{
            width: 40,
            height: 40,
            marginRight: 5,
            marginBottom: "10px", // Add spacing between the image and text
          }}
        />
        {/* Title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CodeGuardian
        </Typography>
        {/* Buttons */}
        <Box>
          <Button color="inherit" component={Link} to="/home">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/scan">
            Scan
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
