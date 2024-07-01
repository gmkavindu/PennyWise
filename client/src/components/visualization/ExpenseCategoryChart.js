import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { fetchExpenses } from '../../services/api';

const ExpenseCategoryChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const getData = async () => {
      try {
        const expenses = await fetchExpenses();
        if (!expenses || expenses.length === 0) throw new Error('No expenses fetched');

        const categories = expenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {});

        setChartData({
          labels: Object.keys(categories),
          datasets: [
            {
              label: 'Expenses by Category',
              data: Object.values(categories),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40'
              ],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching or processing data:', error);
      }
    };

    getData();
  }, []);

  // Determine background color and text color based on theme
  const getBackgroundColor = () => {
    return localStorage.getItem('theme') === 'dark' ? 'bg-gray-800' : 'bg-white';
  };

  const getTextColor = () => {
    return localStorage.getItem('theme') === 'dark' ? 'text-white' : 'text-gray-800';
  };

  return (
    <div className={`shadow-md rounded-lg p-4 ${getBackgroundColor()} ${getTextColor()}`}>
      <div className="h-96"> {/* Increase the height for larger chart */}
        {chartData.labels.length > 0 ? (
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: localStorage.getItem('theme') === 'dark' ? '#fff' : '#333',
                  },
                },
              },
            }}
          />
        ) : (
          <p className="text-center text-gray-500 italic">No data available</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseCategoryChart;
