import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../authContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import logoName from '../../assets/images/logo-name.png';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for showing password
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container bg-gray-100 min-h-screen flex items-center justify-center overflow-y-auto">
      <div className="max-w-md w-full bg-emerald-200 p-8 rounded-lg shadow-lg login-container animate-fadeIn">
        <div className="flex justify-center mb-4">
          <img src={logoName} alt="Logo" className="h-20 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
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
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-full hover:bg-emerald-600 focus:outline-none focus:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
