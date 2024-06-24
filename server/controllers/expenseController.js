const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;

    // Check if an expense with the same details already exists for the user
    const existingExpense = await Expense.findOne({
      amount,
      category,
      date,
      user: req.user.id, // Assuming req.user contains the authenticated user's ID
    });

    if (existingExpense) {
      return res.status(400).json({ msg: 'Expense with these details already exists' });
    }

    // Create a new expense
    const newExpense = new Expense({
      amount,
      category,
      date,
      description,
      user: req.user.id,
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000 && err.keyPattern && err.keyPattern.user) {
      // Handling MongoDB duplicate key error (E11000)
      return res.status(400).json({ msg: 'Expense with these details already exists' });
    }
    res.status(500).send('Server Error');
  }
};

// Get all expenses for the authenticated user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }); // Filter by authenticated user's ID
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update an expense by ID
exports.updateExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;
  const updatedExpense = { amount, category, date, description };

  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, { $set: updatedExpense }, { new: true });

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ msg: 'Invalid expense ID' });
    }

    let expense = await Expense.findOneAndDelete({ _id: expenseId, user: req.user.id });

    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }

    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
