import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PersonalInformation = () => {
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/profile', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setName(response.data.name);
        setProfilePictureUrl(response.data.profilePicture || ''); // Set an empty string if profilePicture is null
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
      setProfilePictureUrl(`${response.data.profilePicture}`); // Update profilePictureUrl after successful upload
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  return (
    <div>
      <h2>Personal Information</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Profile Picture:</label>
          <input
            type="file"
            onChange={handleFileChange}
          />
        </div>
        {profilePictureUrl && (
          <div>
            <label>Current Profile Picture:</label>
            <img
              src={profilePictureUrl.startsWith('http') ? profilePictureUrl : `http://localhost:5000${profilePictureUrl}`}
              alt="Profile"
              style={{ width: '150px', height: '150px' }}
            />
          </div>
        )}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default PersonalInformation;
