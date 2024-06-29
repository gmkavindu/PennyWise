import React, { useEffect, useState } from 'react';
import { fetchFinancialTips } from '../services/api'; 
import Navbar from './Navbar';

const FinancialTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTips = async () => {
      try {
        const response = await fetchFinancialTips();
        setTips(parseTips(response)); // Parse the response
      } catch (error) {
        setError('Failed to load financial tips');
      } finally {
        setLoading(false);
      }
    };

    loadTips();
  }, []);

  const parseTips = (response) => {
    const lines = response.split('\n');
    const formattedLines = lines.map((line) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return { type: 'bold', text: line.replace(/\*\*/g, '') };
      }
      if (line.startsWith('- **') && line.endsWith('**')) {
        return { type: 'semiBold', text: line.replace(/- \*\*/g, '').replace(/\*\*/g, '') };
      }
      return { type: 'normal', text: line };
    });
    return formattedLines;
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    heading: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#333',
    },
    loading: {
      fontSize: '18px',
      color: '#666',
    },
    error: {
      fontSize: '18px',
      color: 'red',
    },
    tips: {
      fontSize: '18px',
      color: '#333',
      lineHeight: '1.6',
      textAlign: 'left',
    },
    bold: {
      fontWeight: 'bold',
      fontSize: '20px',
      marginBottom: '10px',
    },
    semiBold: {
      fontWeight: '600',
      marginBottom: '10px',
    },
    normal: {
      marginBottom: '10px',
    },
  };

  const getIcon = (title) => {
    switch (title.toUpperCase()) {
      case 'ANALYZING YOUR EXPENSES':
        return '🔍';
      case 'PRIORITIZE ESSENTIALS':
        return '📋';
      case 'BUDGET ALLOCATION':
        return '💰';
      case 'DISCOUNTS AND COUPONS':
        return '💸';
      case 'MEAL PLANNING':
        return '🍽️';
      case 'ENERGY EFFICIENCY':
        return '🔌';
      case 'ENTERTAINMENT CHOICES':
        return '🎬';
      case 'COMPARISON SHOPPING':
        return '🛒';
      case 'CREDIT CARD REWARDS':
        return '💳';
      case 'SAVINGS ACCOUNT':
        return '🏦';
      default:
        return '💡';
    }
  };

  const renderTips = () => {
    return tips.map((tip, index) => {
      const style = styles[tip.type];
      const icon = tip.type === 'bold' ? getIcon(tip.text) : null;

      return (
        <div key={index} style={style}>
          {icon} {tip.text}
        </div>
      );
    });
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Personalized Financial Tips</h1>
        {loading && <p style={styles.loading}>Loading...</p>}
        {error && <p style={styles.error}>Error: {error}</p>}
        {!loading && !error && <div style={styles.tips}>{renderTips()}</div>}
      </div>
    </>
  );
};

export default FinancialTips;
