import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar'; // Assuming Navbar is located in src/components/Navbar
import ExpenseTrendChart from './ExpenseTrendChart';
import ExpenseCategoryChart from './ExpenseCategoryChart';
import PastExpenseCategoryChart from './PastExpenseCategoryChart';
import PastExpenseTrendChart from './PastExpenseTrendChart';
import Report from './Report';
import PastExpenseTable from './PastExpenseTable';
import { FaChartPie } from 'react-icons/fa'; // Importing icons from react-icons/fa
import { FaChartLine } from "react-icons/fa6";

const VisualizationDashboard = () => {
  const [theme, setTheme] = useState('light');
  const [period, setPeriod] = useState('lastMonth'); // Default period
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme); // Set theme from localStorage
    }
  }, []);

  useEffect(() => {
    const calculateStartDate = (period) => {
      const today = new Date();
      let startDate;
      switch (period) {
        case 'lastWeek':
          startDate = new Date(today.setDate(today.getDate() - 7));
          break;
        case 'lastMonth':
          startDate = new Date(today.setMonth(today.getMonth() - 1));
          break;
        case 'last3Months':
          startDate = new Date(today.setMonth(today.getMonth() - 3));
          break;
        case 'lastYear':
          startDate = new Date(today.setFullYear(today.getFullYear() - 1));
          break;
        default:
          startDate = today;
      }
      return startDate;
    };

    setStartDate(calculateStartDate(period));
  }, [period]);

  return (
    <div className={`${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} mt-32 mb-20 transition-colors duration-500 ease-in-out`}>
      <Navbar /> {/* Include Navbar component */}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-center text-4xl font-bold mb-8 animate-fadeIn">Data Visualization</h1>
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4"><FaChartLine className="inline-block ml-2 text-xl" /> Expense Trend </h2>
          <div className="shadow-lg rounded-lg overflow-hidden transition-transform transform-gpu hover:scale-105">
            <ExpenseTrendChart />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4"><FaChartPie className="inline-block ml-2 text-xl" /> Expense Distribution by Category </h2>
          <div className="shadow-lg rounded-lg overflow-hidden transition-transform transform-gpu hover:scale-105">
            <ExpenseCategoryChart />
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-10 text-rose-600"> Past Report </h2>
        <div className="mb-4">
          <label htmlFor="period" className="block text-lg font-medium mb-2 mt-4">Select Time Period:</label>
            <select
              id="period"
              className={`p-3 border rounded-lg ${theme === 'light' ? 'border-gray-300 bg-gray-200 text-gray-900' : 'border-gray-600 bg-gray-700 text-gray-100'} focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm`}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="lastWeek">Last Week</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="lastYear">Last Year</option>
            </select>
        </div>

        <div>
          <div className="shadow-lg rounded-lg overflow-hidden transition-transform transform-gpu hover:scale-105">
            <Report startDate={startDate}/>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-rose-600"><FaChartPie className="inline-block ml-2 text-xl " /> Past Expense Trend </h2>
          <div className="shadow-lg rounded-lg overflow-hidden transition-transform transform-gpu hover:scale-105">
            <PastExpenseTrendChart startDate={startDate}/>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 mt-9 text-rose-600"><FaChartPie className="inline-block ml-2 text-xl " /> Past Expense Distribution by Category </h2>
          <div className="shadow-lg rounded-lg overflow-hidden transition-transform transform-gpu hover:scale-105">
            <PastExpenseCategoryChart startDate={startDate} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 mt-9 text-rose-600"><FaChartPie className="inline-block ml-2 text-xl " /> Past Expenses List </h2>
          <div className="shadow-lg rounded-lg overflow-hidden transition-transform transform-gpu hover:scale-105">
            <PastExpenseTable startDate={startDate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationDashboard;
