import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Fade,
  Stack,
  Divider,
  useTheme,
  Tooltip,
  Snackbar,
  IconButton,
  useMediaQuery
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';

const DeveloperSection = () => {
  const theme = useTheme();
  const emailAddress = "kamalkalyan1260@gmail.com";
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);
  const emailRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMailClick = () => {
    // Show the email when clicked
    setEmailVisible(true);
  };

  const handleCopyEmail = (e) => {
    e.stopPropagation(); // Prevent triggering the parent button's onClick
    navigator.clipboard.writeText(emailAddress)
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Fade in={true} timeout={1800}>
      <Box mb={8} px={2}>
        <Typography 
          variant="h4" 
          component="h2" 
          textAlign="center" 
          mb={2}
          fontWeight="600"
          sx={{
            position: 'relative',
            fontSize: { xs: '1.8rem', sm: '2.125rem' },
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '4px',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '2px'
            }
          }}
        >
          About the Developer
        </Typography>
        
        <Paper 
          elevation={3}
          sx={{ 
            p: { xs: 2, sm: 4 }, 
            mt: 4, 
            borderRadius: '16px',
            background: theme.palette.mode === 'dark' 
              ? 'rgba(30, 30, 30, 0.7)' 
              : 'rgba(250, 250, 250, 0.9)',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[6]
            }
          }}
        >
          <Box textAlign="center">
            <Typography 
              variant="h5" 
              fontWeight="500" 
              mb={2}
              sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem' } }}
            >
              D.Kamal Kalyan
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              mb={3} 
              sx={{ 
                maxWidth: '600px', 
                mx: 'auto',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Aspiring Software Development Engineer (SDE) currently working at TCS as a Software Security Analyst. Passionate about Data Structures and Algorithms (DSA), System Design, Web Development, and Fitness.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 1.5, sm: 2 }} 
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Button 
                variant="outlined" 
                onClick={handleMailClick}
                ref={emailRef}
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none',
                  width: { xs: '100%', sm: 'auto' },
                  position: 'relative',
                  pr: emailVisible ? 6 : 3
                }}
              >
                <MailOutlineIcon sx={{ mr: 1 }} />
                <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {emailVisible ? emailAddress : "Mail me here"}
                </Box>
                {emailVisible && (
                  <IconButton 
                    size="small"
                    onClick={handleCopyEmail}
                    sx={{ 
                      position: 'absolute',
                      right: 8,
                      color: theme.palette.text.secondary
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                )}
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<GitHubIcon />}
                href="https://github.com/D-KAMALKALYAN"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none',
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                GitHub
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<LinkedInIcon />}
                href="https://www.linkedin.com/in/kamalkalyan/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none',
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                LinkedIn
              </Button>
            </Stack>
            
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<DownloadIcon />}
              href="https://github.com/D-KAMALKALYAN/Resume/raw/main/KamalKalyan.dodlogi_resume.pdf"
              target="_blank"
              sx={{ 
                mt: { xs: 2, sm: 3 },
                borderRadius: '30px', 
                px: { xs: 3, sm: 4 },
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: theme.shadows[2],
                '&:hover': {
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              Download Resume
            </Button>
          </Box>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message="Email copied to clipboard!"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          sx={{
            '& .MuiSnackbarContent-root': {
              backgroundColor: theme.palette.primary.main
            }
          }}
        />
      </Box>
    </Fade>
  );
};

export default DeveloperSection;