import React, { useState, useEffect } from 'react';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import Navbar from '../Navbar';
import BudgetChart from './BudgetChart';
import { fetchBudgets, addBudget, deleteBudget, updateBudget, fetchExpenses } from '../../services/api';

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [decreaseMessage, setDecreaseMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [theme, setTheme] = useState('light'); // State for theme, default is light
  const [showAddPopup, setShowAddPopup] = useState(false); // State for showing add budget popup
  const [loading, setLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme); // Set theme from localStorage
    }
  }, []);

  useEffect(() => {
    const fetchBudgetsData = async () => {
      try {
        setLoading(true); // Set loading state to true
        const data = await fetchBudgets();
        setBudgets(data);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    fetchBudgetsData();
  }, []);

  useEffect(() => {
    const fetchExpensesData = async () => {
      try {
        setLoading(true); // Set loading state to true
        const data = await fetchExpenses();
        setExpenses(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    fetchExpensesData();
  }, []);

  useEffect(() => {
    const handleClick = () => {
      setDecreaseMessage('');
      setDeleteMessage('');
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const calculateTotalExpensesForCategory = (category) => {
    return expenses.reduce((total, exp) => {
      if (exp.category === category) {
        return total + exp.amount;
      }
      return total;
    }, 0);
  };

  const handleSaveBudget = async (budget) => {
    try {
      const totalExpenseForCategory = calculateTotalExpensesForCategory(budget.category);

      if (budgetToEdit && budgetToEdit.limit < totalExpenseForCategory) {
        const message = `Cannot decrease budget for ${budgetToEdit.category} because existing expenses exceed the new limit.`;
        setDecreaseMessage(message);
        return;
      } else {
        setDecreaseMessage('');
      }

      if (budgetToEdit) {
        const updatedBudget = await updateBudget(budgetToEdit._id, budget);
        setBudgets(budgets.map((b) => (b._id === budgetToEdit._id ? updatedBudget : b)));
      } else {
        const newBudget = await addBudget(budget);
        setBudgets([...budgets, newBudget]);
      }
      setBudgetToEdit(null);
      setShowAddPopup(false); // Close the popup after saving
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleEditBudget = (budget) => {
    setBudgetToEdit(budget);
    setShowAddPopup(true); // Open the popup for editing
  };

  const handleDeleteBudget = async (id) => {
    try {
      const associatedExpenses = expenses.filter((exp) => exp.category === budgets.find((b) => b._id === id)?.category);

      if (associatedExpenses.length > 0) {
        setDeleteMessage(`Cannot delete budget because there are existing expenses associated with it.`);
        return;
      }

      await deleteBudget(id);
      setBudgets(budgets.filter((b) => b._id !== id));
    } catch (error) {
      console.error(`Error deleting budget with ID ${id}:`, error);
    }
  };

  const handleClearForm = () => {
    setBudgetToEdit(null);
    setShowAddPopup(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('popup-bg')) {
      handleClearForm();
    }
  };

  return (
    <div className={`${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} min-h-screen transition-colors duration-500 ease-in-out`}>
      <Navbar theme={theme} />
      <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-md mt-32">
        <h2 className="text-center text-2xl font-bold mb-6 animate-fadeIn">Budget Manager</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mb-4"
          onClick={() => setShowAddPopup(true)}
        >
          Add New Budget
        </button>

        {showAddPopup && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 popup-bg bg-${theme === 'light' ? 'white' : 'gray-800'} bg-opacity-75`}
            onClick={handleOutsideClick}
          >
            <div className={`p-6 rounded-lg shadow-md w-full sm:w-96 relative bg-${theme === 'light' ? 'bg-white border-black border-2' : 'gray-900'}`}>
              <div className="mb-4">
                <BudgetForm
                  onSave={handleSaveBudget}
                  budgetToEdit={budgetToEdit}
                  clearEdit={handleClearForm}
                  totalExpensesForCategory={calculateTotalExpensesForCategory(budgetToEdit?.category)}
                  theme={theme}
                />
              </div>
              {/* You can add more content or components here */}
            </div>
          </div>
        )}

        {decreaseMessage && <div className="text-red-600 mb-4">{decreaseMessage}</div>}
        {deleteMessage && <div className="text-red-600 mb-4">{deleteMessage}</div>}

        {loading ? (
          <div className="text-center">
            <p>Loading...</p> {/* Replace with spinner or loading animation if desired */}
          </div>
        ) : (
          <>
            <BudgetList budgets={budgets} onEdit={handleEditBudget} onDelete={handleDeleteBudget} theme={theme} />
            <BudgetChart budgets={budgets} expenses={expenses} theme={theme} />
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;
