// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ExpenseManager from './components/expenses/ExpenseManager';
import BudgetManager from './components/budgets/BudgetManager'; // Import BudgetManager
import './App.css';
import { AuthProvider, useAuth } from './authContext'; // Import AuthProvider and useAuth hook from authContext

// ProtectedRoute component to protect routes that require authentication
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  // Render children if authenticated, otherwise redirect to login
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// HomePage component to display when user is not authenticated
function HomePage() {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if authenticated, otherwise display welcome message and login/register links
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Welcome to the App</h1>
      {!isAuthenticated && (
        <>
          <Link to="/register" className="app-link" style={{ marginRight: '10px' }}>Register</Link>
          <Link to="/login" className="app-link">Login</Link>
        </>
      )}
      {isAuthenticated && <Navigate to="/dashboard" />}
    </div>
  );
}

// App component that sets up routing and wraps with AuthProvider for authentication context
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpenseManager /></ProtectedRoute>} />
          <Route path="/budgets" element={<ProtectedRoute><BudgetManager /></ProtectedRoute>} /> {/* New Budget route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
