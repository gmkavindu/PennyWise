// client/src/services/api.js

import axios from 'axios';

const API_URL = '/api';

export const fetchExpenses = async () => {
  const response = await axios.get(`${API_URL}/expenses`, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return response.data;
};

export const fetchBudgets = async () => {
  const response = await axios.get(`${API_URL}/budgets`, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return response.data;
};

export const addBudget = async (budget) => {
  const response = await axios.post(`${API_URL}/budgets`, budget, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return response.data;
};

export const updateBudget = async (id, budget) => {
  const response = await axios.put(`${API_URL}/budgets/${id}`, budget, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await axios.delete(`${API_URL}/budgets/${id}`, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return response.data;
};

export const fetchFinancialTips = async () => {
  try {
    const response = await axios.get(`${API_URL}/financial-tips`, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    });
    return response.data.tips; // Assuming backend sends { tips: 'Financial tip message' }
  } catch (error) {
    console.error('Error fetching financial tips:', error);
    throw error;
  }
};
