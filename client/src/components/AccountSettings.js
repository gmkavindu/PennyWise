import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountSettings = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/profile', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setUserData({
          email: response.data.email,
          password: '',
        });
        setMessage('User data fetched successfully');
        setMessageType('success');
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setMessage('Failed to fetch user data');
        setMessageType('error');
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/auth/profile', userData, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      setMessage(response.data.message || 'Account updated successfully');
      setMessageType('success');
    } catch (error) {
      console.error('Error updating account:', error);
      setMessage('Error updating account');
      setMessageType('error');
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

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
      padding: '10px',
      borderRadius: '4px',
      textAlign: 'center',
      color: messageType === 'success' ? 'green' : 'red',
      backgroundColor: messageType === 'success' ? '#e0ffe0' : '#ffe0e0',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
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
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Account Settings</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Update</button>
      </form>
    </div>
  );
};

export default AccountSettings;
