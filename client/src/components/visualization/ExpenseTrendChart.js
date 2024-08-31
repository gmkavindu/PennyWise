import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchExpenses } from '../../services/api';

const ExpenseTrendChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [theme, setTheme] = useState('light');
  const [dataEmpty, setDataEmpty] = useState(false);
  const [expenseDetails, setExpenseDetails] = useState({});
  const [timePeriod, setTimePeriod] = useState('3 months'); // Default time period
  const chartRef = useRef(null);

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
        if (!expenses || expenses.length === 0) throw new Error('No expenses fetched');

        const BudgetExpenses = expenses.filter(expense => expense.budget !== null);
        const today = new Date();

        // Calculate start date based on selected time period
        let startDate = new Date();
        switch (timePeriod) {
          case 'Last week':
            startDate.setDate(today.getDate() - 7);
            break;
          case '1 month':
            startDate.setMonth(today.getMonth() - 1);
            break;
          case '2 months':
            startDate.setMonth(today.getMonth() - 2);
            break;
          case '3 months':
            startDate.setMonth(today.getMonth() - 3);
            break;
          case '1 year':
            startDate.setFullYear(today.getFullYear() - 1);
            break;
          default:
            startDate.setMonth(today.getMonth() - 1);
        }

        const filteredExpenses = BudgetExpenses.filter(expense => new Date(expense.date) >= startDate);

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
  }, [theme, timePeriod]); // Depend on timePeriod as well to fetch data when it changes

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
      {/* Time Period Selection */}
      <div className="mb-4 flex items-center">
        <label htmlFor="timePeriod" className={`mr-2 font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          Select Time Period:
        </label>
        <select
          id="timePeriod"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className={`p-2 border rounded ${theme === 'light' ? 'border-gray-300 bg-white text-gray-900' : 'border-gray-600 bg-gray-700 text-white'}`}
        >
          <option value="Last week">Last Week</option>
          <option value="1 month">Last Month</option>
          <option value="2 months">Last 2 Months</option>
          <option value="3 months">Last 3 Months</option>
          <option value="1 year">Last Year</option>
        </select>
      </div>

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
