import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BudgetChart = ({ budgets, expenses, theme }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Ref to store the Chart.js instance

  useEffect(() => {
    if (chartRef.current && budgets.length > 0 && expenses.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy existing chart instance if it exists
      }

      // Create a mapping of budget IDs to categories
      const budgetCategoryMap = budgets.reduce((map, budget) => {
        map[budget._id] = budget.category;
        return map;
      }, {});

      // Calculate budget limits and total expenses for each category
      const categoryExpenseMap = expenses.reduce((acc, expense) => {
        const category = budgetCategoryMap[expense.budget];
        if (category) {
          acc[category] = (acc[category] || 0) + expense.amount;
        }
        return acc;
      }, {});

      const labels = budgets.map((budget) => budget.category);
      const budgetLimits = budgets.map((budget) => budget.limit);
      const totalExpenses = labels.map((label) => categoryExpenseMap[label] || 0);

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Budget Limit',
              backgroundColor: theme === 'light' ? 'rgba(54, 162, 235, 0.6)' : 'rgba(33, 150, 243, 0.6)', // Blue color for budget limit
              borderColor: theme === 'light' ? 'rgba(54, 162, 235, 1)' : 'rgba(33, 150, 243, 1)',
              borderWidth: 1,
              data: budgetLimits,
            },
            {
              label: 'Total Expenses',
              backgroundColor: theme === 'light' ? 'rgba(255, 99, 132, 0.6)' : 'rgba(255, 64, 129, 0.6)', // Red color for total expenses
              borderColor: theme === 'light' ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 64, 129, 1)',
              borderWidth: 1,
              data: totalExpenses,
            },
          ],
        },
        options: {
          indexAxis: 'y', // Ensure horizontal bar chart
          responsive: true, // Make the chart responsive
          maintainAspectRatio: false, // Allow chart to adjust its size
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {                
              },
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.dataset.label + ': RS. ' + tooltipItem.raw.toFixed(2);
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Amount',
                
              },
              ticks: {
                beginAtZero: true,
                
              },
            },
            y: {
              title: {
                display: true,
                text: 'Category',
                
              },
              ticks: {
                font: {
                  size: 12,
                },
                autoSkip: false,
                maxRotation: 45,
                
              },
            },
          },
        },
      });
    }
  }, [budgets, expenses, theme]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}> {/* Ensure chart container is responsive */}
      <canvas ref={chartRef} />
    </div>
  );
};

export default BudgetChart;
