import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PersonalInformation = () => {
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [message, setMessage] = useState('');
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
        setName(response.data.name);
        setProfilePictureUrl(response.data.profilePicture || '');
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (profilePicture) formData.append('profilePicture', profilePicture);
    try {
      const response = await axios.put('/api/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      setMessage('Profile updated successfully');
      // Update profilePictureUrl state immediately with the new URL
      setProfilePictureUrl(response.data.profilePicture);
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  return (
    <div className={`max-w-md mx-auto p-6 rounded-lg shadow-md ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
      <h2 className="text-2xl font-semibold mb-4 text-center">Personal Information</h2>
      {message && (
        <p className="absolute top-9 left-1/2 transform -translate-x-1/2 p-3 rounded text-center text-green-800 bg-green-200 w-11/12">
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-bold mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded bg-gray-200 text-gray-900"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-1">Profile Picture:</label>
          <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded bg-gray-200 text-gray-900" />
        </div>
        {profilePictureUrl && (
          <div className="mb-4">
            <label className="block font-bold mb-1">Current Profile Picture:</label>
            <img
              src={profilePictureUrl}
              alt="Profile"
              className="w-36 h-36 rounded-full"
            />
          </div>
        )}
        <button type="submit" className="w-full p-2 rounded bg-blue-600 text-white hover:bg-blue-700">Update</button>
      </form>
    </div>
  );
};

export default PersonalInformation;
