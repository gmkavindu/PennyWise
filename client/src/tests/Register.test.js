import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import Register from '../components/auth/Register';
import { AuthProvider } from '../authContext';

// Mocking axios
jest.mock('axios');

// Mocking useNavigate hook from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Helper function to render with AuthProvider
const renderWithAuthProvider = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AuthProvider {...providerProps}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>,
    renderOptions
  );
};

describe('Register Component', () => {
  const providerProps = { value: { isAuthenticated: false, login: jest.fn() } };

  beforeEach(() => {
    jest.useFakeTimers(); // Use fake timers for tests
  });

  afterEach(() => {
    jest.useRealTimers(); // Restore real timers after each test
  });

  test('renders registration form', () => {
    renderWithAuthProvider(<Register />, { providerProps });

    // Check if all input fields and the register button are rendered
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test('shows error message on failed registration', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { msg: 'Registration failed' } } });

    renderWithAuthProvider(<Register />, { providerProps });

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'Password1234' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });
  });

  test('redirects to login page on successful registration', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    renderWithAuthProvider(<Register />, { providerProps });

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'Password1234' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // Wait for the registration success message
    await waitFor(() => {
      expect(screen.getByText('Registration successful!')).toBeInTheDocument();
    });

    // Fast-forward time to handle setTimeout
    jest.advanceTimersByTime(2000);

    // Assert that navigate has been called with /login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('shows password error for weak password', async () => {
    renderWithAuthProvider(<Register />, { providerProps });

    // Simulate user input with a weak password
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // Wait for the password error message to appear
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long.')).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email', async () => {
    renderWithAuthProvider(<Register />, { providerProps });

    // Simulate user input with an invalid email
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'Password1234' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // Wait for the email error message to appear
    await waitFor(() => {
      expect(screen.getByText('Invalid email format.')).toBeInTheDocument();
    });
  });
});
