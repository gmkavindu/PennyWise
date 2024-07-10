import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar'; // Assuming Navbar is located in src/components/Navbar
import ExpenseTrendChart from './ExpenseTrendChart';
import ExpenseCategoryChart from './ExpenseCategoryChart';
import { FaChartPie } from 'react-icons/fa'; // Importing icons from react-icons/fa
import { FaChartLine } from "react-icons/fa6";

const VisualizationDashboard = () => {
  const [theme, setTheme] = useState('light'); // State for theme, default is light

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme); // Set theme from localStorage
    }
  }, []);

  return (
    <div className={`${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} mt-32 mb-20 transition-colors duration-500 ease-in-out`}>
      <Navbar /> {/* Include Navbar component */}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-center text-4xl font-bold mb-8 animate-fadeIn">Data Visualization</h1>
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4"><FaChartLine className="inline-block ml-2 text-xl" /> Expense Trend Over Time </h2>
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
      </div>
    </div>
  );
};

export default VisualizationDashboard;
