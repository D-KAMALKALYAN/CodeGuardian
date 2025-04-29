import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  useTheme, 
  useMediaQuery, 
  Paper,
  Chip,
  Grow,
  Slide,
  Fade
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SearchIcon from '@mui/icons-material/Search';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BuildIcon from '@mui/icons-material/Build';
import SendIcon from '@mui/icons-material/Send';
import DeveloperSection from './DeveloperSection'; // Import the new component

const AboutPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const FeatureCard = ({ title, description, icon, index }) => (
    <Grow in={true} timeout={(index + 1) * 300} style={{ transformOrigin: '0 0 0' }}>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            {icon}
            <Typography variant="h5" component="h3" ml={1} fontWeight="600">
              {title}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );

  const ApproachStep = ({ title, description, icon, index }) => (
    <Slide direction="right" in={true} timeout={(index + 1) * 300}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center', 
          mb: 3,
          p: 2,
          borderRadius: '8px',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255,255,255,0.05)' 
            : 'rgba(25,118,210,0.05)',
        }}
      >
        <Box 
          sx={{ 
            mr: isMobile ? 0 : 2, 
            mb: isMobile ? 1 : 0,
            p: 1.5,
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" component="h3" fontWeight="600">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>
    </Slide>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Fade in={true} timeout={1000}>
        <Box 
          component={Paper} 
          elevation={0}
          sx={{ 
            borderRadius: '16px',
            overflow: 'hidden',
            mb: 6,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(29, 38, 113, 0.8) 0%, rgba(45, 139, 236, 0.8) 100%)' 
              : 'linear-gradient(135deg, #1976d2 0%, #1a237e 100%)',
            py: { xs: 4, md: 6 },
            px: { xs: 2, md: 4 },
            position: 'relative',
          }}
        >
          <Box 
            position="absolute" 
            top={0} 
            left={0} 
            right={0} 
            bottom={0}
            sx={{
              background: 'url(https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.1,
              mixBlendMode: 'overlay'
            }}
          />
          
          <Box position="relative" textAlign="center">
            <Typography 
              variant={isMobile ? 'h4' : 'h2'} 
              component="h1" 
              fontWeight="bold" 
              color="white" 
              mb={2}
            >
              Web Application Security Intelligence
            </Typography>
            <Typography 
              variant={isMobile ? 'subtitle1' : 'h5'} 
              component="p" 
              color="white" 
              mb={4}
              sx={{ maxWidth: '800px', mx: 'auto', opacity: 0.9 }}
            >
              Empowering Developers with Comprehensive Vulnerability Insights
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              sx={{ 
                borderRadius: '30px', 
                px: 4, 
                py: 1.5,
                backgroundColor: '#ffffff',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                }
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Fade>

      <Fade in={true} timeout={1200}>
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
            Our Mission
          </Typography>
          <Box mt={4}>
            <Typography 
              variant="body1" 
              textAlign="center" 
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto', 
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.7
              }}
            >
              To provide cutting-edge security intelligence and proactive vulnerability 
              detection for web applications, enabling organizations to identify, 
              understand, and mitigate potential security risks before they can be exploited.
              Our platform continuously evolves to address emerging threats, ensuring your 
              applications stay protected in an ever-changing security landscape.
            </Typography>
          </Box>
        </Box>
      </Fade>

      <Divider sx={{ my: 6 }} />

      <Box mb={8}>
        <Typography 
          variant="h4" 
          component="h2" 
          textAlign="center" 
          mb={4}
          fontWeight="600"
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              title="Comprehensive Scanning" 
              description="Advanced detection mechanisms for OWASP Top 10 vulnerabilities with continuous updates for emerging threat patterns."
              icon={<SecurityIcon color="primary" fontSize="large" />}
              index={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              title="Real-time Analysis" 
              description="Instant vulnerability identification and risk assessment with dynamic scoring based on exploitability and impact."
              icon={<SpeedIcon color="primary" fontSize="large" />}
              index={1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard 
              title="Detailed Reporting" 
              description="Comprehensive reports with actionable security recommendations and prioritized remediation strategies."
              icon={<AssessmentIcon color="primary" fontSize="large" />}
              index={2}
            />
          </Grid>
        </Grid>
      </Box>

      <Fade in={true} timeout={1400}>
        <Box 
          component={Paper} 
          elevation={1}
          sx={{
            borderRadius: '16px',
            p: { xs: 3, md: 5 },
            mb: 8,
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(30, 30, 30, 0.7)' 
              : 'rgba(250, 250, 250, 0.9)'
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            textAlign="center" 
            mb={4}
            fontWeight="600"
          >
            Our Approach
          </Typography>
          <Box mt={4}>
            <ApproachStep 
              title="Discovery" 
              description="Comprehensive web application vulnerability identification using static analysis, dynamic testing, and behavior monitoring."
              icon={<SearchIcon />}
              index={0}
            />
            <ApproachStep 
              title="Analysis" 
              description="In-depth risk assessment and vulnerability classification with contextual understanding of your application architecture."
              icon={<AnalyticsIcon />}
              index={1}
            />
            <ApproachStep 
              title="Recommendation" 
              description="Strategic mitigation strategies and remediation guidance tailored to your development workflow and technology stack."
              icon={<BuildIcon />}
              index={2}
            />
          </Box>
        </Box>
      </Fade>

      <Fade in={true} timeout={1600}>
        <Box mb={8}>
          <Typography 
            variant="h4" 
            component="h2" 
            textAlign="center" 
            mb={4}
            fontWeight="600"
          >
            Technology Stack
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center',
              gap: 2,
              px: { xs: 1, md: 4 }
            }}
          >
            {[
              'HTML5', 'CSS3', 'React', 'Node.js', 'Express.js', 'MongoDB', 
              'Python', 'TensorFlow', 'Docker', 'Kubernetes', 'Redis'
            ].map((tech, index) => (
              <Grow
                key={tech}
                in={true}
                timeout={(index + 1) * 200}
                style={{ transformOrigin: 'center' }}
              >
                <Chip
                  label={tech}
                  color={tech === 'React' ? 'primary' : 'default'}
                  sx={{ 
                    px: 2, 
                    py: 3,
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      color: '#fff'
                    }
                  }}
                />
              </Grow>
            ))}
          </Box>
        </Box>
      </Fade>

      {/* Add the Developer Section here */}
      <DeveloperSection />

      <Fade in={true} timeout={1800}>
        <Box 
          textAlign="center" 
          py={6} 
          sx={{
            borderRadius: '16px',
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(45, 139, 236, 0.1)' 
              : 'rgba(25, 118, 210, 0.05)',
            p: { xs: 3, md: 5 }
          }}
        >
          <Typography variant="h4" component="h2" mb={2} fontWeight="600">
            Get In Touch
          </Typography>
          <Typography 
            variant="body1" 
            mb={4} 
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Need more information about web application security? 
            Our team of security experts is ready to help you secure your applications.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            endIcon={<SendIcon />}
            sx={{ borderRadius: '30px', px: 4 }}
          >
            Contact Us
          </Button>
        </Box>
      </Fade>
    </Container>
  );
};

export default AboutPage;