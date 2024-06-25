// src/components/budgets/BudgetForm.js
import React, { useState, useEffect } from 'react';

const BudgetForm = ({ onSave, budgetToEdit, clearEdit }) => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  useEffect(() => {
    if (budgetToEdit) {
      setCategory(budgetToEdit.category);
      setLimit(budgetToEdit.limit);
    } else {
      setCategory('');
      setLimit('');
    }
  }, [budgetToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ category, limit });
    setCategory('');
    setLimit('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Limit"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        required
      />
      <button type="submit">Save</button>
      {budgetToEdit && <button onClick={clearEdit}>Clear</button>}
    </form>
  );
};

export default BudgetForm;
