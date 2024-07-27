import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import validator from 'validator';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import logoName from '../../assets/images/logo-name.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const [alert, setAlert] = useState({ message: '', type: '' }); // New state for alerts
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
    setIsSubmitted(true);
    const errorMsg = validatePassword(password);
    if (errorMsg) {
      setPasswordError(errorMsg);
      return;
    }

    try {
      await axios.post('/api/auth/register', formData);
      setAlert({ message: 'Registration successful!', type: 'success' });
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (err) {
      setAlert({ message: err.response.data.msg, type: 'error' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      <div className="max-w-md w-full bg-emerald-200 p-8 rounded-lg shadow-lg register-container animate-fadeIn">
        <div className="flex justify-center mb-4">
          <img src={logoName} alt="Logo" className="h-20 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Register</h2>
        {alert.message && (
          <div className={`p-4 mb-4 rounded ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {alert.message}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute top-4 left-3 text-gray-500" />
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              placeholder="Enter your name"
              className="w-full mt-1 px-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 placeholder-gray-400"
            />
            {isSubmitted && !name && <p className="text-red-500 mt-2">Name is required.</p>}
          </div>
          <div className="relative">
            <FaEnvelope className="absolute top-4 left-3 text-gray-500" />
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="Enter your email"
              className="w-full mt-1 px-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 placeholder-gray-400"
            />
            {isSubmitted && !email && <p className="text-red-500 mt-2">Email is required.</p>}
            {isSubmitted && email && !validator.isEmail(email) && <p className="text-red-500 mt-2">Invalid email format.</p>}
          </div>
          <div className="relative">
            <FaLock className="absolute top-4 left-3 text-gray-500" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'} // Toggle between text and password type
              name="password"
              value={password}
              onChange={onChange}
              required
              placeholder="Enter your password"
              className="w-full mt-1 px-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 placeholder-gray-400"
            />
            <span className="absolute top-4 right-3 text-gray-500 cursor-pointer" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {isSubmitted && passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-full hover:bg-emerald-600 focus:outline-none focus:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Register
          </button>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
