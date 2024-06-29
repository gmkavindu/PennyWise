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
        <Link to="/budgets" style={linkStyle}>Budgets</Link>
        <Link to="/visualization" style={linkStyle}>Visualization</Link> {/* Add this line for Visualization */}
        <Link to="http://localhost:3000/financial-tips" style={linkStyle}>Financial Tips</Link> {/* Updated line for Financial Tips */}
      </div>
      <button onClick={handleLogout} style={{ ...linkStyle, backgroundColor: 'red', padding: '5px 10px', borderRadius: '5px' }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
