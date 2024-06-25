// server/controllers/budgetController.js
const Budget = require('../models/Budget');

exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id });
        res.json(budgets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addBudget = async (req, res) => {
    const { category, limit } = req.body;

    try {
        const newBudget = new Budget({
            category,
            limit,
            user: req.user.id
        });

        const budget = await newBudget.save();
        res.json(budget);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateBudget = async (req, res) => {
    const { category, limit } = req.body;
    const updatedBudget = { category, limit };

    try {
        let budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ msg: 'Budget not found' });
        }

        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        budget = await Budget.findByIdAndUpdate(req.params.id, { $set: updatedBudget }, { new: true });

        res.json(budget);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteBudget = async (req, res) => {
    try {
        let budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ msg: 'Budget not found' });
        }

        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Budget.findByIdAndDelete(req.params.id); // Updated method

        res.json({ msg: 'Budget removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
