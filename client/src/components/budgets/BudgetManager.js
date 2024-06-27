import React, { useState, useEffect } from 'react';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import Navbar from '../Navbar';
import BudgetChart from './BudgetChart';
import { fetchBudgets, addBudget, deleteBudget, updateBudget, fetchExpenses } from '../../services/api';

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
  const [decreaseMessage, setDecreaseMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    const fetchBudgetsData = async () => {
      try {
        const data = await fetchBudgets();
        setBudgets(data);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchBudgetsData();
  }, []);

  useEffect(() => {
    const fetchExpensesData = async () => {
      try {
        const data = await fetchExpenses();
        setExpenses(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpensesData();
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
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleEditBudget = (budget) => {
    setBudgetToEdit(budget);
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

  return (
    <div>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Budget Manager</h2>
        {decreaseMessage && (
          <div style={{ marginBottom: '10px', color: 'red', fontWeight: 'bold' }}>{decreaseMessage}</div>
        )}
        {deleteMessage && (
          <div style={{ marginBottom: '10px', color: 'red', fontWeight: 'bold' }}>{deleteMessage}</div>
        )}
        <BudgetForm
          onSave={handleSaveBudget}
          budgetToEdit={budgetToEdit}
          clearEdit={() => setBudgetToEdit(null)}
          totalExpensesForCategory={calculateTotalExpensesForCategory(budgetToEdit?.category || '')}
        />
        <BudgetList budgets={budgets} onEdit={handleEditBudget} onDelete={handleDeleteBudget} />
        <BudgetChart budgets={budgets} expenses={expenses} />
      </div>
    </div>
  );
};

export default BudgetManager;
