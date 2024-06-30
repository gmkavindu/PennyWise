// src/components/ThemeAppearance.js
import React, { useState } from 'react';
import axios from 'axios';

const ThemeAppearance = () => {
  const [theme, setTheme] = useState('light');
  const [message, setMessage] = useState('');

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
    } catch (error) {
      setMessage('Error updating theme');
    }
  };

  return (
    <div>
      <h2>Theme and Appearance</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Theme:</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default ThemeAppearance;
