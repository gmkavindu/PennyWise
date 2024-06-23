import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the user profile data when the component mounts
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
    fetchProfile(); // Invoke fetchProfile function on component mount
  }, []);

  // Function to handle input changes
  const onChange = e => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const onSubmit = async e => {
    e.preventDefault();
    try {
      // Send a PUT request to update the profile data
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
    <div className="auth-container">
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
  );
};

export default Profile;
