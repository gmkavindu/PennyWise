import React, { useState, useEffect } from 'react';
import { fetchIncomeDetails } from '../../services/api';
import CustomDropdown from './CustomDropdown'; // Adjust the path as needed

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

const IncomeForm = ({ onSave, onClose, clearEdit, theme, initialIncomes = [] }) => {
  const calculateExpirationDate = (startDate, period, customPeriod) => {
    const date = new Date(startDate);
    switch (period) {
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      case 'custom':
        if (customPeriod && !isNaN(customPeriod)) {
          date.setDate(date.getDate() + Number(customPeriod));
        }
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }
    return date.toISOString().split('T')[0];
  };

  const [income, setIncome] = useState('');
  const [category, setCategory] = useState('Salary');
  const [customCategory, setCustomCategory] = useState('');
  const [categories, setCategories] = useState(['Salary', 'Business', 'Freelance', 'Investment', 'Rental Income', 'Side Hustle', 
    'Pension', 'Savings Interest', 'Gifts', 'Royalties', 'Dividends', 'Allowances',
    'Bonuses', 'Commissions', 'Grants', 'Scholarships', 'Trust Funds', 'Inheritance']);
  const [period, setPeriod] = useState('monthly');
  const [startDate, setStartDate] = useState(formattedDate);
  const [customPeriod, setCustomPeriod] = useState('');
  const [expirationDate, setExpirationDate] = useState(calculateExpirationDate(formattedDate, 'monthly', ''));
  const [incomes, setIncomes] = useState(initialIncomes);
  const [totalIncome, setTotalIncome] = useState(0);


  useEffect(() => {
    setExpirationDate(calculateExpirationDate(startDate, period, customPeriod));
  }, [startDate, period, customPeriod]);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const incomeData = await fetchIncomeDetails();
        console.log('Fetched income data:', incomeData); // Log the data for inspection

        if (incomeData && Array.isArray(incomeData.categories)) {
          setIncomes(incomeData.categories); // Store categories in state
        } else {
          console.error('Income details not found or is not an array:', incomeData);
        }
      } catch (error) {
        console.error('Error fetching income details:', error);
      }
    };

    fetchIncomeData();
  }, []);

  useEffect(() => {
    const newTotalIncome = incomes.reduce((acc, detail) => acc + detail.amount, 0);
    setTotalIncome(newTotalIncome);
  }, [incomes]);
  

  const handleAddIncome = () => {
    if (income) {
      const newIncome = { category, amount: Number(income) };
      setIncomes([...incomes, newIncome]);
      setIncome('');
    }
  };


  const handleRemoveIncome = (index) => {
    const updatedIncomes = incomes.filter((_, i) => i !== index);
    setIncomes(updatedIncomes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (income) {
      handleAddIncome();
    }
    const payload = {
      categories: incomes,
      details: {
        period,
        customPeriod: period === 'custom' ? Number(customPeriod) : 0,
        startDate,
        expirationDate
      }
    };
    onSave(payload);
    if (clearEdit) clearEdit();
  };

  const handleAddCategory = () => {
    if (customCategory && !categories.includes(customCategory)) {
      setCategories([...categories, customCategory]);
      setCategory(customCategory);
      setCustomCategory('');
    }
  };

  const handleResetIncome = () => {
    setIncomes([]);
    setIncome(''); // Ensure income field is blank
    if (clearEdit) clearEdit();
  };
  

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${theme === 'light' ? 'bg-gray-900 bg-opacity-50' : 'bg-gray-800 bg-opacity-75'}`}>
      <div className={`bg-${theme === 'light' ? 'white' : 'gray-900'} text-${theme === 'light' ? 'gray-900' : 'white'} w-full max-w-lg p-6 rounded-lg shadow-lg overflow-y-auto max-h-screen`}>
        <h2 className="text-center text-xl font-bold mb-4">Add Income</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} htmlFor="income">
              Income Amount
            </label>
            <input
              type="number"
              id="income"
              className={`w-full p-2 border rounded-md ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              required={incomes.length === 0 && income === 0}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} htmlFor="category">
              Income Category
            </label>
            <CustomDropdown
              options={categories}
              selected={category}
              onSelect={(selected) => setCategory(selected)}
              theme={theme}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} htmlFor="customCategory">
              Add Custom Category
            </label>
            <div className="flex">
              <input
                type="text"
                id="customCategory"
                className={`w-full p-2 border rounded-md ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
              <button type="button" className={`py-2 px-4 rounded-md ml-2 ${theme === 'light' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`} onClick={handleAddCategory}>
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            
            <button type="button" className={`py-2 px-4 rounded-md ${theme === 'light' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`} onClick={handleResetIncome}>
              Reset Income
            </button>
            <button type="button" className={`py-2 px-4 rounded-md ml-2 ${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`} onClick={handleAddIncome}>
              Add Income
            </button>
          </div>
          <div className="mb-4">
            <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Added Incomes</h3>
            {incomes.length > 0 ? (
              <ul className="list-disc list-inside">
                {incomes.map((inc, index) => (
                  <li key={index} className="flex justify-between items-center mb-2">
                    <span>{inc.category}: RS. {inc.amount}</span>
                    <button type="button" className={`py-1 px-2 rounded-md ${theme === 'light' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`} onClick={() => handleRemoveIncome(index)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>No incomes added yet.</p>
            )}
          </div>
          <div className="mb-4">
            <span className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Total Income: RS. {totalIncome}
            </span>
          </div>
          


          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} htmlFor="period">
              Budget Period
            </label>
            <select
              id="period"
              className={`w-full p-2 border rounded-md ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
              value={period}
              onChange={(e) => {
                const newPeriod = e.target.value;
                setPeriod(newPeriod);
                if (newPeriod !== 'custom') {
                  setCustomPeriod('');
                }
              }}
              required
            >
              <option value="weekly">Week</option>
              <option value="monthly">Month</option>
              <option value="yearly">Year</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {period === 'custom' && (
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} htmlFor="customPeriod">
                Custom Period (in days)
              </label>
              <input
                type="number"
                id="customPeriod"
                className={`w-full p-2 border rounded-md ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
                value={customPeriod}
                onChange={(e) => setCustomPeriod(e.target.value)}
              />
            </div>
          )}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} htmlFor="startDate">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className={`w-full p-2 border rounded-md ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} htmlFor="expirationDate">
              Expiration Date
            </label>
            <input
              type="date"
              id="expirationDate"
              className={`w-full p-2 border rounded-md ${theme === 'light' ? 'bg-gray-200 border-gray-300 text-gray-700' : 'bg-gray-600 border-gray-500 text-gray-300'}`}
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              required
              readOnly
            />
          </div>
  
          <div className="flex justify-end">
            
            <button type="button" className={`py-2 px-4 rounded-md ${theme === 'light' ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'}`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`py-2 px-4 rounded-md ml-2 ${theme === 'light' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeForm;
