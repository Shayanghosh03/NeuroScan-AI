const http = require('http');
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server with maxHeaderSize set to 64KB (65536 bytes) to eliminate HTTP 431 errors
const server = http.createServer({ maxHeaderSize: 65536 }, app);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections safely without crashing the server
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Warning: ${err.message}`);
});