const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  logout,
  googleAuth,
  googleCallback,
  verifyGoogleToken,
  forgotPassword,
  resetPassword,
  deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);
router.delete('/account', protect, deleteAccount);
router.delete('/profile', protect, deleteAccount);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.post('/google/verify', verifyGoogleToken);

module.exports = router;