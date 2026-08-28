const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'citizendoc_super_secure_jwt_secret_2026';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    // Default to demo user for seamless guest/preview experience
    req.user = { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@example.com', state: 'Maharashtra' };
    return next();
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // If token invalid, still fall back to demo user
    req.user = { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@example.com', state: 'Maharashtra' };
    next();
  }
}

module.exports = {
  authMiddleware,
  JWT_SECRET
};
