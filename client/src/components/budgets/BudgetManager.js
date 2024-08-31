import React, { useState, useEffect, useRef } from 'react';
import BudgetForm from './BudgetForm';
import IncomeForm from './IncomeForm'; // Import SalaryForm
import BudgetList from './BudgetList';
import Navbar from '../Navbar';
import Footer from '../Footer';
import BudgetChart from './BudgetChart';
import { 
  fetchBudgets, 
  addBudget, 
  deleteBudget, 
  updateBudget, 
  fetchExpenses, 
  resetBudgets, 
  updateIncomeDetails, 
  fetchIncomeDetails,
  saveBudgetStatusToUser, // Import saveBudgetStatusToUser function
} from '../../services/api';

const BudgetManager = () => {
  // State declarations
  const [budgets, setBudgets] = useState([]);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [decreaseMessage, setDecreaseMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [noBudgetMessage, setNoBudgetMessage] = useState('');
  const [budgetErrorMessage, setBudgetErrorMessage] = useState('');
  const [theme, setTheme] = useState('light');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showIncomePopup, setShowIncomePopup] = useState(false); // State for Salary Popup
  const [loading, setLoading] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [income, setIncome] = useState(0);
  const [incomeDetails, setIncomeDetails] = useState([]); // Initialize as an empty array

  const [remainingIncome, setRemainingIncome] = useState(0);
  const [expirationDate, setExpirationDate] = useState(null);
  const [period, setPeriod] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [customPeriod, setCustomPeriod] = useState(null);
  
  // Ref to hold the error message container
  const errorMessageRef = useRef(null);

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
        if (data.length === 0) {
          setNoBudgetMessage('No budget has been set yet. You can add a budget to start tracking your expenses, but setting a salary is optional. Feel free to continue using the app without setting a salary.');
        } else {
          setNoBudgetMessage('');
        }
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
    const fetchIncomeData = async () => {
      try {
        const incomeData = await fetchIncomeDetails();
    
        // Check if incomeData and incomeData.categories are defined and are arrays
        if (incomeData && Array.isArray(incomeData.categories)) {
          const totalIncome = incomeData.categories.reduce((acc, detail) => acc + detail.amount, 0);
          setIncome(totalIncome);
    
          // Set the state for the details object
          setPeriod(incomeData.details.period);
          setCustomPeriod(incomeData.details.customPeriod);
          setExpirationDate(incomeData.details.expirationDate);
          setStartDate(incomeData.details.startDate);
          setIncomeDetails(incomeData.categories); // Update this to use categories
        } else {
        }
      } catch (error) {
      }
    };
    
  
    fetchIncomeData();
  }, [budgets]);
  
  

  useEffect(() => {
    // Calculate remaining salary whenever budgets or salary change
    const totalBudgets = budgets.reduce((sum, budget) => sum + budget.limit, 0);
    setRemainingIncome(income - totalBudgets);
  }, [budgets, income]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (errorMessageRef.current && !errorMessageRef.current.contains(event.target)) {
        setBudgetErrorMessage('');
      }
    };

    if (budgetErrorMessage) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [budgetErrorMessage]);

  const handleSaveBudget = async (budget) => {
    try {
      const totalExpenseForBudget = calculateTotalExpensesForBudget(budgetToEdit?._id);
      const totalBudgets = budgets.reduce((sum, b) => sum + b.limit, 0) - (budgetToEdit ? budgetToEdit.limit : 0) + budget.limit;

      if (income === 0 || totalBudgets <= income) {
        setBudgetErrorMessage('');
      } else {
        const message = `Cannot add/update budget because the total budget amount exceeds the income.`;
        setBudgetErrorMessage(message);
        return;
      }

      if (budgetToEdit && budget.limit < totalExpenseForBudget) {
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
        setNoBudgetMessage(''); // Clear the no budget message
      }
      setBudgetToEdit(null);
      setShowAddPopup(false); // Close the popup after saving
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleUpdateIncomeDetails = async (newIncomeDetails) => {
    try {
      // Call the API to update income details
      await updateIncomeDetails(newIncomeDetails);
      
      // Fetch the updated income details to ensure everything is updated correctly
      const incomeData = await fetchIncomeDetails();
      
      // Check if incomeData and incomeData.categories are defined and are arrays
      if (incomeData && Array.isArray(incomeData.categories)) {
        const totalIncome = incomeData.categories.reduce((acc, detail) => acc + detail.amount, 0);
        setIncome(totalIncome);
  
        // Set the state for the details object
        setIncomeDetails(incomeData.categories); // Ensure this is an array
        
        // Update the expiration status based on the fetched details
        updateExpirationStatus(
          incomeData.details.expirationDate,
          incomeData.details.startDate,
          incomeData.details.period
        );
      } else {
        console.error('Income details not found or is not an array:', incomeData);
        // Reset incomeDetails to an empty array in case of an error
        setIncomeDetails([]);
      }
    } catch (error) {
      console.error('Error updating income details:', error);
    } finally {
      setShowIncomePopup(false); 
    }
  };


  const updateExpirationStatus = (expirationDate, startDate, period) => {
    setExpirationDate(expirationDate);
    setStartDate(startDate);
    setPeriod(period);
    
  };

  const handleEditBudget = (budget) => {
    setBudgetToEdit(budget);
    setShowAddPopup(true); // Open the popup for editing
  };

  const handleDeleteBudget = async (id) => {
    try {
      const associatedExpenses = expenses.filter((exp) => exp.budget === id);

      if (associatedExpenses.length > 0) {
        setDeleteMessage(`Cannot delete budget because there are existing expenses associated with it.`);
        return;
      }

      await deleteBudget(id);
      const updatedBudgets = budgets.filter((b) => b._id !== id);
      setBudgets(updatedBudgets);

      // Update noBudgetMessage based on updatedBudgets
      if (updatedBudgets.length === 0) {
        setNoBudgetMessage('No budget has been set. Please add a budget to get started.');
      } else {
        setNoBudgetMessage('');
      }
    } catch (error) {
      console.error(`Error deleting budget with ID ${id}:`, error);
    }
  };

  const handleResetBudgets = async () => {
    try {
      setLoading(true);
      
      // Calculate total budget
      let totalBudgets = 0;
      budgets.forEach(b => totalBudgets += b.limit);
      
      // Filter expenses to include only those with a non-null budget value
      const filteredExpenses = expenses.filter(exp => exp.budget !== null);
      
      // Calculate total expenses
      let totalExpenses = 0;
      filteredExpenses.forEach(exp => totalExpenses += exp.amount);
      
      // Calculate remaining or exceeded amount
      const remainingOrExceededAmount = totalBudgets - totalExpenses;
      
      // Format the status message based on the amount
      const formattedAmount = remainingOrExceededAmount >= 0
        ? `Remaining Budgets Amount: ${remainingOrExceededAmount}`
        : `Exceeded Budgets Amount: ${Math.abs(remainingOrExceededAmount)}`;
      
      // Fetch income details
      const incomeData = await fetchIncomeDetails();
      let totalIncome = 0;
      if (incomeData && Array.isArray(incomeData.categories)) {
        incomeData.categories.forEach(detail => totalIncome += detail.amount);
      }
      
      // Prepare category-wise income details
      const incomeCategories = (incomeData && Array.isArray(incomeData.categories)) 
        ? incomeData.categories.map(detail => ({
            category: detail.category,
            amount: detail.amount
          }))
        : [];
      
      const period = incomeData.details.period;
      const customPeriod = incomeData.details.customPeriod;
      const startDate = incomeData.details.startDate;
      const expirationDate = incomeData.details.expirationDate;
      
      // Save budget status to the user
      await saveBudgetStatusToUser(totalBudgets, totalExpenses, `Previous Period ${formattedAmount}`, totalIncome, period, customPeriod, startDate, expirationDate, incomeCategories);
      
      // Reset budgets
      await resetBudgets();
      
      // Update state
      setBudgets([]);
      setNoBudgetMessage('All budgets have been reset. Please add a new budget to get started.');
      
      
  
    } catch (error) {
      console.error('Error resetting budgets:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  const handleClearForm = () => {
    setBudgetToEdit(null);
    setShowAddPopup(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('popup-bg')) {
      handleClearForm();
      setShowIncomePopup(false); // Close salary popup if clicked outside
    }
  };

  const handleResetBudgetsClick = () => {
    setShowConfirmReset(true); // Show confirmation dialog
  };

  const handleConfirmReset = async () => {
    setShowConfirmReset(false); // Hide confirmation dialog
    await handleResetBudgets();
    window.location.reload();
  };

  const handleCancelReset = () => {
    setShowConfirmReset(false);
  };

  const calculateTotalExpensesForBudget = (budgetId) => {
    return expenses.reduce((total, exp) => {
      if (exp.budget === budgetId) {
        return total + exp.amount;
      }
      return total;
    }, 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date'; // Check for invalid date
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}/${month}/${day}`;
  };
  
  // Usage
  

  const existingCategories = budgets.map(budget => budget.category);
  
  const formattedExpirationDate = formatDate(expirationDate);
  const formattedStartDate = formatDate(startDate);
  const isBudgetExpired = new Date().setHours(0, 0, 0, 0) >= new Date(expirationDate).setHours(0, 0, 0, 0);
  const periodMessage = period === 'custom' ? `Custom Period: ${customPeriod} days` : `Standard Period: ${period}`;

  const getSalaryButtonText = () => {
    // Ensure incomeDetails is an array before using .some
    if (Array.isArray(incomeDetails)) {
      const hasIncome = incomeDetails.some(detail => detail.amount > 0);
      return hasIncome ? 'Update Income' : 'Add Income';
    } else {
      console.error('Income details is not an array:', incomeDetails);
      return 'Add Income'; // Default button text in case of an error
    }
  };
  
  

  const expensesWithBudget = expenses.filter(expense => expense.budget !== null);

  return (
    <div className={`${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} min-h-screen flex flex-col`}>
    <Navbar theme={theme} />
    <div className="flex-grow">
      <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-md mt-32">
        <h2 className="text-center text-2xl font-bold mb-6 animate-fadeIn">Budget Manager</h2>

        {/* Budget Status Messages */}
        {income > 0 && (
          <div
            className={`text-center mb-6 p-4 rounded-lg shadow-md ${
              theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
            }`}
          >
            {isBudgetExpired ? (
              <div
                className={`p-4 rounded-md border ${
                  theme === 'light' ? 'bg-red-50 border-red-200' : 'bg-rose-900 border-rose-700'
                }`}
              >
                <p
                  className={`font-semibold text-lg ${
                    theme === 'light' ? 'text-rose-500' : 'text-rose-300'
                  }`}
                >
                  Your budget period has expired.
                </p>
                <p
                  className={`mt-2 ${
                    theme === 'light' ? 'text-rose-700' : 'text-rose-400'
                  }`}
                >
                  Started on: {formattedStartDate}. {periodMessage}
                </p>
                {budgets.length > 0 && expensesWithBudget.length > 0 && (
                  <button
                    className={`mt-4 py-2 px-4 rounded-md transition duration-150 ease-in-out ${
                      theme === 'light'
                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                        : 'bg-rose-700 hover:bg-rose-800 text-gray-100'
                    }`}
                    onClick={handleResetBudgetsClick}
                  >
                    Reset All Budgets
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`p-4 rounded-md border ${
                  theme === 'light' ? 'bg-green-50 border-green-200' : 'bg-green-900 border-green-700'
                }`}
              >
                <p
                  className={`font-semibold text-lg ${
                    theme === 'light' ? 'text-green-500' : 'text-green-300'
                  }`}
                >
                  Budget is active.
                </p>
                <p
                  className={`mt-2 ${
                    theme === 'light' ? 'text-green-700' : 'text-green-400'
                  }`}
                >
                  Started on: {formattedStartDate}. Valid Until: {formattedExpirationDate}. {periodMessage}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            onClick={() => setShowAddPopup(true)}
          >
            Add New Budget
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
            onClick={() => setShowIncomePopup(true)} // Show salary popup
          >
            {getSalaryButtonText()}
          </button>

          {budgets.length > 0 && expensesWithBudget.length > 0 && income === 0 && (
            <button
              className={`text-white py-2 px-4 rounded-md ${
                theme === 'light'
                  ? 'bg-rose-500 hover:bg-rose-600 '
                  : 'bg-rose-700 hover:bg-rose-800 '
              }`}
              onClick={handleResetBudgetsClick}
            >
              Reset All Budgets
            </button>
          )}
        </div>

        {showAddPopup && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 popup-bg bg-${theme === 'light' ? 'white' : 'gray-800'} bg-opacity-75`}
            onClick={handleOutsideClick}
          >
            <div className={`p-6 rounded-lg shadow-md w-full sm:w-96 relative bg-${theme === 'light' ? 'white border-black border-2' : 'gray-900'}`}>
              <div className="mb-4">
                <BudgetForm
                  onSave={handleSaveBudget}
                  budgetToEdit={budgetToEdit}
                  clearEdit={handleClearForm}
                  totalExpensesForBudget={calculateTotalExpensesForBudget(budgetToEdit?._id)}
                  theme={theme}
                  existingCategories={existingCategories} // Pass existing categories
                />
              </div>
            </div>
          </div>
        )}

        {showIncomePopup && ( // Salary Popup
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 popup-bg bg-${theme === 'light' ? 'white' : 'gray-800'} bg-opacity-75`}
            onClick={handleOutsideClick}
          >
            <div className={`p-6 rounded-lg shadow-md w-full sm:w-96 relative bg-${theme === 'light' ? 'white border-black border-2' : 'gray-900'}`}>
              <IncomeForm
                onSave={handleUpdateIncomeDetails}
                incomeDetails={incomeDetails}
                currentIncome={income}
                onClose={() => setShowIncomePopup(false)}
                clearEdit={handleClearForm}
                theme={theme}
              />
            </div>
          </div>
        )}

        {showConfirmReset && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 popup-bg bg-${theme === 'light' ? 'white' : 'gray-800'} bg-opacity-75`}
            onClick={(e) => {
              if (e.target.classList.contains('popup-bg')) {
                handleCancelReset();
              }
            }}
          >
            <div className={`p-6 rounded-lg shadow-md w-full sm:w-96 relative bg-${theme === 'light' ? 'white border-black border-2' : 'gray-900'}`}>
              <h3 className="text-lg font-bold mb-4">Confirm Reset</h3>
              <p className="mb-4">Are you sure you want to reset all budgets? This action cannot be undone.</p>
              <div className="flex justify-end">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md mr-2"
                  onClick={handleCancelReset}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                  onClick={handleConfirmReset}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {income > 0 && (
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold">Income: {income}</h3>
            <h3 className="text-xl font-semibold">Remaining Income: {remainingIncome}</h3>
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <p>Loading budgets...</p>
          </div>
        ) : (
          <>
            {noBudgetMessage && <div className={`text-center text-${theme === 'light' ? 'dark:text-gray-400' : 'red-400'} mb-4`}>{noBudgetMessage}</div>}

            {budgetErrorMessage && (
              <div
                ref={errorMessageRef}
                className=" text-red-500 border border-red-400 p-4 rounded-lg mb-4"
              >
                <p className="text-center font-semibold">{budgetErrorMessage}</p>
              </div>
            )}

            {decreaseMessage && (
              <div className="text-red-600 mb-4">
                <p className="text-center font-semibold">{decreaseMessage}</p>
              </div>
            )}

            {deleteMessage && (
              <div className="text-red-600 mb-4">
                <p className="text-center font-semibold">{deleteMessage}</p>
              </div>
            )}
            
            <BudgetList
              budgets={budgets}
              onEdit={handleEditBudget}
              onDelete={handleDeleteBudget}
              calculateTotalExpensesForBudget={calculateTotalExpensesForBudget}
              theme={theme}
            />
          </>
        )}

        {budgets.length > 0 && (
          <div className="mt-10">
            <h3 className="text-center text-xl font-bold mb-6">Budget Overview</h3>
            <BudgetChart budgets={budgets} expenses={expenses} />
          </div>
        )}
      </div>
    </div>
    <Footer />
  </div>
  );
};

export default BudgetManager;