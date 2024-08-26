import axios from 'axios';

const API_URL = '/api';

// Fetch expenses
export const fetchExpenses = async () => {
  const response = await axios.get(`${API_URL}/expenses`, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return response.data;
};

// Fetch budgets
export const fetchBudgets = async () => {
  const response = await axios.get(`${API_URL}/budgets`, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return response.data;
};

// Add new budget
export const addBudget = async (budget) => {
  const response = await axios.post(`${API_URL}/budgets`, budget, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return response.data;
};

// Update existing budget
export const updateBudget = async (id, budget) => {
  const response = await axios.put(`${API_URL}/budgets/${id}`, budget, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return response.data;
};

// Delete budget
export const deleteBudget = async (id) => {
  const response = await axios.delete(`${API_URL}/budgets/${id}`, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return response.data;
};

// Reset all budgets
export const resetBudgets = async () => {
  const response = await axios.post(`${API_URL}/budgets/reset`, null, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return response.data;
};

// Fetch financial tips
export const fetchFinancialTips = async () => {
  try {
    const response = await axios.get(`${API_URL}/financial-tips`, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    });
    if (response.data && response.data.tips) {
      return response.data.tips;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching financial tips:', error);
    throw error;
  }
};

// Send reload request
export const sendReloadRequest = async () => {
  try {
    await axios.post(`${API_URL}/financial-tips/reload`, null, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    });
  } catch (error) {
    console.error('Error sending reload request:', error);
    throw error;
  }
};

// Update privacy policy agreement
export const updatePrivacyPolicyAgreement = async (agreement) => {
  try {
    const response = await axios.post(`${API_URL}/agree-to-privacy-policy`, { agreement }, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating privacy policy agreement:', error);
    throw error;
  }
};

// Update salary

export const updateIncomeDetails = async (details) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Sending details:', details);

    const response = await axios.put(`${API_URL}/income`, details, {
      headers: { 'x-auth-token': token },
    });

    console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating income details:', error.response ? error.response.data : error.message);
    throw error;
  }
};





// Fetch salary
export const fetchIncomeDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/income`, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching income details:', error);
    throw error;
  }
};


// New endpoint to save budget status
export const saveBudgetStatusToUser = async (totalBudgets, totalExpenses, statusMessage, totalIncome, period, customPeriod, startDate, expirationDate, incomeCategories) => {
  try {
    await axios.post(`${API_URL}/user/save-budget-status`, { totalBudgets, totalExpenses, statusMessage, totalIncome, period, customPeriod, startDate, expirationDate, incomeCategories }, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    });
  } catch (error) {
    console.error('Error saving budget status to user:', error);
    throw error;
  }
};

// Fetch last budget status
export const fetchLastBudgetStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found.');
    }
    const response = await axios.get(`${API_URL}/user/last-budget-status`, {
      headers: { 'x-auth-token': token },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching last budget status:', error.response ? error.response.data : error.message);
    throw error;  // Ensure the error is propagated to the caller
  }
};

export const submitFeedback  = async (details) => {
  try {
    const response = await axios.post(`${API_URL}/feedback`, details, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating salary:', error);
    throw error;
  }
};


export const fetchFeedbacks  = async () => {
  try {
    const response = await axios.get(`${API_URL}/feedback`, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating salary:', error);
    throw error;
  }
};