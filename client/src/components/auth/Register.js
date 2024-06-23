import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Import styling for authentication forms

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password } = formData;

  // Function to handle input changes
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Function to handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to register the user
      await axios.post('/api/auth/register', formData);
      navigate('/login'); // Redirect to login page upon successful registration
    } catch (err) {
      setError(err.response.data.msg); // Set error message if registration fails
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>} {/* Display error message if there's an error */}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
