import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import './Auth.css';

const Login = () => {
  const { login } = useAuth(); // Access login function from useAuth hook
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  // Update form data when input changes
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to login endpoint with formData
      const res = await axios.post('/api/auth/login', formData);
      console.log(res.data);

      // Assuming your backend responds with a token in res.data.token
      if (res.data.token) {
        // Store the token in local storage
        localStorage.setItem('token', res.data.token);

        // Call login function from useAuth hook to update authentication state
        login();

        // Redirect to Dashboard upon successful login
        navigate('/dashboard');
      } else {
        // Handle the case where token is not received from the backend
        setError('Token not received');
      }
    } catch (err) {
      // Handle errors from the server response
      setError(err.response.data.msg);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit} className="auth-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
