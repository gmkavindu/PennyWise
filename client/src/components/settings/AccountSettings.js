import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountSettings = () => {
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/profile', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setUserData({ email: response.data.email, password: '' });
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
        headers: { 'x-auth-token': localStorage.getItem('token') },
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
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`max-w-md mx-auto p-6 rounded-lg shadow-md ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
      <h2 className="text-2xl font-semibold mb-4 text-center">Account Settings</h2>
      {message && (
        <p className={`mb-4 p-3 rounded text-center ${messageType === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-bold mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-gray-200 text-gray-900"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-1">Password:</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-gray-200 text-gray-900"
          />
        </div>
        <button type="submit" className="w-full p-2 rounded bg-blue-600 text-white hover:bg-blue-700">Update</button>
      </form>
    </div>
  );
};

export default AccountSettings;
