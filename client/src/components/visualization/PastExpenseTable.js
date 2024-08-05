import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrash } from 'react-icons/fa';
import { fetchExpenses } from '../../services/api'; // Ensure the import path is correct
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert'; // Import confirmAlert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS for confirmAlert

const PastExpenseTable = ({ startDate }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [theme, setTheme] = useState('light');
  const [showSearchFields, setShowSearchFields] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const expensesData = await fetchExpenses();
        setExpenses(expensesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getExpenses();
  }, []);

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      // Refresh expenses after deletion
      const expensesData = await fetchExpenses();
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleClearNullBudgetExpenses = () => {
    confirmAlert({
      title: 'Confirm to clear',
      message: 'Are you sure you want to delete all expenses with no budget?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            expenses
              .filter(expense => expense.budget === null)
              .forEach(expense => handleDeleteExpense(expense._id));
          },
          className: 'react-confirm-alert-button'
        },
        {
          label: 'No',
          className: 'react-confirm-alert-button red'
        }
      ]
    });
  };

  const categories = [...new Set(expenses.map((expense) => expense.category))];

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const isWithinDateRange =
      (!startDate || expenseDate >= new Date(startDate));

    return (
      expense.budget === null &&
      (filterCategory === '' || expense.category === filterCategory) &&
      isWithinDateRange &&
      (searchTerm === '' || expense.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const anyExpensesWithNullBudget = expenses.some(expense => expense.budget === null);

  return (
    <div className={`p-4 rounded shadow-lg mb-4 ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between">
        <button
          onClick={() => setShowSearchFields(!showSearchFields)}
          className={`flex items-center justify-center mb-4 w-full sm:w-auto px-4 py-2 ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-blue-700 text-white'} rounded-full hover:bg-${theme === 'light' ? 'blue-600' : 'blue-800'}`}
        >
          <FaSearch className="mr-2" />
          Search Past Expenses
        </button>
        {anyExpensesWithNullBudget && (
          <button
            onClick={handleClearNullBudgetExpenses}
            className={`flex items-center justify-center w-full sm:w-auto px-4 py-2 ${theme === 'light' ? 'bg-rose-500 text-white' : 'bg-rose-700 text-white'} rounded-full hover:bg-${theme === 'light' ? 'rose-600' : 'rose-800'}`}
          >
            Delete All
          </button>
        )}
      </div>

      {showSearchFields && (
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by description"
              value={searchTerm}
              onChange={handleSearchTermChange}
              className={`block w-full p-2 pl-10 pr-4 border ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'text-gray-900' : 'text-white'} ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-600'}`}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className={`${theme === 'light' ? 'text-gray-400' : 'text-gray-300'}`} />
            </div>
          </div>
          <div className="relative w-full sm:w-auto">
            <select
              value={filterCategory}
              onChange={handleCategoryChange}
              className={`block w-full p-2 pl-10 pr-4 border ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'text-gray-900' : 'text-white'} ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-600'}`}
            >
              <option value="">Filter by category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {filteredExpenses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
              {filteredExpenses.map((expense, index) => (
                <tr key={expense._id} className={`text-${theme === 'light' ? 'gray-900' : 'white'} transition-all duration-300 ${index % 2 === 0 ? 'bg-opacity-50' : 'bg-opacity-75'} hover:${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
                  <td className="px-4 py-3">{expense.amount}</td>
                  <td className="px-4 py-3">{expense.category}</td>
                  <td className="px-4 py-3">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{expense.description}</td>
                  <td className="px-9 py-3">
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className={`text-${theme === 'light' ? 'red-600' : 'red-400'} hover:text-${theme === 'light' ? 'red-700' : 'red-300'} transition-colors`}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No expenses found</div>
      )}
    </div>
  );
};

export default PastExpenseTable;
