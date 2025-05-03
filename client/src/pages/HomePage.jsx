import React, { useState, useContext, useRef } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { HistoryContext } from '../context/HistoryContext';
import { 
  Container, Box, useMediaQuery, Alert, Typography, 
  Button, Paper, Fade, Collapse, Divider
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Import API client instead of axios directly
import apiClient, { isNetworkError, getErrorMessage } from '../config/apiClient';

// Import components
import Header from '../components/layout/Header';
import ScanForm from '../components/scanner/ScanForm';
import ScanResults from '../components/scanner/ScanResults';
import VulnerabilityList from '../components/vulnerabilities/VulnerabilityList';

const HomePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { addScan } = useContext(HistoryContext);
  const [scanResults, setScanResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [lastScanParams, setLastScanParams] = useState(null);
  const resultsRef = useRef(null);
  
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleScanResults = (results) => {
    setIsScanning(false);
    setError(null);
    setScanResults(results);
    
    // Add scan to history
    console.log('Adding scan to history:', {
      url: results.url,
      scanResultsSize: JSON.stringify(results).length
    });
    
    // Call addScan from HistoryContext
    addScan(results.url, results)
      .then(savedScan => {
        console.log('Scan added to history successfully:', savedScan);
      })
      .catch(err => {
        console.error('Failed to add scan to history:', err);
      });
    
    // Scroll to results
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleScan = async (url, scanType, selectedVulnerabilities = []) => {
    console.log('Starting scan with parameters:', { url, scanType, vulnerabilitiesCount: selectedVulnerabilities.length });
    
    // Save scan parameters for potential retry
    setLastScanParams({ url, scanType, selectedVulnerabilities });
    
    // Reset any previous errors
    setError(null);
    setScanResults(null);
    setIsScanning(true);
    
    try {
      // Using apiClient instead of axios - no need to handle tokens manually
      console.log('Sending scan request to: /api/scan');
      const response = await apiClient.post('/api/scan', { 
        url, 
        scanType,
        vulnerabilities: selectedVulnerabilities 
      });
      
      console.log('Scan API response received:', {
        status: response.status,
        dataSize: JSON.stringify(response.data).length
      });
      
      handleScanResults(response.data);
    } catch (error) {
      console.error("Scan error:", error.response?.data || error.message);
      setIsScanning(false);
      
      // Set appropriate error message based on error type
      if (isNetworkError(error)) {
        setError({
          type: 'network',
          title: 'Network Error',
          message: 'Unable to connect to our servers. Please check your internet connection and try again.',
          solutions: [
            'Check your internet connection',
            'Ensure firewall is not blocking the request',
            'Try again in a few minutes'
          ]
        });
      } else {
        setError({
          type: 'api',
          title: 'Server Error',
          message: getErrorMessage(error) || 'An unexpected error occurred. Our team has been notified. Please try again later.',
          solutions: [
            'Try again in a few minutes',
            'Check if the URL is accessible',
            'Contact support if the issue persists'
          ]
        });
      }
    }
  };

  const handleRetry = () => {
    if (lastScanParams) {
      const { url, scanType, selectedVulnerabilities } = lastScanParams;
      handleScan(url, scanType, selectedVulnerabilities);
    }
  };

  // Define component styles with better responsiveness
  const containerStyle = {
    py: { xs: 2, md: 4 },
    position: 'relative',
    minHeight: '100vh',
    background: darkMode 
      ? 'linear-gradient(135deg, #111, #1a1a2e)'
      : 'radial-gradient(circle, #f5f7fa, #e4e8f0)',
    overflow: 'hidden' // Prevent background elements from causing horizontal scroll
  };

  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    opacity: 0.03,
    zIndex: 0,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    pointerEvents: 'none'
  };

  const contentWrapperStyle = {
    position: 'relative', 
    zIndex: 1,
    // Only apply backdrop filter on non-mobile devices
    backdropFilter: isMobile ? 'none' : 'blur(8px)',
    WebkitBackdropFilter: isMobile ? 'none' : 'blur(8px)', // For Safari support
  };

  const cardStyle = {
    mb: 6, 
    p: { xs: 2, md: 4 },
    borderRadius: '24px',
    backgroundColor: darkMode 
      ? isMobile ? 'rgba(30, 41, 59, 0.95)' : 'rgba(30, 41, 59, 0.7)'  
      : isMobile ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)',
    boxShadow: darkMode
      ? '0 8px 24px rgba(0, 0, 0, 0.2)'
      : '0 8px 24px rgba(0, 0, 0, 0.06)',
    border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)'}`,
    transition: 'all 0.3s ease',
    // Only apply backdrop filter on non-mobile devices
    backdropFilter: isMobile ? 'none' : 'blur(10px)',
    WebkitBackdropFilter: isMobile ? 'none' : 'blur(10px)', // For Safari support
  };

  const resultsCardStyle = {
    ...cardStyle,
    overflow: 'hidden' // Prevent content overflow
  };

  // Enhanced error UI styles
  const getErrorStyles = () => {
    const isNetworkErr = error?.type === 'network';
    
    return {
      cardStyle: {
        ...cardStyle,
        border: `1px solid ${isNetworkErr 
          ? darkMode ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 193, 7, 0.5)'
          : darkMode ? 'rgba(244, 67, 54, 0.3)' : 'rgba(244, 67, 54, 0.5)'
        }`,
        overflow: 'hidden',
      },
      gradientBanner: {
        height: '8px',
        width: '100%',
        background: isNetworkErr
          ? 'linear-gradient(90deg, #FFC107 0%, #FF9800 100%)'
          : 'linear-gradient(90deg, #F44336 0%, #E91E63 100%)',
      },
      iconBg: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: isNetworkErr
          ? darkMode 
            ? 'rgba(255, 193, 7, 0.15)'
            : 'rgba(255, 193, 7, 0.1)'
          : darkMode
            ? 'rgba(244, 67, 54, 0.15)'
            : 'rgba(244, 67, 54, 0.1)',
        margin: '0 auto',
        mb: 3,
      },
      icon: {
        fontSize: '40px',
        color: isNetworkErr ? '#FFC107' : '#F44336',
      },
      solutionBox: {
        mt: 3,
        p: 2,
        borderRadius: '12px',
        backgroundColor: darkMode 
          ? 'rgba(0, 0, 0, 0.2)'
          : 'rgba(0, 0, 0, 0.03)',
        border: `1px solid ${darkMode 
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.05)'
        }`,
      },
      solutionItem: {
        display: 'flex',
        alignItems: 'flex-start',
        mb: 1.5,
      },
      helpIcon: {
        fontSize: '16px',
        mr: 1,
        mt: 0.5,
        color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
      },
      button: {
        py: 1.5,
        px: 4,
        mt: 3,
        boxShadow: isNetworkErr
          ? '0 4px 14px rgba(255, 152, 0, 0.3)'
          : '0 4px 14px rgba(233, 30, 99, 0.3)',
        background: isNetworkErr
          ? 'linear-gradient(45deg, #FFC107, #FF9800)'
          : 'linear-gradient(45deg, #F44336, #E91E63)',
        borderRadius: '12px',
        color: '#fff',
        fontWeight: 600,
        textTransform: 'none',
        '&:hover': {
          background: isNetworkErr
            ? 'linear-gradient(45deg, #FFB300, #FB8C00)'
            : 'linear-gradient(45deg, #E53935, #D81B60)',
          transform: 'translateY(-2px)',
          boxShadow: isNetworkErr
            ? '0 6px 18px rgba(255, 152, 0, 0.4)'
            : '0 6px 18px rgba(233, 30, 99, 0.4)',
        },
      }
    };
  };

  // Only compute error styles when there's an error
  const errorStyles = error ? getErrorStyles() : {};

  return (
    <Container maxWidth="lg" sx={containerStyle}>
      {/* Background elements - only show on non-mobile */}
      {!isMobile && <Box sx={backgroundStyle} />}
      
      <Box sx={contentWrapperStyle}>
        {/* Header Section */}
        <Header />
        
        {/* Security Scanner Section */}
        <Box sx={cardStyle}>
          {/* Scan Form Component */}
          <ScanForm 
            isScanning={isScanning} 
            onScan={handleScan}
          />
        </Box>
        
        {/* Error Message (conditionally rendered with improved UI) */}
        <Fade in={!!error} timeout={800}>
          <Box sx={error ? errorStyles.cardStyle : {}} ref={resultsRef}>
            {error && (
              <>
                {/* Colored gradient banner */}
                <Box sx={errorStyles.gradientBanner} />
                
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                  {/* Error icon */}
                  <Box sx={errorStyles.iconBg}>
                    {error.type === 'network' ? (
                      <WifiOffIcon sx={errorStyles.icon} />
                    ) : (
                      <ErrorOutlineIcon sx={errorStyles.icon} />
                    )}
                  </Box>
                  
                  {/* Error title and message */}
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    fontWeight="600" 
                    textAlign="center"
                    sx={{ mb: 2 }}
                  >
                    {error.title}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    textAlign="center" 
                    sx={{ 
                      opacity: 0.8,
                      maxWidth: '600px',
                      mx: 'auto',
                    }}
                  >
                    {error.message}
                  </Typography>
                  
                  {/* Solutions */}
                  <Box sx={errorStyles.solutionBox}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Suggested solutions:
                    </Typography>
                    
                    {error.solutions?.map((solution, index) => (
                      <Box key={index} sx={errorStyles.solutionItem}>
                        <HelpOutlineIcon sx={errorStyles.helpIcon} />
                        <Typography variant="body2">
                          {solution}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  {/* Retry button */}
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      variant="contained" 
                      onClick={handleRetry}
                      startIcon={<ReplayIcon />}
                      sx={errorStyles.button}
                    >
                      Retry Scan
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Fade>
        
        {/* Scan Results Component (conditionally rendered) */}
        {scanResults && (
          <Box sx={resultsCardStyle}>
            <ScanResults 
              ref={resultsRef}
              results={scanResults}
            />
          </Box>
        )}

        {/* OWASP Top 10 Section */}
        <VulnerabilityList />
      </Box>
    </Container>
  );
};

export default HomePage;