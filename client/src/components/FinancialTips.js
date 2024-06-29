import React, { useEffect, useState, useCallback } from 'react';
import { fetchFinancialTips } from '../services/api'; // Assuming this fetches financial tips from an API
import Navbar from './Navbar';

const FinancialTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Initialize error state with an empty string

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
      setError(''); // Reset error state upon successful fetch
    } catch (error) {
      console.error('Failed to load financial tips:', error);
      setError('Failed to load financial tips'); // Set error state only on error
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTips();
  }, [loadTips]);

  const parseTips = (response) => {
    const lines = response.split('\n').filter(line => line.trim() !== '');
    const formattedTips = lines.map((line, index) => ({
      text: line.replace(/[*-]/g, '').trim(), // Remove * and - characters
      index
    }));

    return formattedTips;
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
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Personalized Financial Tips</h1>
        {loading && <p style={styles.loading}>Loading...</p>}
        {error && <p style={styles.error}>Error: {error}</p>}
        {!loading && tips.length > 0 && (
          <div style={styles.tips}>
            {tips.map(({ text, index }) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FinancialTips;
