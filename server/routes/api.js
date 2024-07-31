const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { addBudget, getBudgets, updateBudget, deleteBudget } = require('../controllers/budgetController');
const { getFinancialTips, reloadFinancialTips } = require('../controllers/tipsController');
const { updatePersonal, updateTheme } = require('../controllers/userController');
const User = require('../models/User'); // Import User model
const auth = require('../middleware/auth');

// Expense routes
router.post('/expenses', auth, addExpense);
router.get('/expenses', auth, getExpenses);
router.put('/expenses/:id', auth, updateExpense);
router.delete('/expenses/:id', auth, deleteExpense);

// Budget routes
router.post('/budgets', auth, addBudget);
router.get('/budgets', auth, getBudgets);
router.put('/budgets/:id', auth, updateBudget);
router.delete('/budgets/:id', auth, deleteBudget);

// Financial tips routes
router.get('/financial-tips', auth, getFinancialTips);
router.post('/financial-tips/reload', auth, reloadFinancialTips);

// User routes
router.put('/user/personal', auth, updatePersonal);
router.put('/user/theme', auth, updateTheme);

// New endpoint to get logged-in user's details
router.get('/user/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/agree-to-privacy-policy
// @desc    Update user agreement to privacy policy
// @access  Private
router.post('/agree-to-privacy-policy', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.agreedToPrivacyPolicy = req.body.agreement;
    await user.save();

    res.status(200).json({ message: 'Privacy policy agreement updated successfully' });
  } catch (err) {
    console.error('Error updating privacy policy agreement:', err);
    res.status(500).json({ message: 'Failed to update privacy policy agreement' });
  }
});

module.exports = router;
