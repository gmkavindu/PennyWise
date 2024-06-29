const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { addBudget, getBudgets, updateBudget, deleteBudget } = require('../controllers/budgetController');
const { getFinancialTips, reloadFinancialTips } = require('../controllers/tipsController'); // Correctly import functions

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
router.get('/financial-tips', auth, getFinancialTips); // Correct route definition
router.post('/financial-tips/reload', auth, reloadFinancialTips); // Correct route definition

module.exports = router;
