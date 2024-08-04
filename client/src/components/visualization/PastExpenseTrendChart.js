import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchExpenses } from '../../services/api';

const PastExpenseTrendChart = ({ startDate }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [theme, setTheme] = useState('light');
  const [dataEmpty, setDataEmpty] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const expenses = await fetchExpenses();
        if (!expenses || expenses.length === 0) {
          setDataEmpty(true);
          throw new Error('No expenses fetched');
        }

        const nullBudgetExpenses = expenses.filter(expense => expense.budget === null);

        const filteredExpenses = nullBudgetExpenses.filter(expense => new Date(expense.date) >= startDate);

        if (filteredExpenses.length === 0) {
          setDataEmpty(true);
          return;
        } else {
          setDataEmpty(false);
        }

        const sortedExpenses = filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));

        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
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
      }
    };

    getData();
  }, [theme, startDate]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: theme === 'light' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
          callback: function (value) {
            return `RS. ${value}`;
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
        <div className="chart-wrapper" style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default PastExpenseTrendChart;
