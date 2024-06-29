import React, { useEffect, useState, useCallback } from 'react';
import { fetchFinancialTips } from '../services/api';
import Navbar from './Navbar';
import { Spinner, Alert, Container } from 'react-bootstrap';

const FinancialTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const parseTips = useCallback((response) => {
    const lines = response.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => {
      let type = 'normal';
      let icon = '';

      // Highlight specific keywords (e.g., WASH)
      const keywordToHighlight = 'WASH:';
      if (line.toUpperCase().includes(keywordToHighlight)) {
        type = 'highlighted';
      } else if (line.startsWith('### ')) {
        type = 'section';
        line = line.replace(/### /g, '').trim();
      } else if (line.startsWith('**') && line.endsWith('**')) {
        type = 'bold';
        line = line.replace(/\*\*/g, '').trim();
        icon = getIcon(line);
      } else if (line.startsWith('- **') && line.endsWith('**')) {
        type = 'semiBold';
        line = line.replace(/- \*\*/g, '').replace(/\*\*/g, '').trim();
      } else {
        line = line.replace(/[*-]/g, '').trim();
      }

      return { type, text: line, icon, index };
    });
  }, []);

  const loadTips = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchFinancialTips();

      if (Array.isArray(response) && response.length === 1 && typeof response[0] === 'string') {
        setTips(parseTips(response[0]));
      } else {
        throw new Error('Invalid response format');
      }

      setLoading(false);
      setError('');
    } catch (error) {
      console.error('Failed to load financial tips:', error);
      setError('Failed to load financial tips');
      setLoading(false);
    }
  }, [parseTips]);

  useEffect(() => {
    loadTips();
  }, [loadTips]);

  const getIcon = (title) => {
    switch (title.toUpperCase()) {
      case 'ANALYSIS OF RECENT EXPENSES':
        return '🔍';
      case 'TRACK EXPENSES':
        return '📊';
      case 'PRIORITIZE NECESSITIES':
        return '📋';
      case 'COMPARE PRICES':
        return '💲';
      case 'SET SAVINGS GOALS':
        return '💰';
      case 'REDUCE IMPULSE BUYS':
        return '🛑';
      case 'REVIEW SUBSCRIPTIONS':
        return '🔄';
      case 'CONSIDER SECONDHAND OPTIONS':
        return '♻️';
      case 'NEGOTIATE PRICES':
        return '💬';
      case 'BUILD AN EMERGENCY FUND':
        return '🏦';
      case 'CONSULT A FINANCIAL ADVISOR':
        return '👨‍💼';
      default:
        return '💡';
    }
  };

  const styles = {
    container: {
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    heading: {
      fontSize: '32px',
      marginBottom: '20px',
      color: '#333',
      textAlign: 'center',
    },
    loading: {
      fontSize: '18px',
      color: '#666',
      textAlign: 'center',
      marginTop: '20px',
    },
    error: {
      fontSize: '18px',
      color: 'red',
      textAlign: 'center',
      marginTop: '20px',
    },
    tipsContainer: {
      marginTop: '20px',
    },
    section: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#0056b3',
    },
    card: {
      marginBottom: '20px',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#ffffff',
    },
    bold: {
      fontWeight: 'bold',
      color: '#0056b3',
    },
    semiBold: {
      fontWeight: '600',
      color: '#007bff',
    },
    normal: {
      color: '#333',
    },
    highlighted: {
      fontWeight: 'bold',
      color: '#ff6b6b', // Red color for highlighting
    },
    icon: {
      marginRight: '10px',
    },
  };

  const renderTips = () => {
    if (loading) {
      return <Spinner animation="border" variant="primary" style={styles.loading} />;
    }

    if (error) {
      return <Alert variant="danger" style={styles.error}>Error: {error}</Alert>;
    }

    if (tips.length === 0) {
      return <Alert variant="info">No tips available</Alert>;
    }

    return (
      <div style={styles.tipsContainer}>
        {tips.map(({ text, type, icon, index }) => (
          <div key={index} style={styles.card}>
            {type === 'section' && (
              <div style={styles.section}>{text}</div>
            )}
            {type === 'highlighted' && (
              <div style={styles.highlighted}>{text}</div>
            )}
            {type !== 'section' && type !== 'highlighted' && (
              <div style={styles[type]}>
                {icon && <span style={styles.icon}>{icon}</span>}
                {text}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <Container>
        <div style={styles.container}>
          <h1 style={styles.heading}>Personalized Financial Tips 💡</h1>
          {loading && <div style={styles.loading}>Loading...</div>}
          {!loading && renderTips()}
        </div>
      </Container>
    </>
  );
};

export default FinancialTips;
