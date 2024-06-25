// src/components/budgets/BudgetItem.js
import React from 'react';

const BudgetItem = ({ budget, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(budget);
  };

  const handleDelete = () => {
    onDelete(budget._id);
  };

  return (
    <div>
      <p>{budget.category}: ${budget.limit}</p>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default BudgetItem;
