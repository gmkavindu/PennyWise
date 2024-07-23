import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import { AuthProvider } from '../authContext';

jest.mock('axios');

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Helper function to render components with AuthProvider
const renderWithAuthProvider = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AuthProvider {...providerProps}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>,
    renderOptions
  );
};

describe('Login Component', () => {
  test('renders login form', () => {
    const providerProps = { value: { isAuthenticated: false, login: jest.fn() } };
    renderWithAuthProvider(<Login />, { providerProps });

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
  });

  test('shows error message on failed login', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { msg: 'Invalid credentials' } } });

    const providerProps = { value: { isAuthenticated: false, login: jest.fn() } };
    renderWithAuthProvider(<Login />, { providerProps });

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'Password1234' } });
    fireEvent.click(screen.getAllByText('Login')[1]); // Ensure clicking the button

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('redirects to dashboard on successful login', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    axios.post.mockResolvedValueOnce({ data: { token: 'fake-jwt-token' } });
    axios.get.mockResolvedValueOnce({ data: { theme: 'light' } });

    const providerProps = { value: { isAuthenticated: false, login: jest.fn() } };
    renderWithAuthProvider(<Login />, { providerProps });

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'Password1234' } });
    fireEvent.click(screen.getAllByText('Login')[1]); // Ensure clicking the button

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    });
  });
});
