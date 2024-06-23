const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const auth = require('../middleware/auth');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Expense routes
router.post('/expenses', auth, addExpense);
router.get('/expenses', auth, getExpenses);
router.put('/expenses/:id', auth, updateExpense);
router.delete('/expenses/:id', auth, deleteExpense);

module.exports = router;
