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

exports.updateUserSalary = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from middleware
    const { salary, period, startDate, customPeriod } = req.body;

    // Validate the period
    const validPeriods = ['weekly', 'monthly', 'yearly', 'custom'];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({ message: 'Invalid period value' });
    }

    const user = await User.findById(userId);

    if (user) {
      let expirationDate;

      switch (period) {
        case 'weekly':
          expirationDate = new Date(startDate);
          expirationDate.setDate(expirationDate.getDate() + 7);
          break;
        case 'monthly':
          expirationDate = new Date(startDate);
          expirationDate.setMonth(expirationDate.getMonth() + 1);
          break;
        case 'yearly':
          expirationDate = new Date(startDate);
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);
          break;
        case 'custom':
          expirationDate = new Date(startDate);
          expirationDate.setDate(expirationDate.getDate() + (customPeriod || 0));
          break;
        default:
          expirationDate = new Date(startDate);
          expirationDate.setMonth(expirationDate.getMonth() + 1);
      }

      user.salaryDetails = {
        salary,
        period,
        startDate,
        customPeriod,
        expirationDate
      };
      await user.save();

      res.status(200).json(user.salaryDetails);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getUserSalary = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using a middleware to get the user ID
    const user = await User.findById(userId);

    if (user) {
      res.status(200).json(user.salaryDetails); // Ensure salaryDetails contains full details including period dates
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveBudgetStatus = async (req, res) => {
  try {
    const { totalBudgets, totalExpenses, statusMessage, salary, period, customPeriod, startDate, expirationDate } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.lastBudgetStatus = {
      totalBudgets,
      totalExpenses,
      statusMessage,
      salary,
      period,
      customPeriod,
      startDate,
      expirationDate,
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