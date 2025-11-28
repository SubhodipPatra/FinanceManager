const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

/**
 * Authenticate middleware
 * Verifies JWT and attaches full user object to req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch full user from DB
    const user = await User.findByPk(decoded.id, { attributes: ['id', 'name', 'email', 'role'] });
    if (!user) return res.status(401).json({ message: 'Unauthorized: User not found' });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

/**
 * Authorize middleware
 * Checks if the authenticated user has one of the allowed roles
 * Usage: authorize('admin', 'user')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized: No user found' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: Access denied' });
  }
  next();
};

module.exports = { authenticate, authorize };
