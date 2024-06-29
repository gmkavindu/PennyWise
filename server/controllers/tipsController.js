const { generateFinancialTips } = require('../utils/tipsGenerator');
const Expense = require('../models/Expense'); // Import your Expense model

exports.getFinancialTips = async (req, res) => {
  try {
    // Fetch expenses from MongoDB based on user ID
    const expenses = await Expense.find({ user: req.user.id });

    // Construct userData object with fetched data
    const userData = {
      user: req.user.id,
      expenses: expenses.map(expense => ({
        description: expense.description,
        amount: expense.amount,
      })),
    };

    // Generate financial tips using fetched data
    const tips = await generateFinancialTips(userData);

    res.json({ tips });
  } catch (err) {
    console.error('Error generating financial tips:', err.message); // Simplified error logging
    res.status(500).send('Server Error');
  }
};
