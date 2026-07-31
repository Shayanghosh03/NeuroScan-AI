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
    hospital: '',
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
      hospital: hospital || '',
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
    let user = null;
    const userId = req.user._id || req.user.id;
    if (userId && typeof userId === 'string' && userId.length === 24) {
      try {
        const mongoose = require('mongoose');
        if (mongoose.connection && mongoose.connection.readyState === 1) {
          user = await User.findById(userId).maxTimeMS(2000);
        }
      } catch (err) {}
    }

    if (!user) {
      user = req.user;
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'Radiologist',
        avatar: user.avatar,
        hospital: user.hospital || '',
        department: user.department || 'Diagnostic Imaging'
      }
    });
  } catch (error) {
    console.error('getMe controller error:', error);
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
    const errorMsg = encodeURIComponent('Google OAuth keys are unconfigured in backend/.env');
    return res.redirect(`${frontendUrl}/login?error=${errorMsg}`);
  }

  res.clearCookie('connect.sid');
  res.clearCookie('ns_sid');
  passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    prompt: 'select_account',
    session: false 
  })(req, res, next);
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = async (req, res, next) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  res.clearCookie('connect.sid');
  res.clearCookie('ns_sid');

  passport.authenticate('google', { failureRedirect: `${frontendUrl}/login?error=GoogleAuthFailed`, session: false }, async (err, user) => {
    if (err || !user) {
      console.error('Google Callback Error:', err);
      const errMsg = err?.message || 'Google authentication failed';
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(errMsg)}`);
    }

    try {
      // Generate compact JWT token
      const token = generateToken(user);

      // Redirect browser to frontend origin (/auth/callback) so localStorage is set on port 5173
      res.redirect(`${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`);
    } catch (error) {
      console.error('Google callback token error:', error);
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

    let googleId, email, name, picture;

    // Verify token with Google API or decode payload
    try {
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      googleId = response.data.sub;
      email = response.data.email;
      name = response.data.name;
      picture = response.data.picture;
    } catch (apiErr) {
      console.warn('Google tokeninfo lookup warning:', apiErr.message);
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          googleId = payload.sub || `g-${Date.now()}`;
          email = payload.email;
          name = payload.name;
          picture = payload.picture;
        }
      } catch (e) {}
    }

    if (!email) {
      return res.status(400).json({ message: 'Unable to retrieve email from Google credential token' });
    }

    const userEmail = email.toLowerCase();
    const profileData = {
      id: googleId || `g-${Date.now()}`,
      displayName: name || userEmail.split('@')[0],
      emails: [{ value: userEmail }],
      photos: picture ? [{ value: picture }] : []
    };

    const user = await passport.findOrCreateGoogleUser(profileData);
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'Radiologist',
        avatar: user.avatar,
        hospital: user.hospital || '',
        department: user.department || 'Diagnostic Imaging'
      }
    });
  } catch (error) {
    console.error('Google token verification error:', error?.response?.data || error.message);
    res.status(401).json({ message: 'Invalid or expired Google credential', error: error.message });
  }
};

const localOtpStore = new Map();

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

    // Generate 6-digit OTP code as String
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store in memory OTP map
    localOtpStore.set(normalizedEmail, { otp: resetOtp, expire: resetExpire });

    // Store in user memory object
    user.resetPasswordOtp = resetOtp;
    user.resetPasswordExpire = resetExpire;

    // Update DB if connected
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        await User.updateOne(
          { email: normalizedEmail },
          { $set: { resetPasswordOtp: resetOtp, resetPasswordExpire: resetExpire } }
        );
      }
    } catch (dbErr) {
      console.warn('MongoDB OTP update notice:', dbErr.message);
    }

    console.log(`[Forgot Password] Generated OTP code for ${normalizedEmail}: ${resetOtp}`);

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

    const inputOtp = String(otp).trim();

    // Check memory OTP store first
    const memOtpObj = localOtpStore.get(normalizedEmail);
    const memOtp = memOtpObj ? String(memOtpObj.otp).trim() : null;

    // Check DB OTP if present
    let dbOtp = null;
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        const rawUser = await User.findOne({ email: normalizedEmail }).select('+resetPasswordOtp +resetPasswordExpire');
        if (rawUser && rawUser.resetPasswordOtp) {
          dbOtp = String(rawUser.resetPasswordOtp).trim();
        }
      }
    } catch (dbErr) {}

    const memoryUserOtp = user.resetPasswordOtp ? String(user.resetPasswordOtp).trim() : null;

    const isMatch = (inputOtp === memOtp) || (inputOtp === dbOtp) || (inputOtp === memoryUserOtp);

    console.log(`[Reset Password] Verifying OTP for ${normalizedEmail}. Input: "${inputOtp}", Mem: "${memOtp}", DB: "${dbOtp}", MemUser: "${memoryUserOtp}" -> Match: ${isMatch}`);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid 6-digit verification code. Please check OTP.' });
    }

    // Hash new password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;

    // Clear memory OTP
    localOtpStore.delete(normalizedEmail);

    // Update in DB if connected
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        await User.updateOne(
          { email: normalizedEmail },
          { 
            $set: { password: hashedPassword },
            $unset: { resetPasswordOtp: 1, resetPasswordExpire: 1 }
          }
        );
      }
    } catch (dbErr) {}

    res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error resetting password', error: error.message });
  }
};

// @desc    Permanently delete current user account from database
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const userIdStr = (req.user._id || req.user.id || '').toString();
    const userEmail = req.user.email ? req.user.email.toLowerCase().trim() : '';
    const googleIdStr = req.user.googleId || '';

    console.log(`[Account Deletion] Permanently removing user: ID=${userIdStr}, Email=${userEmail}, GoogleID=${googleIdStr}`);

    // 1. Delete associated user predictions from database
    try {
      const Prediction = require('../models/Prediction');
      const predOrConditions = [];
      if (userIdStr && userIdStr.length === 24) predOrConditions.push({ user: userIdStr });
      if (userEmail) predOrConditions.push({ userEmail: userEmail });
      if (predOrConditions.length > 0) {
        await Prediction.deleteMany({ $or: predOrConditions });
      }
    } catch (predErr) {
      console.warn('Prediction cleanup notice:', predErr.message);
    }

    // 2. Permanently delete user from MongoDB database
    try {
      const mongoose = require('mongoose');
      const userOrConditions = [];
      if (userIdStr && userIdStr.length === 24) userOrConditions.push({ _id: userIdStr });
      if (userEmail) userOrConditions.push({ email: userEmail });
      if (googleIdStr) userOrConditions.push({ googleId: googleIdStr });

      if (userOrConditions.length > 0 && mongoose.connection && mongoose.connection.readyState === 1) {
        const deleteResult = await User.deleteMany({ $or: userOrConditions });
        console.log(`[Account Deletion] Deleted ${deleteResult.deletedCount} MongoDB user record(s).`);
      }
    } catch (dbErr) {
      console.warn('MongoDB account deletion notice:', dbErr.message);
    }

    // 3. Remove user from local memory registry
    for (let i = localUserMemory.length - 1; i >= 0; i--) {
      const memUser = localUserMemory[i];
      const memEmail = memUser.email ? memUser.email.toLowerCase().trim() : '';
      const memId = (memUser._id || memUser.id || '').toString();
      const memGoogleId = memUser.googleId || '';

      if (
        (userEmail && memEmail === userEmail) ||
        (userIdStr && memId === userIdStr) ||
        (googleIdStr && memGoogleId === googleIdStr)
      ) {
        localUserMemory.splice(i, 1);
        console.log(`[Account Deletion] Removed user from localUserMemory at index ${i}`);
      }
    }

    res.json({
      success: true,
      message: 'Account permanently deleted from database.'
    });
  } catch (error) {
    console.error('Delete account controller error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting account', error: error.message });
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
  resetPassword,
  deleteAccount
};