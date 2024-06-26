import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import Navbar from '../Navbar';
import ExpenseForm from '../expenses/ExpenseForm';
import { fetchBudgets, addBudget, deleteBudget, updateBudget } from '../../services/api';

const containerStyle = {
  maxWidth: '800px',
  margin: '20px auto',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
};

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  useEffect(() => {
    const fetchBudgetsData = async () => {
      try {
        const data = await fetchBudgets();
        setBudgets(data);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    const fetchExpenses = async () => {
      try {
        const response = await axios.get('/api/expenses', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchBudgetsData();
    fetchExpenses();
  }, []);

  const handleSaveBudget = async (budget) => {
    try {
      if (budgetToEdit) {
        const updatedBudget = await updateBudget(budgetToEdit._id, budget);
        setBudgets(budgets.map((b) => (b._id === budgetToEdit._id ? updatedBudget : b)));
      } else {
        const newBudget = await addBudget(budget);
        setBudgets([...budgets, newBudget]);
      }
      setBudgetToEdit(null);
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleEditBudget = (budget) => {
    setBudgetToEdit(budget);
  };

  const handleDeleteBudget = async (id) => {
    try {
      await deleteBudget(id);
      setBudgets(budgets.filter((b) => b._id !== id));
    } catch (error) {
      console.error(`Error deleting budget with ID ${id}:`, error);
    }
  };

  const handleSaveExpense = async (expense) => {
    setAlertMessage('');
    try {
      const budgetForCategory = budgets.find((b) => b.category === expense.category);

      if (!budgetForCategory) {
        console.error(`No budget found for category ${expense.category}`);
        setAlertMessage(`No budget found for category ${expense.category}`);
        return;
      }

      const totalExpenseForCategory = expenses.reduce((total, exp) => {
        if (exp.category === expense.category) {
          return total + exp.amount;
        }
        return total;
      }, 0);

      const newTotal = totalExpenseForCategory + parseFloat(expense.amount);
      if (newTotal > budgetForCategory.limit) {
        console.error(`Adding this expense exceeds the budget limit for ${expense.category}`);
        setAlertMessage(`Adding this expense exceeds the budget limit for ${expense.category}`);
        return;
      }

      const response = await axios.post('/api/expenses', expense, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      setExpenses([...expenses, response.data]);
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const toggleExpenseForm = () => {
    setShowExpenseForm(!showExpenseForm);
  };

  return (
    <div>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Budget Manager</h2>
        {alertMessage && <div style={{ color: 'red', textAlign: 'center' }}>{alertMessage}</div>}
        <BudgetForm onSave={handleSaveBudget} budgetToEdit={budgetToEdit} clearEdit={() => setBudgetToEdit(null)} />
        <BudgetList budgets={budgets} onEdit={handleEditBudget} onDelete={handleDeleteBudget} />
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={toggleExpenseForm}>
          {showExpenseForm ? 'Hide Expense Form' : 'Show Expense Form'}
        </button>
        {showExpenseForm && <ExpenseForm onSave={handleSaveExpense} />}
      </div>
    </div>
  );
};

export default BudgetManager;
