// server/models/Budget.js
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    limit: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming there's a User model for authentication
        required: true
    }
});

module.exports = mongoose.model('Budget', budgetSchema);
