import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import ExpenseManager from './components/expenses/ExpenseManager';
import BudgetManager from './components/budgets/BudgetManager';
import VisualizationDashboard from './components/visualization/VisualizationDashboard';
import FinancialTips from './components/FinancialTips';
import SettingsPage from './components/settings/SettingsPage';
import ThemeAppearance from './components/settings/ThemeAppearance';
import AccountSettings from './components/settings/AccountSettings';
import PersonalInformation from './components/settings/PersonalInformation';
import Feedback from './components/Feedback';
import { AuthProvider, useAuth } from './authContext'; // Assuming this is your authentication context provider
import logo from './assets/images/logo.png';
import logoName from './assets/images/logo-name.png';
import './App.css';

// ProtectedRoute component to guard routes that require authentication
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/" />; // Redirect to home if not authenticated
}

// HomePage component for the landing page
function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {isAuthenticated && <Navigate to="/dashboard" />} {/* Redirect if authenticated */}

      {/* Logo */}
      <div className="mt-8">
        <img src={logo} alt="Logo" className="w-40 md:w-48 lg:w-56 h-auto" /> {/* Responsive width */}
      </div>
      {/* Logo Name */}
      <div className="-mt-20 text-xl md:text-2xl lg:text-3xl">
        <img src={logoName} alt="Logo Name" className="w-40 md:w-48 lg:w-56 h-auto" /> {/* Responsive width */}
      </div>

      {/* Register and Login buttons */}
      {!isAuthenticated && (
        <div className="mt-8 space-x-4 text-lg md:text-xl lg:text-2xl flex items-center">
          <Link to="/register" className="inline-block bg-emerald-500 text-white px-6 py-2 rounded-lg shadow-md transition duration-300 hover:bg-emerald-600">Register</Link>
          <span className="mx-2"></span> {/* Spacer */}
          <Link to="/login" className="inline-block bg-emerald-500 text-white px-10 py-2 rounded-lg shadow-md transition duration-300 hover:bg-emerald-600">Login</Link>
        </div>
      )}
    </div>
  );
}

// App component
function App() {
  // Set theme based on local storage or default to light theme
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <AuthProvider> {/* Wrap entire app with AuthProvider */}
      <Router> {/* Router setup */}
        <div className="min-h-screen flex flex-col"> {/* Main container */}
          <Routes> {/* Route configuration */}
            <Route path="/" element={<HomePage />} /> {/* Home page route */}
            <Route path="/login" element={<Login />} /> {/* Login page route */}
            <Route path="/register" element={<Register />} /> {/* Register page route */}
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><ExpenseManager /></ProtectedRoute>} />
            <Route path="/budgets" element={<ProtectedRoute><BudgetManager /></ProtectedRoute>} />
            <Route path="/visualization" element={<ProtectedRoute><VisualizationDashboard /></ProtectedRoute>} />
            <Route path="/financial-tips" element={<ProtectedRoute><FinancialTips /></ProtectedRoute>} />
            {/* Settings routes */}
            <Route path="/settings/*" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/settings/theme" element={<ProtectedRoute><ThemeAppearance /></ProtectedRoute>} />
            <Route path="/settings/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
            <Route path="/settings/personal" element={<ProtectedRoute><PersonalInformation /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
