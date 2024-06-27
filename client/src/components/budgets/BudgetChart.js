import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js without LinearScale

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
              backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue color for budget limit
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              data: budgetLimits,
              order: 1, // Ensure budget bars are behind expense bars
            },
            {
              label: 'Total Expenses',
              backgroundColor: 'rgba(180, 0, 0, 0.6)', // Dark red color for total expenses
              borderColor: 'rgba(180, 0, 0, 1)',
              borderWidth: 1,
              data: totalExpenses,
              order: 2, // Ensure expense bars are in front of budget bars
            },
          ],
        },
        options: {
          indexAxis: 'y',
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.dataset.label + ': $' + tooltipItem.raw.toFixed(2);
                },
              },
            },
          },
          scales: {
            x: {
              display: false, // Hide x-axis labels and grid lines
            },
            y: {
              stacked: true,
              title: {
                display: true,
                text: 'Category',
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
          },
        },
      });
    }
  }, [budgets, expenses]);

  return <canvas ref={chartRef} />;
};

export default BudgetChart;
