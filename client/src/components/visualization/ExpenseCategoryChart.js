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
                '#36A2EB', '#FFCE56', '#E74C3C', '#9966FF',
                '#7F8C8D', '#C70039', '#900C3F', '#581845',
                '#2E86C1', '#17A589', '#E74C3C', '#9B59B6',
                '#1ABC9C', '#2ECC71', '#3498DB', '#E67E22', 
                '#95A5A6', '#D35400', '#F71233', '#F1C40F', 
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
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const label = tooltipItem.label || '';
                      const value = tooltipItem.raw || 0;
                      return `${label}: RS. ${value}`;
                    },
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
