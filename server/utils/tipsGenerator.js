const axios = require('axios');
const Expense = require('../models/Expense'); // Import your Expense model
const apiKey = 'pk-ZZuoNLrJrPHKRxmlldBOoQnzghiUAufdjTEfJvuKQfKFEQBf'; // Replace with your updated API key
const endpoint = 'https://api.pawan.krd/v1/chat/completions';

async function generateFinancialTips(userData) {
  try {
    // Define the headers with your API key
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    // Fetch expenses from MongoDB based on user ID
    const expenses = await Expense.find({ user: userData.user }); // Adjust as per your schema

    // Construct the input prompt based on user expenses
    const expenseSummary = expenses.map(expense => `${expense.description} $${expense.amount}`).join('\n');
    const prompt = `Generate personalized financial tips based on your recent expenses:\n${expenseSummary}\n\nPlease provide structured, practical advice and cost-saving strategies in bullet points or short paragraphs suitable for a web app.`;

    // Define the data payload for the request
    const requestData = {
      model: 'gpt-3.5-unfiltered', // Update to your preferred model if different
      messages: [
        { role: 'system', content: 'You are a helpful assistant.The user is seeking practical advice to improve their financial management based on recent spending patterns.' },
        { role: 'user', content: prompt }
      ],
    };

    // Make a POST request using Axios
    const response = await axios.post(endpoint, requestData, { headers });

    // Handle the response data
    const { data } = response;
    if (data.choices && data.choices.length > 0) {
      const financialTip = data.choices[0].message.content.trim();
      return financialTip;
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
