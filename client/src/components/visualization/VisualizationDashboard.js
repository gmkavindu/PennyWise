import React from 'react';
import Navbar from '../Navbar'; // Assuming Navbar is located in src/components/Navbar
import ExpenseTrendChart from './ExpenseTrendChart';
import ExpenseCategoryChart from './ExpenseCategoryChart';

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    color: '#333',
    marginBottom: '20px',
  },
  chartSection: {
    marginBottom: '40px',
  },
  chartTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#555',
  },
  noDataMessage: {
    color: '#999',
    fontSize: '16px',
  }
};

const VisualizationDashboard = () => {
  return (
    <div>
      <Navbar /> {/* Include Navbar component */}
      <div style={styles.container}>
        <h1 style={styles.title}>Data Visualization</h1>
        <div style={styles.chartSection}>
          <h2 style={styles.chartTitle}>Expense Trend Over Time</h2>
          <ExpenseTrendChart />
        </div>
        <div style={styles.chartSection}>
          <h2 style={styles.chartTitle}>Expense Distribution by Category</h2>
          <ExpenseCategoryChart />
        </div>
      </div>
    </div>
  );
};

export default VisualizationDashboard;
