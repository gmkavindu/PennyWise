import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', formData);

      if (res.data.token) {
        login(res.data.token);
        navigate('/dashboard');
      } else {
        setError('Token not received');
      }
    } catch (err) {
      setError(err.response.data.msg);
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    // Logic after logout and refresh
    const handleLogoutAndRefresh = () => {
      localStorage.removeItem('token'); // Clear token from localStorage
      localStorage.setItem('theme', 'light'); // Reset theme to light
      document.documentElement.setAttribute('data-theme', 'light'); // Update theme on the document
    };

    window.addEventListener('beforeunload', handleLogoutAndRefresh);

    return () => {
      window.removeEventListener('beforeunload', handleLogoutAndRefresh);
    };
  }, []);

  return (
    <div className="auth-container bg-gray-100 min-h-screen flex items-center justify-center overflow-y-auto">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email:
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium text-gray-700">
              Password:
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
