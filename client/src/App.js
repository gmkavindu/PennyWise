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
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './authContext';
import logo from './assets/images/logo.png';
import logoName from './assets/images/logo-name.png';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {isAuthenticated && <Navigate to="/dashboard" />} {/* Redirect if authenticated */}
      
      <div className="mt-8">
        <img src={logo} alt="Logo" className="w-40 md:w-48 lg:w-56 h-auto" /> {/* Responsive width, adjust as needed */}
      </div>
      <div className="-mt-20 text-xl md:text-2xl lg:text-3xl">
        <img src={logoName} alt="Logo Name" className="w-40 md:w-48 lg:w-56 h-auto" /> {/* Responsive width, adjust as needed */}
      </div>

      {!isAuthenticated && (
        <div className="mt-8 space-x-4 text-lg md:text-xl lg:text-2xl flex items-center">
          <Link to="/register" className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg shadow-md transition duration-300 hover:bg-teal-500">Register</Link>
          <span className="mx-2"></span> {/* Adding space between buttons */}
          <Link to="/login" className="inline-block bg-green-500 text-white px-10 py-2 rounded-lg shadow-md transition duration-300 hover:bg-teal-500 ">Login</Link>
        </div>
      )}
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
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><ExpenseManager /></ProtectedRoute>} />
            <Route path="/budgets" element={<ProtectedRoute><BudgetManager /></ProtectedRoute>} />
            <Route path="/visualization" element={<ProtectedRoute><VisualizationDashboard /></ProtectedRoute>} />
            <Route path="/financial-tips" element={<ProtectedRoute><FinancialTips /></ProtectedRoute>} />
            <Route path="/settings/*" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/settings/theme" element={<ProtectedRoute><ThemeAppearance /></ProtectedRoute>} />
            <Route path="/settings/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
            <Route path="/settings/personal" element={<ProtectedRoute><PersonalInformation /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
