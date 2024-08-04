import React, { useState, useEffect, Fragment, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';

const ExpenseForm = ({ onSave, expenseToEdit, clearEdit, onClose }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [budgetId, setBudgetId] = useState(''); // State for storing the selected budget ID
  const [expenses, setExpenses] = useState([]);
  const [theme, setTheme] = useState('light');
  const [loadingBudgets, setLoadingBudgets] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
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
        setLoadingBudgets(false);
      }
    };

    fetchBudgets();
  }, []);

  const fetchExpenses = useCallback(async () => {
    if (budgetId) {
      try {
        const response = await axios.get(`/api/expenses?budget=${budgetId}`, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    }
  }, [budgetId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount.toString());
      setCategory(expenseToEdit.category);
      setBudgetId(expenseToEdit.budgetId); // Set the budget ID from the expense being edited
      setDate(new Date(expenseToEdit.date).toISOString().split('T')[0]);
      setDescription(expenseToEdit.description);
      fetchExpenses();
    } else {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setDate(formattedDate);
    }
  }, [expenseToEdit, fetchExpenses]);

  const calculateTotalExpenses = (excludeId = null) => {
    return expenses
      .filter(exp => exp.budget === budgetId && exp._id !== excludeId)
      .reduce((total, exp) => total + exp.amount, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const budgetForId = budgets.find((b) => b._id === budgetId);
    const newAmount = parseFloat(amount);

    let newTotal;

    if (expenseToEdit) {
      const totalExpenses = calculateTotalExpenses(expenseToEdit._id);
      newTotal = totalExpenses + newAmount;
    } else {
      const totalExpenses = calculateTotalExpenses() + newAmount;
      newTotal = totalExpenses;
    }

    if (budgetForId && newTotal > budgetForId.limit) {
      confirmAlert({
        title: 'Budget Limit Exceeded',
        message: `Adding this expense will exceed the budget limit for the selected budget. Do you really want to add this expense?`,
        buttons: [
          {
            label: 'Cancel',
            className: 'react-confirm-alert-button red', // Red button style
          },
          {
            label: 'Edit Budget',
            onClick: () => {
              window.location.href = '/budgets'; // Redirect to budget page
            },
            className: 'react-confirm-alert-button blue', // Blue button style
          },
          {
            label: 'Yes',
            onClick: () => {
              const now = new Date();
              const selectedDate = new Date(date);
              const combinedDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${now.toTimeString().split(' ')[0]}`);

              const expense = {
                amount: newAmount,
                category,
                date: combinedDateTime.toISOString(),
                description,
                budgetId,
                _id: expenseToEdit ? expenseToEdit._id : undefined,
              };

              onSave(expense);
              clearEdit();
              resetForm();
            },
            className: 'react-confirm-alert-button green', // Green button style
          }
        ]
      });
    } else {
      const now = new Date();
      const selectedDate = new Date(date);
      const combinedDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${now.toTimeString().split(' ')[0]}`);

      const expense = {
        amount: newAmount,
        category,
        date: combinedDateTime.toISOString(),
        description,
        budgetId,
        _id: expenseToEdit ? expenseToEdit._id : undefined,
      };

      onSave(expense);
      clearEdit();
      resetForm();
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setBudgetId(''); // Reset budget ID
    setDate('');
    setDescription('');
    setExpenses([]);
  };

  const handleCancel = () => {
    clearEdit();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className={`p-4 rounded shadow-md ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
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
          onChange={(e) => {
            setCategory(e.target.value);
            const selectedBudget = budgets.find(b => b.category === e.target.value);
            setBudgetId(selectedBudget ? selectedBudget._id : '');
          }}
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
          <div className={`mt-1 p-2 block w-full border rounded ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-gray-400'}`}>
            {loadingBudgets ? 'Loading budgets...' : (
              <Fragment>
                No budgets found. Please create a budget first. 
                <Link to="/budgets" className="inline-block px-4 py-1 text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Set your budget here.
                </Link>
              </Fragment>
            )}
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
