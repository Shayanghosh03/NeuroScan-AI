const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const googleClientId = process.env.GOOGLE_CLIENT_ID || 'unconfigured_google_client_id';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || 'unconfigured_google_client_secret';
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackUrl
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userEmail = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : null;
        const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : undefined;

        // 1. Search by Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // 2. Search by Email (Account Linking)
        if (userEmail) {
          user = await User.findOne({ email: userEmail });
          if (user) {
            user.googleId = profile.id;
            if (avatarUrl) user.avatar = avatarUrl;
            user.authProvider = 'google';
            await user.save();
            return done(null, user);
          }
        }

        // 3. Create New Google User
        user = await User.create({
          name: profile.displayName || (userEmail ? userEmail.split('@')[0] : 'Radiologist'),
          email: userEmail || `${profile.id}@google.user`,
          googleId: profile.id,
          avatar: avatarUrl,
          authProvider: 'google',
          role: 'Radiologist',
          hospital: 'Not specified',
          department: 'Diagnostic Imaging'
        });

        return done(null, user);
      } catch (error) {
        console.error('Google Passport strategy error:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;