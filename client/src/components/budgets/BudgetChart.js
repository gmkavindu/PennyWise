// src/components/budgets/BudgetChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js without LinearScale

// eslint-disable-next-line no-unused-vars
import { LinearScale } from 'chart.js';

const BudgetChart = ({ budgets, expenses }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Ref to store the Chart.js instance

  useEffect(() => {
    if (chartRef.current && budgets.length > 0 && expenses.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy existing chart instance if it exists
      }

      const labels = budgets.map((budget) => budget.category);
      const budgetLimits = budgets.map((budget) => budget.limit);
      const totalExpenses = labels.map((label) =>
        expenses.reduce((total, exp) => (exp.category === label ? total + exp.amount : total), 0)
      );

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Budget Limit',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              data: budgetLimits,
            },
            {
              label: 'Total Expenses',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              data: totalExpenses,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount',
              },
            },
          },
        },
      });
    }
  }, [budgets, expenses]);

  return <canvas ref={chartRef} width="400" height="200" />;
};

export default BudgetChart;
