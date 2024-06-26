const Budget = require('../models/Budget');

// Get all budgets for a user
exports.getBudgets = async (req, res) => {
  try {
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
    const newBudget = new Budget({
      category,
      limit,
      user: req.user.id,
    });

    const budget = await newBudget.save();
    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  const { category, limit } = req.body;

  // Build budget object
  const budgetFields = {};
  if (category) budgetFields.category = category;
  if (limit) budgetFields.limit = limit;

  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) return res.status(404).json({ msg: 'Budget not found' });

    // Ensure user owns budget
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

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

    // Ensure user owns budget
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Budget removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
