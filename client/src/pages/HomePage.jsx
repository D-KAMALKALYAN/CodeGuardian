import React, { useState, useContext, useRef } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { HistoryContext } from '../context/HistoryContext';
import axios from 'axios';
import { Container, Box, useMediaQuery } from '@mui/material';

import API_BASE_URL from '../config/config';

// Import components
import Header from '../components/layout/Header';
import ScanForm from '../components/scanner/ScanForm';
import ScanResults from '../components/scanner/ScanResults';
import VulnerabilityList from '../components/vulnerabilities/VulnerabilityList';

// Define API_BASE_URL as a constant
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const HomePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { addScan } = useContext(HistoryContext);
  const [scanResults, setScanResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const resultsRef = useRef(null);
  
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleScanResults = (results) => {
    setIsScanning(false);
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
    setIsScanning(true);
    
    try {
      // Get the token from localStorage or wherever you store it after login
      const token = localStorage.getItem('token');
      console.log('Authenticating with token:', token ? 'Token present' : 'Token missing');
      
      // Call the API endpoint with the authorization header
      console.log('Sending scan request to:', `${API_BASE_URL}/api/scan`);
      const response = await axios.post(`${API_BASE_URL}/api/scan`, { 
        url, 
        scanType,
        vulnerabilities: selectedVulnerabilities 
      }, {
        headers: {
          'x-access-token': token
        }
      });
      
      console.log('Scan API response received:', {
        status: response.status,
        dataSize: JSON.stringify(response.data).length
      });
      
      handleScanResults(response.data);
    } catch (error) {
      console.error("Scan error:", error.response?.data || error.message);
      setIsScanning(false);
      
      // Fallback mock data
      console.log('Using fallback mock data due to API error');
      setTimeout(() => {
        const mockResults = {
          url: url,
          scanType: scanType,
          detectedVulnerabilities: [
            "XSS Vulnerability (High)",
            "SQL Injection (Critical)"
          ],
          recommendations: {
            xss: {
              message: "Cross-site scripting vulnerability detected in input forms",
              remediation: "Implement input validation and output encoding"
            },
            sql: {
              message: "SQL Injection vulnerability detected in search functionality",
              remediation: "Use parameterized queries and prepared statements"
            }
          }
        };
        
        console.log('Providing mock results:', mockResults);
        handleScanResults(mockResults);
      }, 1500);
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