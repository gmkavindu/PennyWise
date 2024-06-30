import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ThemeAppearance = () => {
  const [theme, setTheme] = useState('light');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/user/theme', { theme }, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      setMessage(response.data.message);
      // Apply theme change locally immediately after update
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    } catch (error) {
      setMessage('Error updating theme');
    }
  };

  // Styles
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: 'var(--background)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
      marginBottom: '20px',
      textAlign: 'center',
    },
    message: {
      marginBottom: '10px',
      color: 'var(--message-color)',
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    select: {
      width: '100%',
      padding: '8px',
      border: '1px solid var(--border-color)',
      borderRadius: '4px',
      backgroundColor: 'var(--input-background)',
      color: 'var(--input-text)',
    },
    button: {
      width: '100%',
      padding: '10px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: 'var(--button-background)',
      color: 'var(--button-text)',
      fontSize: '16px',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: 'var(--button-background-hover)',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Theme and Appearance</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.formGroup}>
        <div style={styles.formGroup}>
          <label htmlFor="theme-select" style={styles.label}>Theme:</label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={styles.select}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button type="submit" style={styles.button}>Update</button>
      </form>
    </div>
  );
};

export default ThemeAppearance;
