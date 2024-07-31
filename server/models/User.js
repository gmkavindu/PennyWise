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
  agreedToPrivacyPolicy: {  // New field for privacy policy agreement
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
});

module.exports = mongoose.model('User', UserSchema);
