require('dotenv').config(); // Load environment variables from a .env file
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000; // Set port to environment variable PORT or default to 5000
const MONGODB_URI = process.env.MONGODB_URI; // MongoDB connection URI from environment variable

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from /uploads directory

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => console.error(err)); // Handle MongoDB connection errors

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// API routes
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
app.use('/api', apiRoutes); // Mount API routes at /api
app.use('/api/auth', authRoutes); // Mount authentication routes at /api/auth

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).send('Something broke!'); // Send a generic error response
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html')); // Serve React's index.html for all other requests
});

// Export app for testing
module.exports = app;

// Start server if not running in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}