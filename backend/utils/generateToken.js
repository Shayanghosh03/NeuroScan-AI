const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const userId = user._id ? user._id.toString() : (user.id || `usr-${Date.now()}`);
  const payload = {
    id: userId,
    email: user.email,
    name: user.name,
    role: user.role || 'Radiologist',
    hospital: user.hospital || 'Metropolitan Neurological Institute',
    department: user.department || 'Diagnostic Imaging',
    avatar: user.avatar
  };

  const secret = process.env.JWT_SECRET || 'neuroscan-jwt-secret-2026';
  const expiresIn = process.env.JWT_EXPIRE || '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = generateToken;