// src/services/api.js
import axios from 'axios';

const API_URL = '/api/budgets';

const fetchBudgets = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
  return response.data;
};

const addBudget = async (budget) => {
  const response = await axios.post(API_URL, budget, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const deleteBudget = async (id) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
    },
  });
};

const updateBudget = async (id, budget) => {
  const response = await axios.put(`${API_URL}/${id}`, budget, {
    headers: {
      'x-auth-token': localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export { fetchBudgets, addBudget, deleteBudget, updateBudget };
