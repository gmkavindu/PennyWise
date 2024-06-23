import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';

// Styles for the container and buttons
const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
};

const buttonContainerStyle = {
  marginTop: '20px',
};

const buttonStyle = {
  marginRight: '10px',
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
};

const Dashboard = () => {
  const { logout } = useAuth(); // Access logout function from useAuth hook
  const navigate = useNavigate();

  // Function to handle logout process
  const handleLogout = () => {
    logout(); // Clears authentication state
    localStorage.removeItem('token'); // Removes token from localStorage
    navigate('/'); // Redirects to the root page after logout
  };

  // Function to navigate to the profile editing page
  const handleEditProfile = () => {
    navigate('/profile');
  };

  return (
    <div style={containerStyle}>
      <h2>Welcome to Your Dashboard</h2>
      <div style={buttonContainerStyle}>
        {/* Logout button */}
        <button style={buttonStyle} onClick={handleLogout}>
          Logout
        </button>
        {/* Edit profile button */}
        <button
          style={{ ...buttonStyle, backgroundColor: '#28a745' }}
          onClick={handleEditProfile}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
