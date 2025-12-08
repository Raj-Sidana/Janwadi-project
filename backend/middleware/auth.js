const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { 
      userId: decoded.userId,
      isAdmin: decoded.isAdmin || false
    };
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};




