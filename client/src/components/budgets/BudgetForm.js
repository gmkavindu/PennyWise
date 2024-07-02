import React, { useState, useEffect } from 'react';

const BudgetForm = ({ onSave, budgetToEdit, clearEdit, totalExpensesForCategory, theme }) => {
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
    <form className={`flex flex-col items-center gap-4 ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`} onSubmit={handleSubmit}>
      {alertMessage && <div className="text-red-600">{alertMessage}</div>}
      <input
        className={`px-4 py-2 w-full border rounded ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <input
        className={`px-4 py-2 w-full border rounded ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}
        type="number"
        placeholder="Limit"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        required
      />
      <button className="px-6 py-3 bg-blue-500 text-white rounded cursor-pointer" type="submit">
        {budgetToEdit ? 'Update Budget' : 'Add Budget'}
      </button>
      {budgetToEdit && (
        <button className="px-6 py-3 bg-gray-500 text-white rounded cursor-pointer" type="button" onClick={clearForm}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default BudgetForm;
