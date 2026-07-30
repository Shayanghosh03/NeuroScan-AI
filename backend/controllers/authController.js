const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const passport = require('passport');
const axios = require('axios');
const bcrypt = require('bcryptjs');

// Fallback in-memory user registry for Express server
const localUserMemory = [
  {
    _id: 'usr-demo-1',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@neuroscanai.med',
    passwordRaw: 'password123',
    role: 'Radiologist',
    hospital: 'Metropolitan Neurological Institute',
    department: 'Diagnostic Imaging',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
    authProvider: 'email'
  }
];

const findUserByEmail = async (email) => {
  const normEmail = email.toLowerCase().trim();
  
  // 1. Try finding in MongoDB if connected
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const dbUser = await User.findOne({ email: normEmail }).select('+password').maxTimeMS(1500);
      if (dbUser) return dbUser;
    }
  } catch (err) {
    // DB lookup timeout or error
  }

  // 2. Check local memory registry
  const memUser = localUserMemory.find(u => u.email.toLowerCase() === normEmail);
  return memUser || null;
};

const verifyPassword = async (candidatePassword, user) => {
  if (user.comparePassword) {
    try {
      return await user.comparePassword(candidatePassword);
    } catch {
      // compare error
    }
  }
  if (user.passwordRaw) {
    return candidatePassword === user.passwordRaw;
  }
  if (user.passwordHash || user.password) {
    return await bcrypt.compare(candidatePassword, user.passwordHash || user.password);
  }
  return false;
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, hospital, department } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const userExists = await findUserByEmail(normalizedEmail);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let newUser = {
      _id: `usr-${Date.now()}`,
      name,
      email: normalizedEmail,
      passwordHash,
      passwordRaw: password,
      role: role || 'Radiologist',
      hospital: hospital || 'Metropolitan Neurological Institute',
      department: department || 'Diagnostic Imaging',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
      authProvider: 'email'
    };

    // Try saving to MongoDB if connected
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        const dbUser = await User.create({
          name,
          email: normalizedEmail,
          password,
          role: newUser.role,
          hospital: newUser.hospital,
          department: newUser.department,
          authProvider: 'email'
        });
        newUser._id = dbUser._id;
      }
    } catch (dbErr) {
      // ignore DB save error
    }

    // Always push to local memory
    localUserMemory.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        hospital: newUser.hospital,
        department: newUser.department
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for user
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Account not found. Please sign up first.' });
    }

    // Check if password matches
    const isMatch = await verifyPassword(password, user);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please check credentials.' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        hospital: user.hospital,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed', error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        hospital: user.hospital,
        department: user.department
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update current logged in user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, hospital, department, role, avatar } = req.body;
    if (name !== undefined) user.name = name;
    if (hospital !== undefined) user.hospital = hospital;
    if (department !== undefined) user.department = department;
    if (role !== undefined) user.role = role;
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        hospital: updatedUser.hospital,
        department: updatedUser.department
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  res.json({
    success: true,
    message: 'User logged out successfully'
  });
};

// @desc    Google OAuth redirect
// @route   GET /api/auth/google
// @access  Public
const googleAuth = (req, res, next) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId || clientId.includes('unconfigured') || clientId.includes('your-google-client-id')) {
    const errorMsg = encodeURIComponent('Google OAuth keys are not configured yet. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env');
    return res.redirect(`${frontendUrl}/login?error=${errorMsg}`);
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = async (req, res, next) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  passport.authenticate('google', { failureRedirect: `${frontendUrl}/login?error=GoogleAuthFailed` }, async (err, user) => {
    if (err || !user) {
      console.error('Google Callback Error:', err);
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(err?.message || 'Authentication Failed')}`);
    }

    try {
      // Generate JWT token
      const token = generateToken(user);

      // Redirect to frontend auth callback
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&userId=${user._id}`);
    } catch (error) {
      console.error(error);
      res.redirect(`${frontendUrl}/login?error=TokenGenerationFailed`);
    }
  })(req, res, next);
};

// @desc    Verify Google ID Token directly from frontend client
// @route   POST /api/auth/google/verify
// @access  Public
const verifyGoogleToken = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential token is required' });
    }

    // Verify token with Google API
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    const { sub: googleId, email, name, picture } = response.data;

    if (!email) {
      return res.status(400).json({ message: 'Unable to retrieve email from Google token' });
    }

    const userEmail = email.toLowerCase();

    // Find or create user
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email: userEmail });
      if (user) {
        user.googleId = googleId;
        if (picture) user.avatar = picture;
        user.authProvider = 'google';
        await user.save();
      } else {
        user = await User.create({
          name: name || userEmail.split('@')[0],
          email: userEmail,
          googleId,
          avatar: picture,
          authProvider: 'google',
          role: 'Radiologist',
          hospital: 'Not specified',
          department: 'Diagnostic Imaging'
        });
      }
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        hospital: user.hospital,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Google token verification error:', error?.response?.data || error.message);
    res.status(401).json({ message: 'Invalid or expired Google credential', error: error.message });
  }
};

// @desc    Generate password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address. Please verify email or sign up.'
      });
    }

    // Generate 6-digit OTP code
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetPasswordOtp = resetOtp;
    user.resetPasswordExpire = resetExpire;

    if (user.save && typeof user.save === 'function') {
      await user.save();
    }

    res.json({
      success: true,
      message: `Password reset verification code generated for ${normalizedEmail}`,
      email: normalizedEmail,
      otp: resetOtp
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error generating password reset code', error: error.message });
  }
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP code, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    // Verify OTP code
    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid 6-digit verification code. Please check OTP.' });
    }

    if (user.resetPasswordExpire && user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new code.' });
    }

    // Hash new password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;

    if (user.save && typeof user.save === 'function') {
      await user.save();
    }

    res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error resetting password', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  logout,
  googleAuth,
  googleCallback,
  verifyGoogleToken,
  forgotPassword,
  resetPassword
};