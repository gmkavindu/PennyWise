const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Multer storage configuration for profile pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles'); // Directory where profile pictures will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  },
});

// Multer upload instance for profile pictures
const upload = multer({
  storage: storage,
  limits: { fileSize: 1048576 }, // Limit file size to 1MB (adjust as necessary)
});

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

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create payload for JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign JWT
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

    // Create payload for JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign JWT
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
    // Save file path to user profilePicture field
    userFields.profilePicture = `/uploads/profiles/${req.file.filename}`;
  }

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if there's an existing profile picture and delete it if updating
    if (user.profilePicture && req.file) {
      // Delete old profile picture file
      fs.unlinkSync(`./${user.profilePicture}`);
    }

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/budgets
// @desc    Create a new budget
// @access  Private
router.post('/budgets', authMiddleware, async (req, res) => {
  const { category, limit } = req.body;

  try {
    const newBudget = new Budget({
      category,
      limit,
      user: req.user.id,
    });

    const budget = await newBudget.save();

    // Update user's budgets array with the newly created budget's ID
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { budgets: budget._id } },
      { new: true }
    );

    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/expenses
// @desc    Create a new expense
// @access  Private
router.post('/expenses', authMiddleware, async (req, res) => {
  const { amount, category, date, description } = req.body;

  try {
    const newExpense = new Expense({
      amount,
      category,
      date,
      description,
      user: req.user.id,
    });

    const expense = await newExpense.save();

    // Update user's expenses array with the newly created expense's ID
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { expenses: expense._id } },
      { new: true }
    );

    res.json(expense);
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
      fs.unlinkSync(`./${user.profilePicture}`);
    }

    // Delete budgets and expenses related to the user
    await Budget.deleteMany({ user: userId });
    await Expense.deleteMany({ user: userId });

    // Delete the user itself
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User account, budgets, expenses, and profile picture deleted successfully' });
  } catch (err) {
    console.error('Error deleting user and related data:', err);
    res.status(500).json({ error: 'Could not delete user account, budgets, expenses, and profile picture' });
  }
});

module.exports = router;
