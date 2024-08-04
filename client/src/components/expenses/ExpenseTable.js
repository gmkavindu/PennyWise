import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { RiPencilLine, RiDeleteBinLine } from 'react-icons/ri';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ExpenseTable = ({ onEdit, onDelete, expenses, onAddExpense }) => {
  // State hooks for search term, filter criteria, theme, and visibility of search fields
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [theme, setTheme] = useState('light');
  const [showSearchFields, setShowSearchFields] = useState(false);

  // Effect hook to load the theme from local storage on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  // Event handlers for input changes
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  // Function to handle expense deletion with confirmation
  const handleDeleteClick = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this expense?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => onDelete(id),
          className: 'react-confirm-alert-button'
        },
        {
          label: 'No',
          className: 'react-confirm-alert-button red'
        }
      ]
    });
  };

  // Generate a list of unique categories from the expenses
  const categories = [...new Set(expenses.map((expense) => expense.category))];

  // Filter and sort expenses based on search term, category, and date
  const filteredExpenses = expenses.filter((expense) => {
    return (

      expense.budget !== null && 
      (filterCategory === '' || expense.category === filterCategory) &&
      (filterDate === '' || new Date(expense.date).toISOString().split('T')[0] === filterDate) &&
      (searchTerm === '' || expense.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by `createdAt` field

  return (
    <div className={`p-4 rounded shadow-lg mb-4 ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
      {/* Buttons to toggle search fields and add a new expense */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between">
        <button
          onClick={() => setShowSearchFields(!showSearchFields)}
          className={`flex items-center justify-center mb-4 w-full sm:w-auto px-4 py-2 ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-blue-700 text-white'} rounded-full hover:bg-${theme === 'light' ? 'blue-600' : 'blue-800'}`}
        >
          <FaSearch className="mr-2" />
          Search Expenses
        </button>
        <button
          onClick={onAddExpense}
          className={`flex items-center justify-center w-12 h-12 mb-2 ${theme === 'light' ? 'bg-green-500 text-white' : 'bg-green-700 text-white'} rounded-full hover:bg-${theme === 'light' ? 'green-600' : 'green-800'}`}
        >
          <FaPlus className="text-xl" />
        </button>
      </div>

      {/* Conditional rendering of search fields */}
      {showSearchFields && (
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Search by description input */}
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
          {/* Category filter dropdown */}
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
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className={`${theme === 'light' ? 'text-gray-400' : 'text-gray-300'}`} />
            </div>
          </div>
          {/* Date filter input */}
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={filterDate}
              onChange={handleDateChange}
              className={`block w-full p-2 pl-10 pr-4 border ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'text-gray-900' : 'text-white'} ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-600'}`}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className={`${theme === 'light' ? 'text-gray-400' : 'text-gray-300'}`} />
            </div>
          </div>
        </div>
      )}

      {/* Conditional rendering of the table or a message if no expenses are found */}
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
                <tr key={expense._id} className={`text-${theme === 'light' ? 'gray-900' : 'white'} transition-all duration-300 ${index % 2 === 0 ? 'bg-opacity-50' : 'bg-opacity-75'} hover:${theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'}`}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">RS. {expense.amount}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{expense.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{new Date(expense.date).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{expense.description}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className={`p-2 ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'} rounded-full hover:bg-${theme === 'light' ? 'blue-600' : 'blue-700'}`}
                    >
                      <RiPencilLine />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(expense._id)}
                      className={`p-2 ${theme === 'light' ? 'bg-red-500 text-white' : 'bg-red-600 text-white'} rounded-full hover:bg-${theme === 'light' ? 'red-600' : 'red-700'}`}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`py-4 text-${theme === 'light' ? 'gray-900' : 'white'} text-center`}>
          No expenses found. Add new expenses using the button above.
        </div>
      )}
    </div>
  );
};


export default ExpenseTable;
