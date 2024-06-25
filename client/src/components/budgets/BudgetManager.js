import React, { useState, useEffect } from 'react';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import Navbar from '../Navbar';
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

  const handleSave = async (budget) => {
    try {
      if (budgetToEdit) {
        const updatedBudget = await updateBudget(budgetToEdit._id, budget);
        setBudgets(budgets.map(b => (b._id === budgetToEdit._id ? updatedBudget : b)));
      } else {
        const newBudget = await addBudget(budget);
        setBudgets([...budgets, newBudget]);
      }
      setBudgetToEdit(null);
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleEdit = (budget) => {
    setBudgetToEdit(budget);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id);
      setBudgets(budgets.filter(b => b._id !== id));
    } catch (error) {
      console.error(`Error deleting budget with ID ${id}:`, error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Budget Manager</h2>
        <BudgetForm onSave={handleSave} budgetToEdit={budgetToEdit} clearEdit={() => setBudgetToEdit(null)} />
        <BudgetList budgets={budgets} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default BudgetManager;
