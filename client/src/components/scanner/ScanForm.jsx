import React, { useState } from 'react';
import { 
  Box, TextField, InputAdornment, Button, Alert, 
  FormControl, InputLabel, Select, MenuItem, Typography,
  useMediaQuery, Grid, Collapse, Fade
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import CoffeeIcon from '@mui/icons-material/Coffee';
import SecurityScannerIcon from '@mui/icons-material/SettingsSuggest';
import CustomScanModal from './CustomScanModal';
import { scanProfiles, allVulnerabilities } from '../data/vulnerabilitiesData';

const ScanForm = ({ isScanning, onScan }) => {
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState('owasp');
  const [openCustomModal, setOpenCustomModal] = useState(false);
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState([]);
  const [urlError, setUrlError] = useState('');
  
  const isMobile = useMediaQuery('(max-width:600px)');

  const validateUrl = (value) => {
    if (!value) {
      setUrlError('');
      return false;
    }
    
    try {
      const url = new URL(value);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        setUrlError('URL must start with http:// or https://');
        return false;
      }
      setUrlError('');
      return true;
    } catch (e) {
      setUrlError('Please enter a valid URL (e.g., https://example.com)');
      return false;
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    validateUrl(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateUrl(url)) return;
    
    if (scanType === 'custom') {
      onScan(url, scanType, selectedVulnerabilities);
    } else {
      onScan(url, scanType, scanProfiles[scanType].vulnerabilities);
    }
  };

  const handleScanTypeChange = (e) => {
    const newScanType = e.target.value;
    setScanType(newScanType);
    
    if (newScanType === 'custom') {
      setOpenCustomModal(true);
    }
  };

  const handleCustomScanSubmit = (selectedVulns) => {
    setSelectedVulnerabilities(selectedVulns);
    setOpenCustomModal(false);
  };

  // Alert messages based on scanning state
  const getAlertContent = () => {
    if (isScanning) {
      return {
        icon: <CoffeeIcon />,
        severity: "info",
        message: "Sit back and relax! Have a sip of coffee while we hunt for vulnerabilities. This scan might take a few minutes, please don't close the window.",
        style: {
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          border: '1px solid rgba(25, 118, 210, 0.3)'
        }
      };
    } else {
      return {
        icon: <WarningAmberIcon />,
        severity: "warning",
        message: "Please note: Only scan systems you are legally authorized to test.",
        style: {
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          border: '1px solid rgba(255, 152, 0, 0.3)'
        }
      };
    }
  };

  const alertContent = getAlertContent();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h2" sx={{ 
        mb: 3, 
        fontWeight: 600, 
        textAlign: 'center',
        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
        background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        Discover Your Website's Security Vulnerabilities
      </Typography>
      
      <Box sx={{ width: '100%' }}>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Row 1: URL Input */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter website URL to scan (e.g., https://example.com)..."
              value={url}
              onChange={handleUrlChange}
              error={!!urlError}
              helperText={urlError}
              disabled={isScanning}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: '12px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  '&.Mui-focused': {
                    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.15)',
                  },
                  transition: 'all 0.3s ease'
                }
              }}
            />
          </Box>
          
          {/* Row 2: Scan Type Selection */}
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="scan-type-label">Scan Type</InputLabel>
                <Select
                  labelId="scan-type-label"
                  id="scan-type-select"
                  value={scanType}
                  label="Scan Type"
                  onChange={handleScanTypeChange}
                  disabled={isScanning}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                      }
                    }
                  }}
                  sx={{
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderRadius: '12px'
                    }
                  }}
                >
                  <MenuItem value="owasp">OWASP Top 10 Scan</MenuItem>
                  <MenuItem value="sans">SANS Top 25 Scan</MenuItem>
                  <MenuItem value="advanced">Advanced Vulnerabilities Scan</MenuItem>
                  <MenuItem value="custom">Custom Scan</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            {scanType === 'custom' && selectedVulnerabilities.length > 0 && (
              <Box sx={{ width: isMobile ? '100%' : '30%' }}>
                <Button 
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => setOpenCustomModal(true)}
                  sx={{ 
                    height: '56px', 
                    borderRadius: '12px',
                    textTransform: 'none'
                  }}
                >
                  Edit Selection ({selectedVulnerabilities.length})
                </Button>
              </Box>
            )}
          </Box>
          
          <Collapse in={scanType === 'custom' && selectedVulnerabilities.length === 0}>
            <Box sx={{ mb: 3 }}>
              <Button 
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => setOpenCustomModal(true)}
                sx={{ 
                  borderRadius: '12px', 
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Select Vulnerabilities to Scan
              </Button>
            </Box>
          </Collapse>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mb: 3
          }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              size="large"
              disabled={isScanning || !url || (scanType === 'custom' && selectedVulnerabilities.length === 0) || !!urlError}
              sx={{ 
                px: 4, 
                py: 1.5, 
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                },
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateX(-100%)',
                animation: isScanning ? 'pulse 1.5s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'translateX(-100%)' },
                  '50%': { transform: 'translateX(100%)' },
                  '100%': { transform: 'translateX(100%)' }
                }
              }} />
              <SecurityScannerIcon sx={{ mr: 1 }} />
              {isScanning ? 'Scanning...' : 'Start Security Scan'}
            </Button>
          </Box>
        </form>
        
        <Fade in={true} timeout={isScanning ? 800 : 300}>
          <Alert 
            severity={alertContent.severity}
            icon={alertContent.icon}
            sx={{ 
              width: '100%', 
              borderRadius: '12px',
              ...alertContent.style,
              '& .MuiAlert-message': {
                width: '100%',
                textAlign: 'center'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {alertContent.message}
          </Alert>
        </Fade>
      </Box>
      
      <CustomScanModal 
        open={openCustomModal}
        onClose={() => setOpenCustomModal(false)}
        onSubmit={handleCustomScanSubmit}
        vulnerabilities={allVulnerabilities}
      />
    </Box>
  );
};

export default ScanForm;