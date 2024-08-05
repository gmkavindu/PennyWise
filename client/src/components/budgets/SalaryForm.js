import React, { useState, useEffect } from 'react';

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

const SalaryForm = ({ onSave, currentSalary = '', currentPeriod = 'monthly', currentStartDate = formattedDate, currentCustomPeriod = '', onClose, theme, user }) => {
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
          if (Number(customPeriod) === 0) {
            return formattedDate; // Return start date if customPeriod is 0
          }
          date.setDate(date.getDate() + Number(customPeriod));
        }
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }
    return date.toISOString().split('T')[0];
  };

  const [salary, setSalary] = useState(Number(currentSalary) || ''); // Ensure salary is a number or empty string
  const [period, setPeriod] = useState(currentPeriod || 'monthly');
  const [startDate, setStartDate] = useState(currentStartDate || formattedDate);
  const [customPeriod, setCustomPeriod] = useState(Number(currentCustomPeriod) || '');
  const [expirationDate, setExpirationDate] = useState(calculateExpirationDate(currentStartDate, currentPeriod, currentCustomPeriod));

  useEffect(() => {
    setSalary(Number(currentSalary) || ''); // Ensure salary is a number or empty string
    setPeriod(currentPeriod || 'monthly');
    setStartDate(currentStartDate || formattedDate);
    setCustomPeriod(Number(currentCustomPeriod) || '');
  }, [currentSalary, currentPeriod, currentStartDate, currentCustomPeriod]);

  useEffect(() => {
    setExpirationDate(calculateExpirationDate(startDate, period, customPeriod));
  }, [startDate, period, customPeriod]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (salary) {
      const localStartDate = new Date(startDate).toISOString().split('T')[0];
      const localExpirationDate = new Date(expirationDate).toISOString().split('T')[0];
      onSave({ salary, period, startDate: localStartDate, expirationDate: localExpirationDate, customPeriod, user });
    }
  };

  const handleReset = () => {
    setSalary('');
    setCustomPeriod('');
    const newExpirationDate = calculateExpirationDate(startDate, period, customPeriod);
    setExpirationDate(newExpirationDate);
    const localStartDate = new Date(startDate).toISOString().split('T')[0];
    const localExpirationDate = new Date(newExpirationDate).toISOString().split('T')[0];
    onSave({ salary: 0, period, startDate: localStartDate, expirationDate: localExpirationDate, customPeriod, user });
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-md ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}
    >
      <h2 className="text-center text-xl font-bold mb-4">
        {currentSalary === 0 ? 'Add Salary' : 'Update Salary'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
            htmlFor="salary"
          >
            Salary Amount
          </label>
          <input
            type="number"
            id="salary"
            className={`w-full p-2 border rounded-md ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
            value={salary}
            onChange={(e) => {
              const value = e.target.value;
              setSalary(value ? Number(value) : ''); // Ensure salary is a number or empty string
            }}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
            htmlFor="period"
          >
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
                setCustomPeriod(''); // Clear customPeriod if not using custom
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
            <label
              className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
              htmlFor="customPeriod"
            >
              Custom Period (in days)
            </label>
            <input
              type="number"
              id="customPeriod"
              className={`w-full p-2 border rounded-md ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
              value={customPeriod}
              onChange={(e) => {
                const value = e.target.value;
                setCustomPeriod(value ? Number(value) : ''); // Ensure customPeriod is a number or empty string
              }}
            />
          </div>
        )}
        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
            htmlFor="startDate"
          >
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
          <label
            className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
            htmlFor="expirationDate"
          >
            Valid Date
          </label>
          <input
            type="date"
            id="expirationDate"
            className={`w-full p-2 border rounded-md ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
            value={expirationDate}
            readOnly
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className={`py-2 px-4 rounded-md mr-2 ${theme === 'light' ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
            onClick={onClose}
          >
            Cancel
          </button>
          {currentSalary !== 0 && (
            <button
              type="button"
              className={`py-2 px-4 rounded-md mr-2 ${theme === 'light' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
              onClick={handleReset}
            >
              Reset Salary
            </button>
          )}
          <button
            type="submit"
            className={`py-2 px-4 rounded-md ${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {currentSalary === 0 ? 'Add Salary' : 'Update Salary'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalaryForm;
