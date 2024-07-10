const { generateFinancialTips } = require('../utils/tipsGenerator');
const Expense = require('../models/Expense');
const User = require('../models/User');

// Retrieves or generates financial tips for a user based on their expenses
const getFinancialTips = async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if previously generated tips are still valid
    if (user.lastGeneratedTips && user.tipsGeneratedAt &&
        (!user.lastExpensesUpdate || user.tipsGeneratedAt > user.lastExpensesUpdate)) {
      return res.json({ tips: user.lastGeneratedTips });
    }

    // Fetch expenses associated with the user
    const expenses = await Expense.find({ user: req.user.id });

    // Prepare user data for generating tips
    const userData = {
      user: req.user.id,
      expenses: expenses.map(expense => ({
        description: expense.description,
        amount: expense.amount,
      })),
    };

    // Generate financial tips based on user data
    const tips = await generateFinancialTips(userData);

    // Update user's last generated tips and timestamp
    user.lastGeneratedTips = tips;
    user.tipsGeneratedAt = new Date();
    await user.save();

    // Respond with the generated tips
    res.json({ tips });
  } catch (err) {
    // Handle errors
    console.error('Error generating financial tips:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Reloads financial tips manually, triggering the regeneration process
const reloadFinancialTips = async (req, res) => {
  try {
    // Implement the actual logic for reloading tips here
    await generateFinancialTips();

    // Respond with success message
    res.status(200).json({ message: 'Tips reloaded successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error reloading financial tips:', error.message);
    res.status(500).json({ error: 'Failed to reload financial tips' });
  }
};

// Export the functions
module.exports = {
  getFinancialTips,
  reloadFinancialTips,
};
