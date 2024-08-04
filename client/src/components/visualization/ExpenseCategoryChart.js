import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { fetchExpenses, fetchBudgets } from '../../services/api';

const ExpenseCategoryChart = () => {
  const chartRef = useRef(null);
  const [dataEmpty, setDataEmpty] = useState(false);
  const chartInstanceRef = useRef(null);

  const renderChart = (data) => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose(); // Dispose of the existing instance
    }

    const myChart = echarts.init(chartRef.current);
    chartInstanceRef.current = myChart; // Save the new instance to ref

    const theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';

    const option = {
      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
      color: theme === 'dark' 
        ? ['#36A2EB', '#FFCE56', '#E74C3C', '#9966FF', '#7F8C8D', '#2E86C1', '#17A589', '#E74C8C', '#9B59B6', '#1ABC9C']
        : ['#2E86C1', '#17A589', '#E74C8C', '#9B59B6', '#1ABC9C', '#36A2EB', '#FFCE56', '#E74C3C', '#9966FF', '#7F8C8D'],
      tooltip: {
        trigger: 'item',
        formatter: '{b}: RS. {c}',
        textStyle: {
          color: theme === 'dark' ? '#ffffff' : '#333333',
        },
        backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
      },
      legend: {
        top: '0%',
        left: 'center',
        textStyle: {
          color: theme === 'dark' ? '#ffffff' : '#333333',
        },
      },
      series: [
        {
          name: 'Expense Categories',
          type: 'pie',
          radius: ['40%', '80%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'inside',
            color: theme === 'dark' ? '#ffffff' : '#333333',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              color: theme === 'dark' ? '#ffffff' : '#333333',
            },
          },
          data: data,
        },
      ],
    };

    myChart.setOption(option);

    // Resize chart with window resize
    const resizeChart = () => {
      myChart.resize();
    };
    window.addEventListener('resize', resizeChart);

    // Cleanup function to remove resize event listener and dispose of chart instance
    return () => {
      window.removeEventListener('resize', resizeChart);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
      }
    };
  };

  useEffect(() => {
    const getDataAndRenderChart = async () => {
      try {
        const expenses = await fetchExpenses();
        const budgets = await fetchBudgets();

        if (!expenses || expenses.length === 0 || !budgets || budgets.length === 0) {
          setDataEmpty(true);
          return;
        }

        const budgetMap = budgets.reduce((acc, budget) => {
          acc[budget._id] = budget.category;
          return acc;
        }, {});

        const categories = expenses.reduce((acc, expense) => {
          const category = budgetMap[expense.budget];
          if (category) {
            acc[category] = (acc[category] || 0) + expense.amount;
          }
          return acc;
        }, {});

        const chartData = Object.keys(categories).map((category) => ({
          value: categories[category],
          name: category,
        }));

        renderChart(chartData);
      } catch (error) {
        // Handle error appropriately
      }
    };

    getDataAndRenderChart();
  }, []);

  return (
    <div
      className="shadow-md rounded-lg p-4"
      style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: localStorage.getItem('theme') === 'dark' ? '#1f2937' : '#ffffff',
        color: localStorage.getItem('theme') === 'dark' ? '#ffffff' : '#333333',
      }}
    >
      {dataEmpty ? (
        <div className={`py-4 text-${localStorage.getItem('theme') === 'dark' ? 'white' : 'gray-900'} text-center`}>
          No data available.
        </div>
      ) : (
        <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
      )}
    </div>
  );
};

export default ExpenseCategoryChart;
