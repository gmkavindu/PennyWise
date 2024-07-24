const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/auth');
const validator = require('validator');

const { upload, PROFILE_PICTURES_DIR } = require('../middleware/upload');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    if (!validator.isLength(password, { min: 8 })) {
      return res.status(400).json({ msg: 'Password must be at least 8 characters long' });
    }

    if (!validator.isStrongPassword(password, { minSymbols: 0 })) {
      return res.status(400).json({ msg: 'Password must include at least one uppercase letter, one lowercase letter, and one number' });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/profile
// @desc    Get logged-in user's profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Append base URL to profilePicture path
    if (user.profilePicture) {
      user.profilePicture = `${req.protocol}://${req.get('host')}/uploads/profiles/${path.basename(user.profilePicture)}`;
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/auth/profile
// @desc    Update logged-in user's profile (including profile picture)
// @access  Private
router.put('/profile', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  const { name, email, password } = req.body;

  // Build user object
  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    userFields.password = await bcrypt.hash(password, salt);
  }
  if (req.file) {
    userFields.profilePicture = `/uploads/profiles/${req.file.filename}`;
  }

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Delete old profile picture file if updating
    if (user.profilePicture && req.file) {
      fs.unlinkSync(path.join(PROFILE_PICTURES_DIR, path.basename(user.profilePicture)));
    }

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    // Append base URL to profilePicture path
    if (user.profilePicture) {
      user.profilePicture = `${req.protocol}://${req.get('host')}${user.profilePicture}`;
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/auth/delete-account
// @desc    Delete user account, budgets, expenses, and profile picture
// @access  Private
router.delete('/delete-account', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user to get profile picture path
    const user = await User.findById(userId);

    // Delete profile picture from local folder if exists
    if (user.profilePicture) {
      fs.unlinkSync(path.join(PROFILE_PICTURES_DIR, path.basename(user.profilePicture)));
    }

    // Delete budgets and expenses related to the user
    await Budget.deleteMany({ user: userId });
    await Expense.deleteMany({ user: userId });

    // Delete the user itself
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User account, budgets, expenses, and profile picture deleted successfully' });
  } catch (err) {
    console.error('Error deleting user and related data:', err);
    res.status(500).json({ message: 'Failed to delete user account' });
  }
});

module.exports = router;
