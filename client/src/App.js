import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';

function App() {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  };

  const buttonContainerStyle = {
    marginTop: '20px',
  };

  const buttonStyle = {
    marginLeft: '10px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  return (
    <Router>
      <div className="App" style={containerStyle}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={
            <div>
              <h1>Welcome to the App</h1>
              <div style={{ ...buttonContainerStyle, textAlign: 'center' }}>
                <Link to="/register">
                  <button style={buttonStyle}>Register</button>
                </Link>
                <Link to="/login">
                  <button style={buttonStyle}>Login</button>
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
