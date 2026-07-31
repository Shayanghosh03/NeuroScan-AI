const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      const secret = process.env.JWT_SECRET || 'neuroscan-jwt-secret-2026';

      // Verify token
      const decoded = jwt.verify(token, secret);

      // Try fetching user from DB if connected
      let user = null;
      try {
        if (decoded.id && decoded.id.length === 24) {
          user = await User.findById(decoded.id).select('-password');
        }
      } catch (dbErr) {
        // DB lookup failure or offline
      }

      // If user not in DB, use verified JWT token payload
      if (!user) {
        user = {
          _id: decoded.id,
          id: decoded.id,
          name: decoded.name || 'Radiologist',
          email: decoded.email,
          role: decoded.role || 'Radiologist',
          hospital: decoded.hospital || '',
          department: decoded.department || 'Diagnostic Imaging',
          avatar: decoded.avatar
        };
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Auth protect middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };