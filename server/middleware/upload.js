const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();


// Define the profile pictures directory
const PROFILE_PICTURES_DIR = path.join(__dirname, '../uploads/profiles');

// Ensure the upload directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDirectoryExists(PROFILE_PICTURES_DIR);

// Multer storage configuration for profile pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PROFILE_PICTURES_DIR); // Directory where profile pictures will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  },
});

// Multer upload instance for profile pictures
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB (adjust as necessary)
});

// Serve static files from the uploads directory
router.use('/uploads', express.static(PROFILE_PICTURES_DIR));

module.exports = {
  upload,
  PROFILE_PICTURES_DIR
};
