const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false
}));

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Logging
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200
});
app.use('/api/', limiter);

// Purge oversized cookies to prevent HTTP 431 Request Header Fields Too Large
app.use((req, res, next) => {
  if (req.headers.cookie && req.headers.cookie.length > 1024) {
    res.clearCookie('connect.sid');
  }
  next();
});

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Express Session for Passport OAuth
app.use(session({
  name: 'ns_sid',
  secret: process.env.SESSION_SECRET || 'neuroscan-session-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 60 * 60 * 1000
  }
}));

// Initialize Passport for OAuth
const passport = require('./config/passport');
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', predictionRoutes);

// Health check
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;