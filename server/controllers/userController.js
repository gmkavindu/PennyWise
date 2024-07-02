const User = require('../models/User');
const fs = require('fs');
// Update Account Settings
exports.updateAccount = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update email
    if (email) user.email = email;

    // Update password with hashing
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
}
// Update Personal Information including Profile Picture
exports.updatePersonal = async (req, res) => {
  const { name } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update name
    if (name) user.name = name;

    // Handle profile picture upload
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
    if (theme) user.theme = theme;
    await user.save();
    res.json({ message: 'Theme updated successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Get User Tips
exports.getUserTips = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.lastGeneratedTips);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Update User Tips
exports.updateUserTips = async (req, res) => {
  const { tips, tipsGeneratedAt } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.lastGeneratedTips = tips;
    user.tipsGeneratedAt = tipsGeneratedAt;
    await user.save();
    res.json({ message: 'Tips updated successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
