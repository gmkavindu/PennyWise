import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user's theme preference if a token is present in localStorage
      const fetchUserProfile = async () => {
        try {
          const userResponse = await axios.get('/api/auth/profile', {
            headers: {
              'x-auth-token': token,
            },
          });
          const userTheme = userResponse.data.theme;
          localStorage.setItem('theme', userTheme);
          document.documentElement.setAttribute('data-theme', userTheme);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // If the token is invalid, log the user out
          logout();
        }
      };
      fetchUserProfile();
    }
  }, []);

  const login = async (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('token', token);

    try {
      const userResponse = await axios.get('/api/auth/profile', {
        headers: {
          'x-auth-token': token,
        },
      });
      const userTheme = userResponse.data.theme;
      localStorage.setItem('theme', userTheme);
      document.documentElement.setAttribute('data-theme', userTheme);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('theme');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
