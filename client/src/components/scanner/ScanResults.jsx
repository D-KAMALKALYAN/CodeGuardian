import React, { forwardRef } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Button,
  Chip, Divider, Fade, useMediaQuery, useTheme
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RecommendIcon from '@mui/icons-material/Recommend';
import LinkIcon from '@mui/icons-material/Link';

// Import the enhanced generatePDF function
import { generatePDFReport } from '../utils/generatePDF';

const ScanResults = forwardRef(({ results }, ref) => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const handleDownloadPDF = () => {
    if (!results) return;
    // Call the enhanced generatePDF function with the results
    generatePDFReport(results);
  };
  
  return (
    <Fade in={true} timeout={500}>
      <Box 
        ref={ref}
        id="scan-results" 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3
        }}>
          <Typography variant="h5" component="h3" sx={{ 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Scan Results
          </Typography>
          
          <Chip 
            icon={<LinkIcon sx={{ fontSize: 16 }} />}
            label={results.url} 
            variant="outlined"
            color="primary"
            sx={{ 
              borderRadius: '8px',
              '& .MuiChip-label': {
                px: 1,
                fontSize: '0.9rem'
              }
            }}
          />
        </Box>
        
        <Box sx={{ 
          mb: 4,
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(0, 0, 0, 0.2)' 
            : 'rgba(255, 255, 255, 0.5)',
          p: { xs: 2, sm: 3 },
          borderRadius: '16px',
          border: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.05)'}`,
        }}>
          <Typography 
            variant="h6" 
            component="h4" 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              color: results.detectedVulnerabilities.length > 0 
                ? theme.palette.error.main 
                : theme.palette.success.main
            }}
          >
            {results.detectedVulnerabilities.length > 0 ? (
              <ErrorOutlineIcon sx={{ mr: 1 }} />
            ) : (
              <CheckCircleOutlineIcon sx={{ mr: 1 }} />
            )}
            Security Status:
          </Typography>
          
          {results.detectedVulnerabilities.length > 0 ? (
            <Box sx={{ 
              pl: 2,
              borderLeft: '4px solid',
              borderColor: 'error.main',
              mt: 2
            }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Detected {results.detectedVulnerabilities.length} vulnerabilities:
              </Typography>
              <Grid container spacing={2}>
                {results.detectedVulnerabilities.map((vuln, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card sx={{ 
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                      border: '1px solid rgba(211, 47, 47, 0.3)',
                      boxShadow: 'none',
                      borderRadius: '12px'
                    }}>
                      <CardContent sx={{ py: 1.5, px: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {vuln}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Card sx={{ 
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              border: '1px solid rgba(46, 125, 50, 0.3)',
              boxShadow: 'none',
              borderRadius: '12px'
            }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 500 }}>
                  Your website passed all security checks.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            component="h4" 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RecommendIcon sx={{ mr: 1 }} /> Recommendations:
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.keys(results.recommendations).map((key) => (
              <Grid item xs={12} md={6} key={key}>
                <Card sx={{ 
                  height: '100%',
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(0, 0, 0, 0.2)' 
                    : 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '12px',
                  border: `1px solid ${theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.05)'}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {results.recommendations[key]?.message}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.03)',
                      p: 1.5,
                      borderRadius: '8px',
                      border: `1px solid ${theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(0, 0, 0, 0.05)'}`,
                    }}>
                      <strong>Remediation:</strong> {results.recommendations[key]?.remediation}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleDownloadPDF}
            startIcon={<DownloadIcon />}
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1.5,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
              },
              background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
            }}
          >
            Download Full Report (PDF)
          </Button>
        </Box>
      </Box>
    </Fade>
  );
});

export default ScanResults;