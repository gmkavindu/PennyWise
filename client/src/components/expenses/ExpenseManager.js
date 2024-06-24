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

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/api/expenses', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses!', error);
    }
  };

  const handleSave = async (expense) => {
    try {
      let updatedExpenses;
      if (expenseToEdit && expenseToEdit._id) {
        // Update existing expense
        const response = await axios.put(`/api/expenses/${expenseToEdit._id}`, expense, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        updatedExpenses = expenses.map(exp => (exp._id === expenseToEdit._id ? response.data : exp));
      } else {
        // Add new expense
        const response = await axios.post('/api/expenses', expense, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        updatedExpenses = [...expenses, response.data];
      }
      setExpenses(updatedExpenses);
      setExpenseToEdit(null); // Clear edit mode after save
    } catch (error) {
      console.error('Error saving expense!', error);
    }
  };

  const handleEdit = (expense) => {
    setExpenseToEdit(expense);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense!', error);
    }
  };

  const clearEdit = () => {
    setExpenseToEdit(null);
  };

  return (
    <div>
      <Navbar />
      <div style={containerStyle}>
        <ExpenseForm onSave={handleSave} expenseToEdit={expenseToEdit} clearEdit={clearEdit} />
        <ExpenseTable onEdit={handleEdit} onDelete={handleDelete} expenses={expenses} />
      </div>
    </div>
  );
};

export default ExpenseManager;
