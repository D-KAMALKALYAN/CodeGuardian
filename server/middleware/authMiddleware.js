const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token;
  
  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers['x-access-token']) {
    token = req.headers['x-access-token'];
  }
  
  // If no token found
  if (!token) {
    return res.status(401).json({ 
      error: 'Not authorized, no token provided' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user data in request object
    req.user = { id: decoded.userId };
    
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ 
      error: 'Token is not valid or has expired' 
    });
  }
};