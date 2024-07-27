import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import Navbar from '../Navbar';
import Modal from '../Modal/Modal';
import Footer from '../Footer'; // Make sure you import the Footer component

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [theme, setTheme] = useState('light'); // State for theme, default is light
  const [loading, setLoading] = useState(false); // State for loading indicator

  const modalRef = useRef(null);

  // Fetch expenses from API
  const fetchExpenses = async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await axios.get('/api/expenses', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      const sortedExpenses = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sortedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false); // Set loading state to false when done
    }
  };

  // Initial fetch of expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Save or update an expense
  const handleSaveExpense = async (expense) => {
    try {
      if (expense._id) {
        await axios.put(`/api/expenses/${expense._id}`, expense, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
      } else {
        await axios.post('/api/expenses', expense, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
      }
      fetchExpenses(); // Refresh expenses after save/update
      setIsModalVisible(false); // Close the modal after saving/updating
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  // Set expense to edit and show modal
  const handleEditExpense = (expense) => {
    setExpenseToEdit(expense);
    setIsModalVisible(true); // Show the modal for editing
  };

  // Clear edit state (no expense to edit)
  const clearEdit = () => {
    setExpenseToEdit(null);
  };

  // Delete an expense
  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      fetchExpenses(); // Refresh expenses after deletion
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // Show modal for adding a new expense
  const handleAddExpense = () => {
    setIsModalVisible(true); // Show the modal for adding expense
    setExpenseToEdit(null); // Clear any existing edit state
  };

  // Close modal when clicking outside
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalVisible]);

  // Function to toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Store theme preference in localStorage
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme); // Set theme from localStorage
    }
  }, []);

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
      <Navbar toggleTheme={toggleTheme} />
      <main className="flex-grow">
        <div className="container mx-auto p-4 border rounded shadow-lg max-w-3xl mt-32">
          <h2 className="text-center text-2xl font-bold mb-6 animate-fadeIn">Expense Manager</h2>
          {loading ? (
            <div className="text-center">
              <p>Loading...</p> {/* Replace with spinner or loading animation if desired */}
            </div>
          ) : (
            <ExpenseTable expenses={expenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} onAddExpense={handleAddExpense} />
          )}
        </div>
      </main>
      <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <div ref={modalRef}>
          <ExpenseForm onSave={handleSaveExpense} expenseToEdit={expenseToEdit} clearEdit={clearEdit} onClose={() => setIsModalVisible(false)} />
        </div>
      </Modal>
      <Footer />
    </div>
  );
};

export default ExpenseManager;
