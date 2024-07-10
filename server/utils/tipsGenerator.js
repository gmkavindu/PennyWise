require('dotenv').config(); // Load environment variables from a .env file
const axios = require('axios');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

const apiKey = process.env.API_KEY; // API key from environment variable
const endpoint = process.env.ENDPOINT; // Endpoint URL from environment variable
const model = process.env.MODEL; // Model identifier from environment variable

async function generateFinancialTips(userData) {
  try {
    // Define headers with your API key
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    // Fetch expenses from MongoDB based on user ID
    const expenses = await Expense.find({ user: userData.user });
    
    // Fetch budgets from MongoDB based on user ID
    const budgets = await Budget.find({ user: userData.user });

    // Map budgets to categories
    const budgetMap = budgets.reduce((map, budget) => {
      map[budget.category] = budget.limit;
      return map;
    }, {});

    // Construct input prompt based on user expenses and budget
    const expenseSummary = expenses.map(expense => {
      const budgetLimit = budgetMap[expense.category] || 'No budget limit set';
      return `Category: ${expense.category}, Amount: RS.${expense.amount}, Budget Limit: RS.${budgetLimit}, Description: ${expense.description || 'No description'}`;
    }).join('\n');

    const prompt = `Generate personalized financial tips based on your recent expenses in Sri Lankan Rupees (RS.) and your budget limits:\n\nExpenses:\n${expenseSummary}\n\nPlease provide structured, practical advice and cost-saving strategies in bullet points or short paragraphs suitable for a web app. Ensure all amounts are in Sri Lankan Rupees (RS.).`;

    // Define data payload for the request
    const requestData = {
      model: model, // Specify the model for generating tips
      messages: [
        { role: 'system', content: 'You are a helpful assistant. The user is seeking practical advice to improve their financial management based on recent spending patterns and budget limits.' },
        { role: 'user', content: prompt }
      ],
    };

    // Make POST request using Axios
    const response = await axios.post(endpoint, requestData, { headers });

    // Handle response data
    const { data } = response;
    if (data.choices && data.choices.length > 0) {
      const financialTip = data.choices[0].message.content.trim();
      return financialTip; // Return the generated financial tip
    } else {
      throw new Error('No response or choices found from OpenAI API');
    }
  } catch (error) {
    // Handle errors
    console.error('Error generating financial tips:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate financial tips');
  }
}

module.exports = {
  generateFinancialTips,
};
