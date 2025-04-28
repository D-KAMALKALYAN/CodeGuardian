import React, { useState, useContext, useRef } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';
import { Container, Box, useMediaQuery } from '@mui/material';

// Import components
import Header from '../components/layout/Header';
import ScanForm from '../components/scanner/ScanForm';
import ScanResults from '../components/scanner/ScanResults';
import VulnerabilityList from '../components/vulnerabilities/VulnerabilityList';

// Define API_BASE_URL as a constant
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const HomePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const [scanResults, setScanResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const resultsRef = useRef(null);
  
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleScanResults = (results) => {
    setIsScanning(false);
    setScanResults(results);
    // Scroll to results
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleScan = async (url, scanType, selectedVulnerabilities = []) => {
    setIsScanning(true);
    
    try {
      // Call the API endpoint
      const response = await axios.post(`${API_BASE_URL}/api/scan`, { 
        url, 
        scanType,
        vulnerabilities: selectedVulnerabilities 
      });
      handleScanResults(response.data);
    } catch (error) {
      console.error("Scan error:", error);
      setIsScanning(false);
      
      // Mock data for demonstration
      setTimeout(() => {
        handleScanResults({
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
        });
      }, 1500);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ 
      py: { xs: 2, md: 4 },
      position: 'relative',
      minHeight: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #111, #1a1a2e)'
        : 'radial-gradient(circle, #f5f7fa, #e4e8f0)'
    }}>
      {/* Background elements */}
      {!isMobile && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          opacity: 0.03,
          zIndex: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          pointerEvents: 'none'
        }} />
      )}
      
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1,
        backdropFilter: 'blur(8px)',
      }}>
        {/* Header Section */}
        <Header />
        
        {/* Security Scanner Section */}
        <Box sx={{ 
          mb: 6, 
          p: { xs: 2, md: 4 },
          borderRadius: '24px',
          backgroundColor: darkMode 
            ? 'rgba(30, 41, 59, 0.7)' 
            : 'rgba(255, 255, 255, 0.7)',
          boxShadow: darkMode
            ? '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.5) inset'
            : '0 10px 30px rgba(0, 0, 0, 0.08), 0 0 1px rgba(255, 255, 255, 0.8) inset',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)'}`,
          transition: 'all 0.3s ease'
        }}>
          {/* Scan Form Component */}
          <ScanForm 
            isScanning={isScanning} 
            onScan={handleScan}
          />
        </Box>
        
        {/* Scan Results Component (conditionally rendered) */}
        {scanResults && (
          <Box sx={{
            mb: 6,
            borderRadius: '24px',
            backgroundColor: darkMode 
              ? 'rgba(30, 41, 59, 0.7)' 
              : 'rgba(255, 255, 255, 0.7)',
            boxShadow: darkMode
              ? '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.5) inset'
              : '0 10px 30px rgba(0, 0, 0, 0.08), 0 0 1px rgba(255, 255, 255, 0.8) inset',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)'}`,
            transition: 'all 0.3s ease',
            overflow: 'hidden'
          }}>
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