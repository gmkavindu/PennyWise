import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchExpenses } from '../../services/api';
import './ChartStyles.css';

const ExpenseTrendChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

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
              backgroundColor: 'rgba(75,192,192,0.2)',
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
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        ) : (
          <p className="no-data-message">No data available</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseTrendChart;
