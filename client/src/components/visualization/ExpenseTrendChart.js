import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchExpenses } from '../../services/api';

const ExpenseTrendChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [theme, setTheme] = useState('light'); // State for theme, default is light

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

        const dates = expenses.map(expense => new Date(expense.date).toLocaleDateString());
        const amounts = expenses.map(expense => expense.amount);

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
        console.error('Error fetching or processing data:', error);
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
        },
      },
    },
  };

  return (
    <div className={`shadow-md rounded-lg p-4 ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
      <div className="chart-wrapper" style={{ height: '400px' }}> {/* Adjust the height as needed */}
        {chartData.labels.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p className="no-data-message">No data available</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseTrendChart;
