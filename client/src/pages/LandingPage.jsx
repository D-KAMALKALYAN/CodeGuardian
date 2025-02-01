// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { Container, Tabs, Tab, Box, Typography } from '@mui/material';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
// import { Shield } from "lucide-react"; 

function LandingPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Container maxWidth="sm">
<Box textAlign="center" my={4}>
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    gap={2}
  >
    <Typography variant="h3" gutterBottom>
      CodeGuardian
    </Typography>
  </Box>
  <Typography variant="h6">
    Your First Line of Defense Against Vulnerabilities.
  </Typography>
</Box>


      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Login" />
        <Tab label="Signup" />
      </Tabs>
      <Box mt={2}>
        {tabIndex === 0 && <LoginForm />}
        {tabIndex === 1 && <SignupForm />}
      </Box>
    </Container>
  );
}

export default LandingPage;
