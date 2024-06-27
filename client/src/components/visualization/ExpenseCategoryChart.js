import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { fetchExpenses } from '../../services/api';
import './ChartStyles.css';

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

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        {chartData.labels.length > 0 ? (
          <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        ) : (
          <p className="no-data-message">No data available</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseCategoryChart;
