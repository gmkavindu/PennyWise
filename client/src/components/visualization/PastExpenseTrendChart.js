import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchExpenses } from '../../services/api';

const PastExpenseTrendChart = ({ startDate }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [theme, setTheme] = useState('light');
  const [dataEmpty, setDataEmpty] = useState(false);
  const [expenseDetails, setExpenseDetails] = useState({});

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

        // Filter expenses based on the calculated start date
        const filteredExpenses = nullBudgetExpenses.filter(expense => new Date(expense.date) >= startDate);

        if (filteredExpenses.length === 0) {
          setDataEmpty(true);
          return;
        } else {
          setDataEmpty(false);
        }

        // Group expenses by date
        const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
          const dateKey = new Date(expense.date).toLocaleDateString(); // Format date as MM/DD/YYYY
          if (!acc[dateKey]) {
            acc[dateKey] = {
              totalAmount: 0,
              details: [],
            };
          }
          acc[dateKey].totalAmount += expense.amount;
          acc[dateKey].details.push(expense);
          return acc;
        }, {});

        // Extract dates and corresponding total amounts
        const dates = Object.keys(groupedExpenses).sort((a, b) => new Date(a) - new Date(b));
        const amounts = dates.map(date => groupedExpenses[date].totalAmount);

        // Set expense details for tooltips
        setExpenseDetails(groupedExpenses);

        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'Expense Trend',
              data: amounts,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: theme === 'light' ? 'rgba(75,192,192,0.2)' : 'rgba(255,255,255,0.2)',
              pointBackgroundColor: theme === 'light' ? 'rgba(75,192,192,1)' : 'rgba(255,255,255,0.8)',
            },
          ],
        });
      } catch (error) {
        setDataEmpty(true);
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
          title: (tooltipItems) => {
            return `Date: ${tooltipItems[0].label}`;
          },
          label: (tooltipItem) => {
            const date = tooltipItem.label;
            const expensesForDate = expenseDetails[date]?.details || [];
            const totalAmount = expenseDetails[date]?.totalAmount || 0;

            const total = `Total: RS. ${totalAmount}`;
            const details = expensesForDate.map(expense =>
              `RS. ${expense.amount} - ${expense.description} (${expense.category})`
            );

            return [total, ...details];
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
