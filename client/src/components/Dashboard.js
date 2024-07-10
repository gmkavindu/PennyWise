import React, { useEffect, useState } from 'react';
import { fetchExpenses, fetchBudgets } from '../services/api';
import ExpenseCategoryChart from './visualization/ExpenseCategoryChart';
import ProgressBar from './ProgressBar';
import Navbar from './Navbar';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow container mx-auto py-4 px-4 max-w-screen-lg mt-32 mb-20 transition-all duration-500 ease-in-out transform-gpu hover:scale-105">
        <div className="flex items-center mb-4">
          {profilePicture && (
            <img
              src={profilePicture.startsWith('http') ? profilePicture : `${window.location.origin}${profilePicture}`}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4 border-2 border-gray-300 transition-all duration-500 ease-in-out transform-gpu hover:scale-110"
            />
          )}
          <h1 className="text-3xl font-bold animate-fadeIn">{`Welcome, ${name}!`}</h1>
        </div>
        <div className="flex flex-col md:flex-row mb-10">
          <div className="md:w-1/2 pr-4">
            <h2 className="text-2xl font-semibold mb-6">Latest Expenses</h2>
            <div className="flex flex-col items-center">
              {expenses.length > 0 ? (
                expenses
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((expense) => (
                    <div
                      key={expense._id}
                      className={`w-full max-w-lg rounded-lg shadow-md p-4 mb-4 transition-all duration-500 ease-in-out transform-gpu hover:scale-105 ${
                        localStorage.getItem('theme') === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                      }`}
                    >
                      <p className="text-lg font-medium">{expense.description}</p>
                      <p className="text-md">Amount: RS. {expense.amount}</p>
                      <p className="text-sm">Date: {new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-center">No recent expenses</p>
              )}
            </div>
          </div>
          <div className="md:w-1/2 pl-4">
            <h2 className="text-2xl font-semibold mb-6">Expenses by Category</h2>
            <ExpenseCategoryChart />
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Budget Progress</h2>
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
      </div>
    </div>
  );
};

export default Dashboard;
