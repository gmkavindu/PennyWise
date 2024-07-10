import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission state
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!validator.isStrongPassword(password, { minSymbols: 0 })) {
      return "Password must include at least one uppercase letter, one lowercase letter, and one number.";
    }
    return '';
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === 'password') {
      const errorMsg = validatePassword(e.target.value);
      setPasswordError(errorMsg);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Set form as submitted to show validation errors
    const errorMsg = validatePassword(password);
    if (errorMsg) {
      setPasswordError(errorMsg);
      return;
    }

    try {
      await axios.post('/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response.data.msg);
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    const handleLogoutAndRefresh = () => {
      localStorage.removeItem('token');
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    };

    window.addEventListener('beforeunload', handleLogoutAndRefresh);

    return () => {
      window.removeEventListener('beforeunload', handleLogoutAndRefresh);
    };
  }, []);

  return (
    <div className="auth-container bg-gray-100 min-h-screen flex items-center justify-center overflow-y-auto">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700">
              Name:
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {isSubmitted && !name && <p className="text-red-500 mt-2">Name is required.</p>}
          </div>
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
            {isSubmitted && !email && <p className="text-red-500 mt-2">Email is required.</p>}
            {isSubmitted && email && !validator.isEmail(email) && <p className="text-red-500 mt-2">Invalid email format.</p>}
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
            {isSubmitted && passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
