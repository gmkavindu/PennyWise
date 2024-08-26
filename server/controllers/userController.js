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

exports.updateUserIncomeDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from middleware
    const { categories, details } = req.body;
    const { period, customPeriod, startDate } = details || {}; // Destructure details object

    // Validate categories
    for (const category of categories) {
      if (!category.category || typeof category.amount !== 'number') {
        return res.status(400).json({ message: 'Each category must have a name and amount' });
      }
    }

    // Validate and parse dates
    const parsedStartDate = new Date(startDate);
    if (isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({ message: 'Invalid startDate format' });
    }

    let expirationDateObj;

    switch (period) {
      case 'weekly':
        expirationDateObj = new Date(parsedStartDate);
        expirationDateObj.setDate(expirationDateObj.getDate() + 7);
        break;
      case 'monthly':
        expirationDateObj = new Date(parsedStartDate);
        expirationDateObj.setMonth(expirationDateObj.getMonth() + 1);
        break;
      case 'yearly':
        expirationDateObj = new Date(parsedStartDate);
        expirationDateObj.setFullYear(expirationDateObj.getFullYear() + 1);
        break;
      case 'custom':
        expirationDateObj = new Date(parsedStartDate);
        expirationDateObj.setDate(expirationDateObj.getDate() + (customPeriod || 0));
        break;
      default:
        return res.status(400).json({ message: 'Invalid period value' });
    }

    // Convert expirationDate to ISO string format
    const formattedExpirationDate = expirationDateObj.toISOString().split('T')[0];

    // Update user income details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.incomeDetails = {
      categories,
      details: {
        period,
        customPeriod,
        startDate: parsedStartDate.toISOString().split('T')[0], // Convert to ISO string format
        expirationDate: formattedExpirationDate
      }
    };

    await user.save();
    res.status(200).json(user.incomeDetails);

  } catch (error) {
    console.error('Error updating income details:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getUserIncomeDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using middleware to get the user ID
    const user = await User.findById(userId);

    if (user) {
      res.status(200).json(user.incomeDetails); // Return the updated incomeDetails
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveBudgetStatus = async (req, res) => {
  try {
    const { totalBudgets, totalExpenses, statusMessage, totalIncome, period, customPeriod, startDate, expirationDate, incomeCategories } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.lastBudgetStatus = {
      totalBudgets,
      totalExpenses,
      statusMessage,
      totalIncome, period, customPeriod, startDate, expirationDate, incomeCategories
    };

    await user.save();
    res.status(200).json({ message: 'Budget status saved successfully' });
  } catch (err) {
    console.error('Error saving budget status:', err);
    res.status(500).json({ message: 'Failed to save budget status' });
  }
};

exports.getLastBudgetStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('lastBudgetStatus');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user.lastBudgetStatus);
  } catch (err) {
    console.error('Error fetching last budget status:', err);
    res.status(500).json({ message: 'Failed to fetch last budget status' });
  }
};