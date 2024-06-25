import React, { useState, useEffect } from 'react';

const formStyle = {
  marginBottom: '20px',
};

const inputStyle = {
  padding: '10px',
  marginBottom: '10px',
  width: '100%',
  boxSizing: 'border-box',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const selectStyle = {
  padding: '10px',
  marginBottom: '10px',
  width: '100%',
  boxSizing: 'border-box',
};

const BudgetForm = ({ onSave, budgetToEdit, clearEdit }) => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  useEffect(() => {
    // Populate form fields when editing existing budget
    if (budgetToEdit) {
      setCategory(budgetToEdit.category);
      setLimit(budgetToEdit.limit.toString()); // Ensure limit is converted to string for input type="number"
    } else {
      // Clear form fields when not editing
      setCategory('');
      setLimit('');
    }
  }, [budgetToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ category, limit: parseFloat(limit) || 0 }); // Convert limit back to number
    setCategory('');
    setLimit('');
    clearEdit();
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={selectStyle}
        required
      >
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Utilities">Utilities</option>
      </select>
      <input
        type="number"
        placeholder="Limit(RS.)"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        style={inputStyle}
        required
      />
      <button type="submit" style={buttonStyle}>
        {budgetToEdit ? 'Update Budget' : 'Add Budget'}
      </button>
    </form>
  );
};

export default BudgetForm;
