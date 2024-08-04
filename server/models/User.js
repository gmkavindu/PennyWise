const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  lastExpensesUpdate: {
    type: Date,
  },
  lastGeneratedTips: {
    type: [String],
  },
  tipsGeneratedAt: {
    type: Date,
  },
  theme: {
    type: String,
    default: 'light',
  },
  profilePicture: {
    type: String,
  },
  agreedToPrivacyPolicy: {
    type: Boolean,
    default: false,
  },
  budgets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
    },
  ],
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
    },
  ],
  salaryDetails: {
    salary: { type: Number, default: 0 },
    period: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly', 'custom'], // Added 'custom'
      default: 'monthly'
    },
    customPeriod: { type: Number }, // Custom period in days
    startDate: { type: Date, default: Date.now },
    expirationDate: { type: Date },
  },
  
  lastBudgetStatus: {
    totalBudgets: { type: Number, default: 0 },
    totalExpenses: { type: Number, default: 0 },
    statusMessage: { type: String, default: '' },
    salary: { type: Number, default: 0 },
    period: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly', 'custom'], // Added 'custom'
      default: 'monthly'
    },
    customPeriod: { type: Number }, // Custom period in days
    startDate: { type: Date, default: Date.now },
    expirationDate: { type: Date },

  },

});

module.exports = mongoose.model('User', UserSchema);
