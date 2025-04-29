import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Fade,
  Stack,
  Divider,
  useTheme
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DownloadIcon from '@mui/icons-material/Download';

const DeveloperSection = () => {
  const theme = useTheme();

  return (
    <Fade in={true} timeout={1800}>
      <Box mb={8}>
        <Typography 
          variant="h4" 
          component="h2" 
          textAlign="center" 
          mb={2}
          fontWeight="600"
          sx={{
            position: 'relative',
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
          elevation={2}
          sx={{ 
            p: 4, 
            mt: 4, 
            borderRadius: '16px',
            background: theme.palette.mode === 'dark' 
              ? 'rgba(30, 30, 30, 0.7)' 
              : 'rgba(250, 250, 250, 0.9)'
          }}
        >
          <Box textAlign="center">
            <Typography variant="h5" fontWeight="500" mb={2}>
              D.Kamal Kalyan
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={3} sx={{ maxWidth: '600px', mx: 'auto' }}>
            Aspiring Software Development Engineer (SDE) currently working at TCS as a Software Security Analyst. Passionate about Data Structures and Algorithms (DSA), System Design, Web Development, and Fitness.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
              sx={{ mb: 2 }}
            >
              <Button 
                variant="outlined" 
                startIcon={<MailOutlineIcon />}
                href="mailto:kamalkalyan1260@gmail.com"
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none'
                }}
              >
                Mail me here
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<GitHubIcon />}
                href="https://github.com/D-KAMALKALYAN/D-KAMALKALYAN"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none'
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
                  textTransform: 'none'
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
                mt: 2,
                borderRadius: '30px', 
                px: 4,
                textTransform: 'none'
              }}
            >
              Download Resume
            </Button>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default DeveloperSection;