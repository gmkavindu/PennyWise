const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { addBudget, getBudgets, updateBudget, deleteBudget, resetBudgets } = require('../controllers/budgetController');
const { getFinancialTips, reloadFinancialTips } = require('../controllers/tipsController');
const { updatePersonal, updateTheme, updateUserSalary , getUserSalary, saveBudgetStatus, getLastBudgetStatus } = require('../controllers/userController');
const { postFeedback, getFeedbacks } = require('../controllers/feedbackController');
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
router.post('/budgets/reset', auth, resetBudgets);

// Financial tips routes
router.get('/financial-tips', auth, getFinancialTips);
router.post('/financial-tips/reload', auth, reloadFinancialTips);

// User routes
router.put('/user/personal', auth, updatePersonal);
router.put('/user/theme', auth, updateTheme);
// Get user salary details
router.get('/salary', auth, getUserSalary);

// Update user salary details
router.put('/salary', auth, updateUserSalary);
router.post('/user/save-budget-status', auth, saveBudgetStatus);
router.get('/user/last-budget-status', auth, getLastBudgetStatus); // New endpoint to fetch last budget status

// Post feedback
router.post('/feedback', auth, postFeedback);

// Get all feedback
router.get('/feedback', auth, getFeedbacks);

// Update user agreement to privacy policy
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
