import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSun, FaMoon } from 'react-icons/fa'; // Importing icons from react-icons/fa

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

  const handleThemeChange = async (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    try {
      const response = await axios.put('/api/user/theme', { theme: newTheme }, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error updating theme');
    }
  };

  return (
    <div className={`max-w-md mx-auto p-6 rounded-lg shadow-md ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
      <h2 className="text-2xl font-semibold mb-4 text-center">Theme and Appearance</h2>
      {message && <p className="mb-4 p-3 rounded text-center text-green-800 bg-green-200">{message}</p>}
      <div className="mb-4 flex items-center">
        <label htmlFor="theme-select" className="block font-bold mb-1 flex items-center">
          {theme === 'light' ? <FaSun className="mr-2 text-yellow-500" /> : <FaMoon className="mr-2 text-gray-500" />}
          Select Theme
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={handleThemeChange}
          className="ml-2 w-full p-2 border rounded bg-gray-200 text-gray-900"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
};

export default ThemeAppearance;
