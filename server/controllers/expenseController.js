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
    const { amount, category, date, description, budgetId } = req.body;

    try {
        // Find the specific budget by ID and user
        const budget = await Budget.findOne({ _id: budgetId, user: req.user.id });

        if (!budget) {
            return res.status(400).json({ message: 'No budget found for the provided ID and category.' });
        }

        // Calculate the total expenses for the specific budget
        const totalExpenseForBudget = await Expense.aggregate([
            { $match: { budget: budget._id, user: req.user.id } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const currentTotal = totalExpenseForBudget.length ? totalExpenseForBudget[0].total : 0;
        const newTotal = currentTotal + amount;

        // Remove the budget limit check here
        // if (newTotal > budget.limit) {
        //     return res.status(400).json({ message: 'Adding this expense exceeds the budget limit.' });
        // }

        // Create and save the new expense
        const newExpense = new Expense({
            amount,
            category,
            date,
            description,
            user: req.user.id,
            budget: budget._id
        });

        const expense = await newExpense.save();

        // Update user's expenses array with the newly created expense's ID
        await User.findByIdAndUpdate(req.user.id, { $push: { expenses: expense._id }, $set: { lastExpensesUpdate: new Date() } }, { new: true });

        res.json(expense);
    } catch (err) {
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

        // Preserve the current budget ID if not provided in the request
        const updatedExpenseData = {
            amount: amount !== undefined ? amount : expense.amount,
            category: category !== undefined ? category : expense.category,
            date: date !== undefined ? date : expense.date,
            description: description !== undefined ? description : expense.description,
            budget: expense.budget // Preserve the existing budget ID
        };

        // Calculate the new total for the budget
        const totalExpenseForBudget = await Expense.aggregate([
            { $match: { budget: expense.budget, user: req.user.id } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const currentTotal = totalExpenseForBudget.length ? totalExpenseForBudget[0].total : 0;
        const newTotal = currentTotal + updatedExpenseData.amount - expense.amount;

        // Find the budget and check if new total exceeds the limit
        const budget = await Budget.findOne({ _id: expense.budget, user: req.user.id });
        // Remove the budget limit check here
        // if (budget && newTotal > budget.limit) {
        //     return res.status(400).json({ message: 'Updating this expense exceeds the budget limit.' });
        // }

        // Update the expense
        expense = await Expense.findByIdAndUpdate(req.params.id, { $set: updatedExpenseData }, { new: true });

        // Update user's last expenses update timestamp
        await User.findByIdAndUpdate(req.user.id, { lastExpensesUpdate: new Date() });

        res.json(expense);
    } catch (err) {
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
        await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { expenses: req.params.id }, $set: { lastExpensesUpdate: new Date() } },
            { new: true }
        );

        // Send success message
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        // Handle server errors
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
