const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;

  // Add more detailed logging
  console.log('Auth headers:', req.headers.authorization);

  // Check if Authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Check if token exists after extraction
      if (!token) {
        console.error('Token extraction failed - undefined or empty token');
        return res.status(401).json({ message: 'Not authorized, invalid token format' });
      }
      
      // Basic format validation
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format - not a valid JWT structure');
        return res.status(401).json({ message: 'Not authorized, invalid token format' });
      }
      
      // Log token for debugging (remove in production)
      console.log('Token extracted:', token.substring(0, 10) + '...');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Log decoded token for debugging
      console.log('Token verified, user ID:', decoded.userId);

      // Set user in request
      req.user = decoded;

      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      
      // More specific error messages
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error('No Bearer token found in Authorization header');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};