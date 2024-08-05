const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: true }
});

module.exports = mongoose.model('Expense', expenseSchema);
