import React, { useEffect, useState } from 'react';
import { fetchExpenses, fetchBudgets } from '../services/api';
import ExpenseCategoryChart from './visualization/ExpenseCategoryChart';
import ProgressBar from './ProgressBar';
import Navbar from './Navbar';
import axios from 'axios';
import { FaSpinner, FaChartPie } from 'react-icons/fa';
import { IoIosPricetags } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { FaBarsProgress } from "react-icons/fa6";
import { PiCurrencyCircleDollarBold } from "react-icons/pi";
import { TiThList } from "react-icons/ti";




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
        console.error('Error fetching data:', error);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-gray-600 mb-4" />
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="container mx-auto py-4 px-4 max-w-screen-lg mt-24 mb-20">
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
                        className={`w-full max-w-lg rounded-lg shadow-md p-4 mb-4 transition-all duration-500 ease-in-out transform hover:scale-105 ${
                          localStorage.getItem('theme') === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                        }`}
                      >
                        <p className="text-lg font-medium flex items-center ">
                          <IoIosPricetags className="mr-2 text-emerald-500" />
                          {expense.description}
                        </p>
                        <p className="text-md flex items-center">
                          <PiCurrencyCircleDollarBold  className="mr-2 text-pink-600" />
                          Amount: RS. {expense.amount}
                        </p>
                        <p className="text-sm flex items-center">
                          <MdDateRange className="mr-2 text-sky-500" />
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
          <p className="text-gray-500 text-center dark:text-gray-400">No budgets available. Please add some budgets to track your expenses.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
