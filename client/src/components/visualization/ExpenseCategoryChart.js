import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { fetchExpenses } from '../../services/api';

const ExpenseCategoryChart = () => {
  const chartRef = useRef(null);
  const [dataEmpty, setDataEmpty] = useState(false);

  useEffect(() => {
    const getDataAndRenderChart = async () => {
      try {
        const expenses = await fetchExpenses();
        if (!expenses || expenses.length === 0) {
          setDataEmpty(true); // Set state to indicate no expenses fetched
          return;
        }

        const categories = expenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {});

        const chartData = Object.keys(categories).map((category) => ({
          value: categories[category],
          name: category,
        }));

        renderChart(chartData);
      } catch (error) {
        console.error('Error fetching or processing data:', error);
      }
    };

    getDataAndRenderChart();
  }, []);

  const renderChart = (data) => {
    const myChart = echarts.init(chartRef.current);

    const option = {
      backgroundColor: localStorage.getItem('theme') === 'dark' ? '#1f2937' : '#ffffff', // Background color based on theme
      color: localStorage.getItem('theme') === 'dark' ? ['#36A2EB', '#FFCE56', '#E74C3C', '#9966FF', '#7F8C8D'] : ['#2E86C1', '#17A589', '#E74C3C', '#9B59B6', '#1ABC9C'], // Colors based on theme
      tooltip: {
        trigger: 'item',
        formatter: '{b}: RS. {c}', // Tooltip label format
        textStyle: {
          color: localStorage.getItem('theme') === 'dark' ? '#ffffff' : '#333333', // Tooltip text color based on theme
        },
        backgroundColor: localStorage.getItem('theme') === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)', // Tooltip background color based on theme
      },
      legend: {
        top: '5%',
        left: 'center',
        textStyle: {
          color: localStorage.getItem('theme') === 'dark' ? '#ffffff' : '#333333', // Legend text color based on theme
        },
      },
      series: [
        {
          name: 'Expense Categories',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside', // Adjust label position as needed
            textStyle: {
              color: localStorage.getItem('theme') === 'dark' ? '#ffffff' : '#333333', // Label text color based on theme
            },
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              color: localStorage.getItem('theme') === 'dark' ? '#ffffff' : '#333333', // Emphasis label text color based on theme
            },
          },
          data: data,
        },
      ],
    };

    myChart.setOption(option);

    // Resize chart with window resize
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  return (
    <div
      className="shadow-md rounded-lg p-4"
      style={{
        width: '100%',
        maxWidth: '600px', // Adjust maximum width as needed for responsiveness
        margin: '0 auto', // Center align horizontally
        backgroundColor: localStorage.getItem('theme') === 'dark' ? '#1f2937' : '#ffffff', // Adjust background color based on theme
        color: localStorage.getItem('theme') === 'dark' ? '#ffffff' : '#333333', // Adjust text color based on theme
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
