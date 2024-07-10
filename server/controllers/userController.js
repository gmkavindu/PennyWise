const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const fs = require('fs');

// Update Account Settings (email and/or password)
exports.updateAccount = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findById(req.user.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update email if provided
    if (email) user.email = email;

    // Update password with hashing if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: 'Account updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update Personal Information including Profile Picture
exports.updatePersonal = async (req, res) => {
  const { name } = req.body;
  try {
    const user = await User.findById(req.user.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update name if provided
    if (name) user.name = name;

    // Handle profile picture upload if file exists in request
    if (req.file) {
      user.profilePicture = req.file.path; // Assuming req.file.path contains the path to the uploaded file
    }

    await user.save();
    res.json({ message: 'Personal information updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update Theme and Appearance
exports.updateTheme = async (req, res) => {
  const { theme } = req.body;
  try {
    const user = await User.findById(req.user.id);

    // Update theme if provided
    if (theme) user.theme = theme;

    await user.save();
    res.json({ message: 'Theme updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get User Tips
exports.getUserTips = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.lastGeneratedTips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update User Tips
exports.updateUserTips = async (req, res) => {
  const { tips, tipsGeneratedAt } = req.body;
  try {
    const user = await User.findById(req.user.id);

    // Update user's last generated tips and tips generated timestamp
    user.lastGeneratedTips = tips;
    user.tipsGeneratedAt = tipsGeneratedAt;

    await user.save();
    res.json({ message: 'Tips updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
