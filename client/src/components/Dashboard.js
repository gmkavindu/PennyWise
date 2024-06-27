import React, { useEffect, useState } from 'react';
import { fetchExpenses, fetchBudgets } from '../services/api';
import ExpenseCategoryChart from './visualization/ExpenseCategoryChart';
import ProgressBar from './ProgressBar';
import Navbar from './Navbar'; // Import Navbar component

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '32px',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  section: {
    marginBottom: '40px',
  },
  latestExpenses: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  expenseItem: {
    width: '100%',
    maxWidth: '600px',
    background: '#f9f9f9',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    margin: '5px 0',
  },
  noDataMessage: {
    color: '#999',
    fontSize: '16px',
    textAlign: 'center',
  },
};

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const expensesData = await fetchExpenses();
        const budgetsData = await fetchBudgets();
        setExpenses(expensesData);
        setBudgets(budgetsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, []);

  const calculateTotalExpenses = (category) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  return (
    <div>
      <Navbar /> {/* Include Navbar component */}
      <div style={styles.container}>
        <h1 style={styles.title}>Dashboard</h1>
        <div style={styles.section}>
          <h2>Latest Expenses</h2>
          <div style={styles.latestExpenses}>
            {expenses.length > 0 ? (
              expenses
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort expenses by date in descending order
                .slice(0, 5)
                .map((expense) => (
                  <div key={expense._id} style={styles.expenseItem}>
                    <p>{expense.description}</p>
                    <p>Amount: ${expense.amount}</p>
                    <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                ))
            ) : (
              <p style={styles.noDataMessage}>No recent expenses</p>
            )}
          </div>
        </div>
        <div style={styles.section}>
          <h2>Expenses by Category</h2>
          <ExpenseCategoryChart styles={styles} />
        </div>
        <div style={styles.section}>
          <h2>Budget Progress</h2>
          {budgets.map((budget) => {
            const totalExpenses = calculateTotalExpenses(budget.category);
            return (
              <ProgressBar
                key={budget._id}
                category={budget.category}
                total={budget.limit}
                current={totalExpenses}
                styles={styles}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
