import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseForm = ({ onSave, expenseToEdit, clearEdit, onClose }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [theme, setTheme] = useState('light');
  const [loadingBudgets, setLoadingBudgets] = useState(true); // State to manage loading status

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme); // Set theme from localStorage
    }
  }, []);

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
      } finally {
        setLoadingBudgets(false); // Set loading state to false after fetching budgets (whether success or error)
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
    } else {
      setAlertMessage(''); // Clear alert message when no error
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
  };

  const handleCancel = () => {
    clearEdit();
    onClose(); // Close the modal on cancel
  };

  return (
    <form onSubmit={handleSubmit} className={`p-4 rounded shadow-md ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
      {alertMessage && <div className="text-red-500 mb-4">{alertMessage}</div>}
      <div className="mb-4">
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={`mt-1 p-2 block w-full border rounded focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500 border-gray-300 bg-white' : 'focus:ring-blue-500 border-gray-700 bg-gray-700 text-white'}`}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Category</label>
        {!loadingBudgets && budgets.length > 0 ? (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`mt-1 p-2 block w-full border rounded focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500 border-gray-300 bg-white' : 'focus:ring-blue-500 border-gray-700 bg-gray-700 text-white'}`}
            required
          >
            <option value="">Select a category</option>
            {budgets.map((budget) => (
              <option key={budget._id} value={budget.category}>
                {budget.category}
              </option>
            ))}
          </select>
        ) : (
          <div className={`mt-1 p-2 block w-full border rounded ${theme === 'light' ? 'bg-gray-100 text-gray-500' : 'bg-gray-800 text-gray-400'}`}>
            {loadingBudgets ? 'Loading budgets...' : 'No budgets found. Please create a budget first.'}
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`mt-1 p-2 block w-full border rounded focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500 border-gray-300 bg-white' : 'focus:ring-blue-500 border-gray-700 bg-gray-700 text-white'}`}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`mt-1 p-2 block w-full border rounded focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500 border-gray-300 bg-white' : 'focus:ring-blue-500 border-gray-700 bg-gray-700 text-white'}`}
        ></textarea>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={handleCancel}
          className={`px-4 py-2 rounded hover:bg-red-600 transition-all duration-300 ease-in-out ${theme === 'light' ? 'bg-red-500 text-white' : 'bg-gray-700 text-white'}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 ease-in-out ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}
        >
          {expenseToEdit ? 'Update' : 'Add'} Expense
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
