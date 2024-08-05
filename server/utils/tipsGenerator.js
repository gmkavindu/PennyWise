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
    const expenses = await Expense.find({ user: userData.user }).populate('budget'); // Populate budget field

    // Fetch budgets from MongoDB based on user ID
    const budgets = await Budget.find({ user: userData.user });

    // Map budgets to categories
    const budgetMap = budgets.reduce((map, budget) => {
      map[budget.category] = budget.limit;
      return map;
    }, {});

    // Filter expenses to include only those with a valid budget
    const validExpenses = expenses.filter(expense => expense.budget);

    // Construct input prompt based on user expenses with valid budgets
    const expenseSummary = validExpenses.map(expense => {
      const budgetLimit = budgetMap[expense.category] || 'No budget limit set';
      return `Category: ${expense.category}, Amount: RS.${expense.amount}, Budget Limit: RS.${budgetLimit}, Description: ${expense.description || 'No description'}`;
    }).join('\n');

    // If no valid expenses to process, return a message indicating no data
    if (!validExpenses.length) {
      return 'No valid budgeted expenses available for generating financial tips.';
    }

    // Ensure prompt is only constructed once
    const prompt = `Based on the following recent expenses in Sri Lankan Rupees (RS.) and your budget limits, please generate personalized financial tips:

        **Expenses:**
        ${expenseSummary}

        **Instructions:**
        - Provide actionable advice and cost-saving strategies.
        - Include practical suggestions for managing or reducing expenses.
        - Offer insights on how to better align spending with budget limits.
        - Structure the tips in bullet points or short paragraphs for clarity.
        - Ensure all amounts are clearly presented in Sri Lankan Rupees (RS.).

        Your response should help in improving financial management and making informed decisions based on the given expense data.`;

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
