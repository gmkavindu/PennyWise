import React, { createContext, useContext, useState } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// AuthProvider component manages authentication state
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize isAuthenticated based on presence of token in localStorage
    const token = localStorage.getItem('token');
    return !!token; // Convert token presence to boolean
  });

  // Function to set isAuthenticated to true
  const login = () => {
    setIsAuthenticated(true);
  };

  // Function to set isAuthenticated to false and remove token from localStorage
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    // Provide AuthContext.Provider with isAuthenticated, login, and logout values
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children} {/* Render child components */}
    </AuthContext.Provider>
  );
}

// Custom hook to consume authentication context
export function useAuth() {
  return useContext(AuthContext);
}
