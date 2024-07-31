import React, { useEffect, useState } from 'react';
import { fetchExpenses, fetchBudgets } from '../services/api';
import ExpenseCategoryChart from './visualization/ExpenseCategoryChartDashboard';
import ProgressBar from './ProgressBar';
import Navbar from './Navbar';
import axios from 'axios';
import { FaSpinner, FaChartPie } from 'react-icons/fa';
import { MdDateRange } from 'react-icons/md';
import { FaBarsProgress } from 'react-icons/fa6';
import { GiTakeMyMoney } from "react-icons/gi";
import { BiBox } from "react-icons/bi";
import { TiThList } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const Dashboard = () => {
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const expensesData = await fetchExpenses();
        const budgetsData = await fetchBudgets();
        setExpenses(expensesData);
        setBudgets(budgetsData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/profile', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setName(response.data.name);
        setProfilePicture(response.data.profilePicture || '');
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  }, []);

  const calculateTotalExpenses = (category) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  // Map to store colors for each category
  const categoryColors = {};

  const getCategoryColor = (category) => {
    if (!categoryColors[category]) {
      categoryColors[category] = getRandomLightColor();
    }
    return categoryColors[category];
  };

  const getRandomLightColor = () => {
    const r = Math.floor(Math.random() * 56) + 200;
    const g = Math.floor(Math.random() * 56) + 200;
    const b = Math.floor(Math.random() * 56) + 200;
    return `rgb(${r}, ${g}, ${b})`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-gray-600 mb-4" />
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto py-4 px-4 max-w-screen-lg mt-24 mb-20 flex-1">
        <div className="flex items-center mb-6">
          {profilePicture && (
            <img
              src={profilePicture.startsWith('http') ? profilePicture : `${window.location.origin}${profilePicture}`}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4 border-2 border-gray-300 transition-all duration-500 ease-in-out transform hover:scale-110"
            />
          )}
          <h1 className="text-3xl font-bold animate-fadeIn text-emerald-400">{`Welcome, ${name}!`}</h1>
        </div>
        {expenses.length > 0 ? (
          <div className="flex flex-col md:flex-row mb-10 w-full">
            <div className="md:w-1/2 pr-4">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <TiThList className="mr-2 text-blue-500" />
                Latest Expenses
              </h2>
              <div className="flex flex-col items-center">
                {expenses.length > 0 ? (
                  expenses
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5)
                    .map((expense) => (
                      <div
                        key={expense._id}
                        className={`w-full max-w-lg rounded-lg shadow-md p-4 mb-4 transition-all duration-500 ease-in-out transform hover:scale-105 text-gray-800 font-bold`}
                        style={{ backgroundColor: getCategoryColor(expense.category) }}
                      >
                        <p className="text-lg flex items-center">
                          {/* Conditionally render icon based on description */}
                          {expense.description ? <BiBox  className="mr-2" /> : null}
                          {expense.description || ''}
                        </p>
                        <p className="text-md flex items-center">
                          <GiTakeMyMoney className="mr-2" />
                          Amount: RS. {expense.amount}
                        </p>
                        <p className="text-sm flex items-center">
                          <MdDateRange className="mr-2" />
                          Date: {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-center dark:text-gray-400">No recent expenses. Please add some expenses to see them here.</p>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <FaChartPie className="mr-2 text-purple-500" />
                Expenses by Category
              </h2>
              {expenses.length > 0 ? (
                <div className="shadow-lg rounded-lg overflow-hidden transition-transform transform-gpu hover:scale-105">
                  <ExpenseCategoryChart />
                </div>
              ) : (
                <p className="text-gray-500 text-center dark:text-gray-400">No expenses data available for chart. Please add some expenses to see the chart here.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center dark:text-gray-400 mb-10">No expenses available. Please add some expenses.</p>
        )}
        {budgets.length > 0 ? (
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <FaBarsProgress className="mr-2 text-green-500" />
              Budget Progress
            </h2>
            <div className="flex flex-col">
              {budgets.map((budget) => {
                const totalExpenses = calculateTotalExpenses(budget.category);
                return (
                  <ProgressBar
                    key={budget._id}
                    category={budget.category}
                    total={budget.limit}
                    current={totalExpenses}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center dark:text-gray-400">
            No budgets available. Please add some budgets to track your expenses.<br /><br />
            <Link 
              to="/budgets" 
              className="inline-block px-4 py-2 text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Set your budget here.
            </Link>
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
