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
  const [budgets, setBudgets] = useState([]);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('/api/expenses', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    const fetchBudgets = async () => {
      try {
        const response = await axios.get('/api/budgets', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setBudgets(response.data);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchExpenses();
    fetchBudgets();
  }, []);

  const handleSave = async (expense) => {
    setAlertMessage('');

    try {
      const budgetForCategory = budgets.find((b) => b.category === expense.category);
      if (budgetForCategory) {
        const totalExpenseForCategory = expenses.reduce((total, exp) => {
          if (exp.category === expense.category) {
            return total + exp.amount;
          }
          return total;
        }, 0);

        const newTotal = totalExpenseForCategory + parseFloat(expense.amount);
        if (newTotal > budgetForCategory.limit) {
          setAlertMessage(`Adding this expense exceeds the budget limit for ${expense.category}`);
          return;
        }
      }

      let updatedExpenses;
      if (expenseToEdit && expenseToEdit._id) {
        const response = await axios.put(`/api/expenses/${expenseToEdit._id}`, expense, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        updatedExpenses = expenses.map((exp) => (exp._id === expenseToEdit._id ? response.data : exp));
      } else {
        const response = await axios.post('/api/expenses', expense, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        updatedExpenses = [...expenses, response.data];
      }
      setExpenses(updatedExpenses);
      setExpenseToEdit(null);
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleEdit = (expense) => {
    setExpenseToEdit(expense);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const clearEdit = () => {
    setExpenseToEdit(null);
  };

  return (
    <div>
      <Navbar />
      <div style={containerStyle}>
        {alertMessage && <div style={{ color: 'red' }}>{alertMessage}</div>}
        <ExpenseForm onSave={handleSave} expenseToEdit={expenseToEdit} clearEdit={clearEdit} />
        <ExpenseTable onEdit={handleEdit} onDelete={handleDelete} expenses={expenses} />
      </div>
    </div>
  );
};

export default ExpenseManager;
