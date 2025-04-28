import React, { useState, useEffect, useMemo } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, FormGroup, FormControlLabel, Checkbox,
  Grid, Typography, InputAdornment, TextField,
  Divider, Box, Chip, useTheme, IconButton,
  Tooltip, alpha
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const CustomScanModal = ({ open, onClose, onSubmit, vulnerabilities = [] }) => {
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  
  // Reset selected vulnerabilities when modal opens
  useEffect(() => {
    if (open) {
      setSelected([]);
      setSearchTerm('');
    }
  }, [open]);
  
  // Memoize filtered vulnerabilities to improve performance
  const filteredVulnerabilities = useMemo(() => {
    return vulnerabilities.filter(vuln => 
      (vuln.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      (vuln.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [vulnerabilities, searchTerm]);

  // Memoize grouped vulnerabilities for better performance
  const groupedVulnerabilities = useMemo(() => {
    return filteredVulnerabilities.reduce((acc, vuln) => {
      const category = vuln.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(vuln);
      return acc;
    }, {});
  }, [filteredVulnerabilities]);
  
  const handleToggle = (apiName) => {
    if (!apiName) return;
    
    setSelected(prev => 
      prev.includes(apiName)
        ? prev.filter(name => name !== apiName)
        : [...prev, apiName]
    );
  };
  
  const handleSelectAll = () => {
    const validVulnerabilities = filteredVulnerabilities.filter(v => v.apiName);
    const validApiNames = validVulnerabilities.map(v => v.apiName);
    
    if (selected.length === validApiNames.length && 
        validApiNames.every(name => selected.includes(name))) {
      setSelected([]);
    } else {
      setSelected(validApiNames);
    }
  };
  
  const handleSubmit = () => {
    onSubmit(selected);
    onClose(); // Close modal after submission
  };

  // Calculate if all filtered items are selected
  const areAllSelected = useMemo(() => {
    const validApiNames = filteredVulnerabilities
      .filter(v => v.apiName)
      .map(v => v.apiName);
    
    return validApiNames.length > 0 && 
           validApiNames.every(name => selected.includes(name));
  }, [filteredVulnerabilities, selected]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          backgroundImage: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(20, 24, 42, 0.9), rgba(10, 14, 30, 0.9))'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 245, 255, 0.9))',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(255, 255, 255, 0.7)'}`,
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        pt: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SecurityIcon 
            sx={{ 
              mr: 1, 
              color: theme.palette.primary.main,
              fontSize: 28
            }} 
          />
          <Typography variant="h5" component="div" sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Custom Vulnerability Scan
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Select specific vulnerabilities to include in your scan for a more targeted assessment
        </Typography>
        
        <IconButton 
          aria-label="close" 
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider sx={{ mx: 3 }} />
      
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <TextField
            placeholder="Search vulnerabilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ 
              width: { xs: '100%', sm: '300px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: alpha(theme.palette.background.paper, 0.5),
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          
          <Box>
            <Button 
              variant="outlined" 
              onClick={handleSelectAll}
              size="small"
              disabled={filteredVulnerabilities.filter(v => v.apiName).length === 0}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              {areAllSelected ? 'Deselect All' : 'Select All'}
            </Button>
            
            {selected.length > 0 && (
              <Chip
                label={`${selected.length} selected`}
                color="primary"
                size="small"
                variant="outlined"
                sx={{ 
                  ml: 1,
                  borderRadius: '8px',
                  '& .MuiChip-label': {
                    fontWeight: 500
                  }
                }}
              />
            )}
          </Box>
        </Box>
        
        <Box sx={{
          maxHeight: '400px',
          overflowY: 'auto',
          pr: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: alpha(theme.palette.background.paper, 0.3),
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.5),
            }
          }
        }}>
          {vulnerabilities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1">No vulnerabilities available</Typography>
            </Box>
          ) : Object.keys(groupedVulnerabilities).length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1">No vulnerabilities match your search</Typography>
            </Box>
          ) : (
            <FormGroup>
              {Object.entries(groupedVulnerabilities).map(([category, vulns]) => (
                <Box key={category} sx={{ mb: 3 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      color: theme.palette.primary.main
                    }}
                  >
                    {category}
                  </Typography>
                  <Grid container spacing={2}>
                    {vulns.map((vuln) => (
                      vuln.apiName ? (
                        <Grid item xs={12} sm={6} md={4} key={vuln.id || vuln.apiName}>
                          <Box 
                            sx={{ 
                              p: 1.5, 
                              borderRadius: '10px',
                              border: `1px solid ${selected.includes(vuln.apiName) 
                                ? theme.palette.primary.main 
                                : alpha(theme.palette.divider, 0.5)}`,
                              backgroundColor: selected.includes(vuln.apiName) 
                                ? alpha(theme.palette.primary.main, 0.1) 
                                : alpha(theme.palette.background.paper, 0.3),
                              transition: 'all 0.2s',
                              '&:hover': {
                                backgroundColor: selected.includes(vuln.apiName) 
                                  ? alpha(theme.palette.primary.main, 0.15) 
                                  : alpha(theme.palette.background.paper, 0.5),
                                borderColor: selected.includes(vuln.apiName) 
                                  ? theme.palette.primary.main 
                                  : theme.palette.primary.light,
                              }
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox 
                                  checked={selected.includes(vuln.apiName)}
                                  onChange={() => handleToggle(vuln.apiName)}
                                  color="primary"
                                  sx={{ p: 0.5, mr: 1 }}
                                />
                              }
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1 }}>
                                    {vuln.title || 'Untitled'}
                                  </Typography>
                                  
                                  {vuln.description && (
                                    <Tooltip title={vuln.description} arrow placement="top">
                                      <IconButton size="small" sx={{ ml: 0.5 }}>
                                        <InfoOutlinedIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Box>
                              }
                              sx={{ 
                                m: 0, 
                                width: '100%', 
                                alignItems: 'flex-start'
                              }}
                            />
                          </Box>
                        </Grid>
                      ) : null
                    ))}
                  </Grid>
                </Box>
              ))}
            </FormGroup>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={selected.length === 0}
          sx={{ 
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
            background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
          }}
        >
          Apply Selection ({selected.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomScanModal;