// server/controllers/expenseController.js

const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const User = require('../models/User');
const { generateFinancialTips } = require('../utils/tipsGenerator');

// Get all expenses for a user
exports.getExpenses = async (req, res) => {
    try {
        // Fetch expenses associated with the logged-in user
        const expenses = await Expense.find({ user: req.user.id });
        res.json(expenses);
    } catch (err) {
        // Handle server errors
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Add a new expense
exports.addExpense = async (req, res) => {
    const { amount, category, date, description } = req.body;

    try {
        // Find the budget for the given category and user
        const budget = await Budget.findOne({ category, user: req.user.id });

        if (!budget) {
            // Return error if no budget found for the category
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
            // Return error if adding this expense exceeds the budget limit
            return res.status(400).json({ message: `Adding this expense exceeds the budget limit for ${category}` });
        }

        // Create new expense instance
        const newExpense = new Expense({
            amount,
            category,
            date,
            description,
            user: req.user.id
        });

        // Save the new expense
        const expense = await newExpense.save();

        // Update user's expenses array with the newly created expense's ID
        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { expenses: expense._id }, $set: { lastExpensesUpdate: new Date() } },
            { new: true }
        );

        res.json(expense);
    } catch (err) {
        // Handle server errors
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Update an existing expense
exports.updateExpense = async (req, res) => {
    const { amount, category, date, description } = req.body;

    try {
        // Find the expense to update
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            // Return error if expense not found
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Check if the logged-in user owns the expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update the expense with new data
        expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { $set: { amount, category, date, description } },
            { new: true }
        );

        // Update user's last expenses update timestamp
        await User.findByIdAndUpdate(req.user.id, { lastExpensesUpdate: new Date() });

        res.json(expense);
    } catch (err) {
        // Handle server errors
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
    try {
        // Find the expense to delete
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            // Return error if expense not found
            return res.status(404).json({ msg: 'Expense not found' });
        }

        // Ensure user owns the expense before deletion
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Delete the expense
        await Expense.findByIdAndDelete(req.params.id);

        // Remove expense ID from user's expenses array
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { expenses: req.params.id } },
            { new: true }
        );

        if (!user) {
            // Return error if user not found after deletion
            return res.status(404).json({ msg: 'User not found' });
        }

        // Send success message
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        // Handle server errors
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
