const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const token = req.header('x-access-token');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid.' });
  }
};
