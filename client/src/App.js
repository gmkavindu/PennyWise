// src/App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ExpenseManager from './components/expenses/ExpenseManager';
import BudgetManager from './components/budgets/BudgetManager';
import VisualizationDashboard from './components/visualization/VisualizationDashboard';
import FinancialTips from './components/FinancialTips';
import SettingsPage from './components/SettingsPage';
import ThemeAppearance from './components/ThemeAppearance';
import AccountSettings from './components/AccountSettings';
import PersonalInformation from './components/PersonalInformation';
import './App.css';
import { AuthProvider, useAuth } from './authContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function HomePage() {
  const { isAuthenticated } = useAuth();
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

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

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
          <Route path="/budgets" element={<ProtectedRoute><BudgetManager /></ProtectedRoute>} />
          <Route path="/visualization" element={<ProtectedRoute><VisualizationDashboard /></ProtectedRoute>} />
          <Route path="/financial-tips" element={<ProtectedRoute><FinancialTips /></ProtectedRoute>} />
          <Route path="/settings/*" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/settings/theme" element={<ProtectedRoute><ThemeAppearance /></ProtectedRoute>} />
          <Route path="/settings/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
          <Route path="/settings/personal" element={<ProtectedRoute><PersonalInformation /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
