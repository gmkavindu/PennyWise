const { generateFinancialTips } = require('../utils/tipsGenerator');
const Expense = require('../models/Expense');
const User = require('../models/User');

// Define getFinancialTips function
const getFinancialTips = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.lastGeneratedTips && user.tipsGeneratedAt && (!user.lastExpensesUpdate || user.tipsGeneratedAt > user.lastExpensesUpdate)) {
      return res.json({ tips: user.lastGeneratedTips });
    }

    const expenses = await Expense.find({ user: req.user.id });

    const userData = {
      user: req.user.id,
      expenses: expenses.map(expense => ({
        description: expense.description,
        amount: expense.amount,
      })),
    };

    const tips = await generateFinancialTips(userData);

    user.lastGeneratedTips = tips;
    user.tipsGeneratedAt = new Date();
    await user.save();

    res.json({ tips });
  } catch (err) {
    console.error('Error generating financial tips:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Define reloadFinancialTips function
const reloadFinancialTips = async (req, res) => {
  try {
    await generateFinancialTips(); // Implement the actual logic for reloading tips
    res.status(200).json({ message: 'Tips reloaded successfully' });
  } catch (error) {
    console.error('Error reloading financial tips:', error.message);
    res.status(500).json({ error: 'Failed to reload financial tips' });
  }
};

// Export the functions
module.exports = {
  getFinancialTips,
  reloadFinancialTips,
};
