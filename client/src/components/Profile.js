import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
};

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/auth/profile', {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        setProfileData(res.data);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  const onChange = e => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put('/api/auth/profile', profileData, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      alert('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={containerStyle}>
        <h2>Profile</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={profileData.password}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
