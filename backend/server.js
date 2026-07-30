require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const passport = require('./config/passport');

// Connect to database
connectDB();

// Initialize passport
app.use(passport.initialize());

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections safely without crashing the server
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Warning: ${err.message}`);
});