import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchExpenses } from '../../services/api';

const ExpenseTrendChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [theme, setTheme] = useState('light');
  const [dataEmpty, setDataEmpty] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme); // Set theme from localStorage
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const expenses = await fetchExpenses();
        if (!expenses || expenses.length === 0) throw new Error('No expenses fetched');

        const BudgetExpenses = expenses.filter(expense => expense.budget !== null);

        const today = new Date();
        const past30Days = new Date(today.setDate(today.getDate() - 30));

        const filteredExpenses = BudgetExpenses.filter(expense => new Date(expense.date) >= past30Days);

        if (filteredExpenses.length === 0) {
          setDataEmpty(true);
          return;
        } else {
          setDataEmpty(false);
        }

        // Sort filtered expenses by date
        const sortedExpenses = filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Format dates as MM/DD
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month
          return `${month}/${day}`;
        };

        const dates = sortedExpenses.map(expense => formatDate(expense.date));
        const amounts = sortedExpenses.map(expense => expense.amount);

        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'Expense Trend',
              data: amounts,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: theme === 'light' ? 'rgba(75,192,192,0.2)' : 'rgba(255,255,255,0.2)',
            },
          ],
        });
      } catch (error) {
        setDataEmpty(true);
      }
    };

    getData();
  }, [theme]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: theme === 'light' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', // Adjust tick color based on theme
          callback: function (value) {
            return `RS. ${value}`; // Add currency symbol in front of the amount
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw || 0;
            return `RS. ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className={`shadow-md rounded-lg p-4 ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
      {dataEmpty ? (
        <div className={`py-4 text-${theme === 'dark' ? 'white' : 'gray-900'} text-center`}>
          No data available.
        </div>
      ) : (
        <div ref={chartRef} style={{ width: '100%', height: '500px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default ExpenseTrendChart;
