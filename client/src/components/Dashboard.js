import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
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
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  const handleGoToExpenses = () => {
    navigate('/expenses');
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h2>Welcome to Your Dashboard</h2>
        <div style={buttonContainerStyle}>
          <button style={buttonStyle} onClick={handleLogout}>
            Logout
          </button>
          <button
            style={{ ...buttonStyle, backgroundColor: '#28a745' }}
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
          <button
            style={{ ...buttonStyle, backgroundColor: '#17a2b8' }}
            onClick={handleGoToExpenses}
          >
            Manage Expenses
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
