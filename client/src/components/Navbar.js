// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';

const navbarStyle = {
  backgroundColor: '#007bff',
  padding: '10px 20px',
  color: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  marginRight: '20px',
};

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav style={navbarStyle}>
      <div>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/profile" style={linkStyle}>Profile</Link>
        <Link to="/expenses" style={linkStyle}>Expenses</Link>
      </div>
      <button onClick={handleLogout} style={{ ...linkStyle, backgroundColor: 'red', padding: '5px 10px', borderRadius: '5px' }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
