import React, { useContext, useEffect, useRef } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Box, Typography, useMediaQuery } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BugReportIcon from '@mui/icons-material/BugReport';

const Header = () => {
  const { darkMode } = useContext(ThemeContext);
  const isMobile = useMediaQuery('(max-width:600px)');
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Modern network security animation
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create canvas for animation
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0.2';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    
    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = containerRef.current.offsetWidth;
      canvas.height = containerRef.current.offsetHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    const ctx = canvas.getContext('2d');
    
    // Create nodes and connections
    const nodeCount = 20;
    const nodes = [];
    const connectionDistance = 100;
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        pulse: 0,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        isSecurity: Math.random() > 0.7 // 30% chance to be a security node
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            
            // Color based on security status
            if (nodes[i].isSecurity || nodes[j].isSecurity) {
              ctx.strokeStyle = darkMode 
                ? `rgba(73, 207, 255, ${1 - distance / connectionDistance})` 
                : `rgba(0, 150, 255, ${1 - distance / connectionDistance})`;
            } else {
              ctx.strokeStyle = darkMode 
                ? `rgba(255, 255, 255, ${(1 - distance / connectionDistance) * 0.5})` 
                : `rgba(255, 255, 255, ${(1 - distance / connectionDistance) * 0.7})`;
            }
            
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      // Update and draw nodes
      nodes.forEach(node => {
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Update pulse
        node.pulse += node.pulseSpeed;
        if (node.pulse > 1) node.pulse = 0;
        
        // Draw security pulse
        if (node.isSecurity) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 10 * node.pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'transparent';
          ctx.strokeStyle = darkMode 
            ? `rgba(73, 207, 255, ${1 - node.pulse})` 
            : `rgba(0, 150, 255, ${1 - node.pulse})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.isSecurity 
          ? (darkMode ? '#49cfff' : '#0096ff')
          : (darkMode ? '#ffffff' : '#ffffff');
        ctx.fill();
      });
      
      // Add shield scan effect
      const time = Date.now() * 0.001;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 50 + Math.sin(time) * 20, 0, Math.PI * 2);
      ctx.strokeStyle = darkMode 
        ? `rgba(73, 207, 255, ${0.1 + Math.sin(time * 2) * 0.05})` 
        : `rgba(0, 150, 255, ${0.15 + Math.sin(time * 2) * 0.05})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [darkMode]);
  
  return (
    <Box 
      ref={containerRef}
      sx={{ 
        textAlign: 'center', 
        mb: { xs: 4, md: 6 },
        background: darkMode 
          ? 'linear-gradient(135deg, rgba(13, 21, 36, 0.9) 0%, rgba(25, 48, 115, 0.9) 100%)' 
          : 'linear-gradient(135deg, rgba(43, 115, 246, 0.9) 0%, rgba(28, 72, 180, 0.9) 100%)',
        borderRadius: '24px',
        p: { xs: 3, md: 5 },
        boxShadow: darkMode
          ? '0 15px 40px rgba(0, 0, 0, 0.4), 0 0 2px rgba(0, 0, 0, 0.6) inset'
          : '0 15px 40px rgba(0, 0, 0, 0.15), 0 0 2px rgba(255, 255, 255, 0.8) inset',
        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.4)'}`,
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
        transition: 'all 0.3s ease'
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: 1,
          position: 'relative'
        }}>
          {/* Animated shield glow effect */}
          <Box sx={{
            position: 'absolute',
            width: { xs: '60px', md: '70px' },
            height: { xs: '60px', md: '70px' },
            borderRadius: '50%',
            background: darkMode ? 'rgba(73, 207, 255, 0.15)' : 'rgba(0, 150, 255, 0.15)',
            filter: 'blur(15px)',
            animation: 'pulse 3s infinite',
            left: { xs: 'calc(50% - 90px)', md: 'calc(50% - 104px)' },
            top: '50%',
            transform: 'translateY(-50%)',
          }} />
          
          <ShieldIcon sx={{ 
            fontSize: { xs: 40, md: 54 }, 
            mr: 2,
            color: darkMode ? 'rgba(255, 255, 255, 0.95)' : 'white',
            filter: 'drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.3))',
            animation: 'float 6s ease-in-out infinite',
            position: 'relative',
            zIndex: 2
          }} />
          
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 800,
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.2rem' },
            background: 'linear-gradient(to right, #ffffff, #e6e9f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0px 3px 6px rgba(0, 0, 0, 0.4)',
            letterSpacing: '-0.02em',
            fontFamily: '"Poppins", "Roboto", sans-serif',
            position: 'relative'
          }}>
            CodeGuardian
            {/* <Box component="span" sx={{ 
              position: 'absolute', 
              top: -5, 
              right: -15, 
              fontSize: '0.4em',
              fontWeight: 600,
              background: darkMode ? 'rgba(73, 207, 255, 0.9)' : 'rgba(0, 150, 255, 0.9)',
              color: 'white',
              px: 1,
              py: 0.2,
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              fontFamily: '"Inter", sans-serif'
            }}>
              Pro
            </Box> */}
          </Typography>
        </Box>
        
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          fontSize: { xs: '1.1rem', sm: '1.3rem' },
          color: 'rgba(255, 255, 255, 0.9)',
          maxWidth: '700px',
          mx: 'auto',
          mb: 2,
          letterSpacing: '0.01em',
          textShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)'
        }}>
          Advanced Web Application Vulnerability Scanner
        </Typography>
        
        <Typography variant="body1" sx={{ 
          color: 'rgba(255, 255, 255, 0.8)',
          maxWidth: '650px',
          mx: 'auto',
          fontSize: { xs: '0.9rem', sm: '1.05rem' },
          lineHeight: 1.6,
          mb: 3
        }}>
          Protect your web applications with comprehensive scanning for OWASP Top 10 vulnerabilities,
          SANS 25 critical risks, and other security threats using our state-of-the-art detection engine
        </Typography>
        
        {/* Security Feature Pills */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          justifyContent: 'center',
          mt: 1
        }}>
          <SecurityPill icon={<BugReportIcon />} label="OWASP Top 10" darkMode={darkMode} />
          <SecurityPill icon={<SecurityIcon />} label="SANS 25" darkMode={darkMode} />
          <SecurityPill icon={<VerifiedUserIcon />} label="API Security" darkMode={darkMode} />
          <SecurityPill icon={<ShieldIcon />} label="Zero-Day Detection" darkMode={darkMode} />
        </Box>
      </Box>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: translateY(-50%) scale(0.9); opacity: 0.6; }
          50% { transform: translateY(-50%) scale(1.1); opacity: 0.9; }
          100% { transform: translateY(-50%) scale(0.9); opacity: 0.6; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes slide {
          0% { transform: translateX(-10px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

// Modern security pill component
const SecurityPill = ({ icon, label, darkMode }) => (
  <Box sx={{
    display: 'inline-flex',
    alignItems: 'center',
    px: 2,
    py: 0.6,
    borderRadius: '20px',
    background: darkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(255, 255, 255, 0.2)',
    border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.35)'}`,
    backdropFilter: 'blur(4px)',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: 500,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    animation: 'slide 0.5s ease-out forwards',
    animationDelay: '0.2s',
    opacity: 0,
    '&:hover': {
      background: darkMode 
        ? 'rgba(73, 207, 255, 0.2)' 
        : 'rgba(0, 150, 255, 0.25)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }
  }}>
    <Box sx={{ 
      mr: 0.5, 
      opacity: 0.9,
      fontSize: 16,
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    {label}
  </Box>
);

export default Header;