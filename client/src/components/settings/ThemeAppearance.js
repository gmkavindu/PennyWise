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

  return (
    <div className={`max-w-md mx-auto p-6 rounded-lg shadow-md ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
      <h2 className="text-2xl font-semibold mb-4 text-center">Theme and Appearance</h2>
      {message && <p className="mb-4 p-3 rounded text-center text-green-800 bg-green-200">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="theme-select" className="block font-bold mb-1">Theme:</label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-2 border rounded bg-gray-200 text-gray-900"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button type="submit" className="w-full p-3 border-none rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">Update</button>
      </form>
    </div>
  );
};

export default ThemeAppearance;
