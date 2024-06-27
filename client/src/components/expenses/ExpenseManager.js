import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import Navbar from '../Navbar';

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
};

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/api/expenses', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      const sortedExpenses = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sortedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSaveExpense = async (expense) => {
    try {
      if (expense._id) {
        // Update existing expense
        await axios.put(`/api/expenses/${expense._id}`, expense, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
      } else {
        // Add new expense
        await axios.post('/api/expenses', expense, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
      }
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleEditExpense = (expense) => {
    setExpenseToEdit(expense);
  };

  const clearEdit = () => {
    setExpenseToEdit(null);
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Expense Manager</h2>
        <ExpenseForm onSave={handleSaveExpense} expenseToEdit={expenseToEdit} clearEdit={clearEdit} />
        <ExpenseTable expenses={expenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
      </div>
    </div>
  );
};

export default ExpenseManager;
