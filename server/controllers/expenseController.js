const Expense = require('../models/Expense');

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;
    const newExpense = new Expense({
      amount,
      category,
      date,
      description,
      user: req.user.id,  // Assuming req.user contains the authenticated user's ID
    });
    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all expenses for the authenticated user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });  // Filter by authenticated user's ID
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
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Expense.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
