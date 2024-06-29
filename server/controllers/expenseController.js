// server/controllers/expenseController.js

const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const User = require('../models/User');
const { generateFinancialTips } = require('../utils/tipsGenerator');

// Get all expenses for a user
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Add a new expense
exports.addExpense = async (req, res) => {
    const { amount, category, date, description } = req.body;

    try {
        // Find the budget for the given category
        const budget = await Budget.findOne({ category, user: req.user.id });

        if (!budget) {
            return res.status(400).json({ message: `No budget found for category ${category}` });
        }

        // Calculate the total expenses for the category
        const totalExpenseForCategory = await Expense.aggregate([
            { $match: { category, user: req.user.id } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const currentTotal = totalExpenseForCategory.length ? totalExpenseForCategory[0].total : 0;
        const newTotal = currentTotal + amount;

        if (newTotal > budget.limit) {
            return res.status(400).json({ message: `Adding this expense exceeds the budget limit for ${category}` });
        }

        const newExpense = new Expense({
            amount,
            category,
            date,
            description,
            user: req.user.id
        });

        const expense = await newExpense.save();

        // Update user's last expenses update timestamp
        await User.findByIdAndUpdate(req.user.id, { lastExpensesUpdate: new Date().toISOString() });

        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Update an existing expense
exports.updateExpense = async (req, res) => {
    const { amount, category, date, description } = req.body;

    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        // Check user
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update the expense
        expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { $set: { amount, category, date, description } },
            { new: true }
        );

        // Update user's last expenses update timestamp
        await User.findByIdAndUpdate(req.user.id, { lastExpensesUpdate: new Date().toISOString() });

        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
    try {
      let expense = await Expense.findById(req.params.id);
  
      if (!expense) return res.status(404).json({ msg: 'Expense not found' });
  
      // Ensure user owns expense
      if (expense.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      await Expense.findByIdAndDelete(req.params.id);

      // Update user's last expenses update timestamp
      await User.findByIdAndUpdate(req.user.id, { lastExpensesUpdate: new Date().toISOString() });

      res.json({ msg: 'Expense removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
};
