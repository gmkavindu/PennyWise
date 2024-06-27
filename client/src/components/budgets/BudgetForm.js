import React, { useState, useEffect } from 'react';

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
};

const inputStyle = {
  padding: '8px',
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

const BudgetForm = ({ onSave, budgetToEdit, clearEdit, totalExpensesForCategory }) => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (budgetToEdit) {
      setCategory(budgetToEdit.category || '');
      setLimit(budgetToEdit.limit || '');
    } else {
      setCategory('');
      setLimit('');
    }
  }, [budgetToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newLimit = parseFloat(limit);
    if (budgetToEdit && newLimit < totalExpensesForCategory) {
      setAlertMessage(`Cannot decrease budget for ${category} because existing expenses exceed the new limit.`);
      return;
    }

    onSave({ category, limit: newLimit });
    clearForm();
  };

  const clearForm = () => {
    setCategory('');
    setLimit('');
    setAlertMessage('');
    if (clearEdit) {
      clearEdit();
    }
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      {alertMessage && <div style={{ color: 'red' }}>{alertMessage}</div>}
      <input
        style={inputStyle}
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <input
        style={inputStyle}
        type="number"
        placeholder="Limit"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        required
      />
      <button style={buttonStyle} type="submit">
        {budgetToEdit ? 'Update Budget' : 'Add Budget'}
      </button>
      {budgetToEdit && (
        <button style={buttonStyle} type="button" onClick={clearForm}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default BudgetForm;
