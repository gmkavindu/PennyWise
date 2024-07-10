// server/controllers/budgetController.js

const Budget = require('../models/Budget');
const User = require('../models/User'); // Import User model

// Get all budgets for a user
exports.getBudgets = async (req, res) => {
    try {
        // Fetch budgets associated with the logged-in user
        const budgets = await Budget.find({ user: req.user.id });
        res.json(budgets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add a new budget
exports.addBudget = async (req, res) => {
    const { category, limit } = req.body;

    try {
        // Create a new budget instance
        const newBudget = new Budget({
            category,
            limit,
            user: req.user.id,
        });

        // Save the new budget
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
        res.status(500).send('Server Error');
    }
};

// Update a budget
exports.updateBudget = async (req, res) => {
    const { category, limit } = req.body;

    // Build budget object to update
    const budgetFields = {};
    if (category) budgetFields.category = category;
    if (limit) budgetFields.limit = limit;

    try {
        let budget = await Budget.findById(req.params.id);

        if (!budget) return res.status(404).json({ msg: 'Budget not found' });

        // Ensure user owns the budget
        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Update the budget
        budget = await Budget.findByIdAndUpdate(
            req.params.id,
            { $set: budgetFields },
            { new: true }
        );

        res.json(budget);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
    try {
        let budget = await Budget.findById(req.params.id);

        if (!budget) return res.status(404).json({ msg: 'Budget not found' });

        // Ensure user owns the budget
        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Delete the budget
        await Budget.findByIdAndDelete(req.params.id);

        // Remove budget ID from user's budgets array
        await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { budgets: req.params.id } },
            { new: true }
        );

        res.json({ msg: 'Budget removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
