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
      setProfilePictureUrl(`${response.data.profilePicture}`);
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: 'var(--background)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
      marginBottom: '20px',
      textAlign: 'center',
    },
    message: {
      marginBottom: '10px',
      color: 'var(--message-color)',
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid var(--border-color)',
      borderRadius: '4px',
      backgroundColor: 'var(--input-background)',
      color: 'var(--input-text)',
    },
    button: {
      width: '100%',
      padding: '10px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: 'var(--button-background)',
      color: 'var(--button-text)',
      fontSize: '16px',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: 'var(--button-background-hover)',
    },
    img: {
      width: '150px',
      height: '150px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Personal Information</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Profile Picture:</label>
          <input
            type="file"
            onChange={handleFileChange}
            style={styles.input}
          />
        </div>
        {profilePictureUrl && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Current Profile Picture:</label>
            <img
              src={profilePictureUrl.startsWith('http') ? profilePictureUrl : `http://localhost:5000${profilePictureUrl}`}
              alt="Profile"
              style={styles.img}
            />
          </div>
        )}
        <button type="submit" style={styles.button}>Update</button>
      </form>
    </div>
  );
};

export default PersonalInformation;
