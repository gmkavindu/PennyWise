import React, { useState, useEffect } from 'react';
import axios from 'axios';

const formStyle = {
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  border: '1px solid #ddd',
  borderRadius: '5px',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const ExpenseForm = ({ onSave, expenseToEdit, clearEdit }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
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

    fetchBudgets();
  }, []);

  useEffect(() => {
    if (category) {
      fetchExpenses(category);
    }
  }, [category]);

  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount.toString());
      setCategory(expenseToEdit.category);
      setDate(new Date(expenseToEdit.date).toISOString().split('T')[0]);
      setDescription(expenseToEdit.description);
      fetchExpenses(expenseToEdit.category);
    } else {
      resetForm();
    }
  }, [expenseToEdit]);

  const fetchExpenses = async (category) => {
    try {
      const response = await axios.get(`/api/expenses?category=${category}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const calculateTotalExpenses = (category, excludeId = null) => {
    return expenses
      .filter(exp => exp.category === category && exp._id !== excludeId)
      .reduce((total, exp) => total + exp.amount, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const budgetForCategory = budgets.find((b) => b.category === category);
    const newAmount = parseFloat(amount);

    let newTotal;

    if (expenseToEdit) {
      const totalExpenses = calculateTotalExpenses(category, expenseToEdit._id);
      newTotal = totalExpenses + newAmount;
    } else {
      const totalExpenses = calculateTotalExpenses(category) + newAmount;
      newTotal = totalExpenses;
    }

    if (budgetForCategory && newTotal > budgetForCategory.limit) {
      const action = expenseToEdit ? 'Editing' : 'Adding';
      setAlertMessage(`${action} this expense exceeds the budget limit for ${category}`);
      return;
    }

    const expense = {
      amount: newAmount,
      category,
      date,
      description,
      _id: expenseToEdit ? expenseToEdit._id : undefined,
    };

    onSave(expense);
    clearEdit();
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDate('');
    setDescription('');
    setExpenses([]);
    setAlertMessage('');
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {alertMessage && <div style={{ color: 'red' }}>{alertMessage}</div>}
      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={inputStyle}
        >
          <option value="">Select Category</option>
          {budgets.map((budget) => (
            <option key={budget._id} value={budget.category}>
              {budget.category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        ></textarea>
      </div>
      <button type="submit" style={buttonStyle}>
        {expenseToEdit ? 'Update' : 'Add'} Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
