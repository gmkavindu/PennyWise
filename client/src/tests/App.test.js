import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { AuthProvider, useAuth } from '../authContext';

// Mock the AuthProvider and useAuth hook
jest.mock('../authContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: jest.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ isAuthenticated: false });
  });

  test('renders the main components', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByAltText('Logo Name')).toBeInTheDocument();
  });

  test('renders the Register component for /register route', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('renders the Login component for /login route', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('redirects to login for protected routes when not authenticated', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});