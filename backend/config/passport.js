const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const googleClientId = process.env.GOOGLE_CLIENT_ID || 'unconfigured_google_client_id';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || 'unconfigured_google_client_secret';
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

const findOrCreateGoogleUser = async (profile) => {
  const userEmail = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : null;
  const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : undefined;
  const displayName = profile.displayName || (profile.name ? `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim() : null) || (userEmail ? userEmail.split('@')[0] : 'Radiologist');

  // 1. Search DB if connected
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      let user = await User.findOne({ googleId: profile.id }).maxTimeMS(2000);
      if (user) return user;

      if (userEmail) {
        user = await User.findOne({ email: userEmail }).maxTimeMS(2000);
        if (user) {
          user.googleId = profile.id;
          if (avatarUrl) user.avatar = avatarUrl;
          user.authProvider = 'google';
          await user.save();
          return user;
        }
      }

      user = await User.create({
        name: displayName,
        email: userEmail || `${profile.id}@google.user`,
        googleId: profile.id,
        avatar: avatarUrl,
        authProvider: 'google',
        role: 'Radiologist',
        hospital: '',
        department: 'Diagnostic Imaging'
      });
      return user;
    }
  } catch (dbErr) {
    console.warn('MongoDB Google OAuth lookup error, operating in fallback mode:', dbErr.message);
  }

  // 2. Return fallback user object
  return {
    _id: `usr-google-${profile.id || Date.now()}`,
    id: `usr-google-${profile.id || Date.now()}`,
    name: displayName,
    email: userEmail || `${profile.id}@google.user`,
    googleId: profile.id,
    avatar: avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
    authProvider: 'google',
    role: 'Radiologist',
    hospital: '',
    department: 'Diagnostic Imaging'
  };
};

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackUrl
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateGoogleUser(profile);
        return done(null, user);
      } catch (error) {
        console.error('Google Passport strategy error:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id || user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const user = await User.findById(id);
      if (user) return done(null, user);
    }
    done(null, { _id: id, id, name: 'Radiologist', role: 'Radiologist' });
  } catch (error) {
    done(null, { _id: id, id, name: 'Radiologist', role: 'Radiologist' });
  }
});

passport.findOrCreateGoogleUser = findOrCreateGoogleUser;

module.exports = passport;