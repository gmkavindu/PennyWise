const mongoose = require('mongoose');

const { Schema } = mongoose;

const incomeDetailSchema = new Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
});

const incomeDetailsSchema = new Schema({
  categories: [incomeDetailSchema], // Array of category objects
  details: {
    period: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly', 'custom'],
      default: 'monthly'
    },
    customPeriod: { type: Number },
    startDate: { type: Date, default: Date.now },
    expirationDate: { type: Date },
  }
});

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
  
  incomeDetails: incomeDetailsSchema,
  
  lastBudgetStatus: {
    totalBudgets: { type: Number, default: 0 },
    totalExpenses: { type: Number, default: 0 },
    statusMessage: { type: String, default: '' },
    totalIncome: { type: Number, default: 0 },
    period: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly', 'custom'], // Added 'custom'
      default: 'monthly'
    },
    customPeriod: { type: Number }, // Custom period in days
    startDate: { type: Date, default: Date.now },
    expirationDate: { type: Date },
    incomeCategories: [{ // New field for category-wise income details
      category: { type: String, required: true },
      amount: { type: Number, required: true }
    }]

  },

});

module.exports = mongoose.model('User', UserSchema);
