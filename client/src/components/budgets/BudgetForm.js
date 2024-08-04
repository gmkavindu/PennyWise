import React, { useState, useEffect, useMemo } from 'react';

const BudgetForm = ({ onSave, budgetToEdit, clearEdit, totalExpensesForCategory, theme, existingCategories }) => {
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  const predefinedCategories = useMemo(() => [
    { emoji: '🚗', name: 'Transport' },
    { emoji: '🛒', name: 'Groceries' },
    { emoji: '🍽️', name: 'Food & Dining' },
    { emoji: '🎥', name: 'Entertainment' },
    { emoji: '🏠', name: 'Housing' },
    { emoji: '❤️', name: 'Health' },
    { emoji: '💳', name: 'Credit Card' },
    { emoji: '💸', name: 'Miscellaneous' },
    { emoji: '📚', name: 'Education' },
    { emoji: '🛍️', name: 'Shopping' },
    { emoji: '🏦', name: 'Loan' },
    { emoji: '🎁', name: 'Gifts' },
    { emoji: '🧳', name: 'Travel' },
    { emoji: '🧹', name: 'Cleaning' },
    { emoji: '📱', name: 'Utilities' },
    { emoji: '💻', name: 'Electronics' },
    { emoji: '🐾', name: 'Pet Care' },
    { emoji: '⚽', name: 'Recreation' },
    { emoji: '👗', name: 'Clothing' },
    { emoji: '🌿', name: 'Gardening' },
    { emoji: '👨‍⚕️', name: 'Medical' },
    { emoji: '🔧', name: 'Repairs' }
  ], []);

  useEffect(() => {
    if (budgetToEdit) {
      setCategory(budgetToEdit.category || '');
      setLimit(budgetToEdit.limit || '');
      setUseCustomCategory(!predefinedCategories.some(cat => cat.name === budgetToEdit.category));
      setCustomCategory(budgetToEdit.category || '');
    } else {
      setCategory('');
      setLimit('');
      setCustomCategory('');
      setUseCustomCategory(false);
    }
  }, [budgetToEdit, predefinedCategories]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newLimit = parseFloat(limit);
    if (budgetToEdit && newLimit < totalExpensesForCategory) {
      setAlertMessage(`Cannot decrease budget for ${category} because existing expenses exceed the new limit.`);
      return;
    }

    const finalCategory = useCustomCategory ? customCategory : category;
    const processedCategory = finalCategory.replace(/^[^\w\s]/, '').trim(); // Remove emoji

    // Check for duplicate category
    if (!budgetToEdit && existingCategories.includes(processedCategory)) {
      setAlertMessage(`A budget for the category "${processedCategory}" already exists.`);
      return;
    }

    onSave({ category: processedCategory, limit: newLimit });
    clearForm();
  };

  const clearForm = () => {
    setCategory('');
    setLimit('');
    setAlertMessage('');
    setCustomCategory('');
    setUseCustomCategory(false);
    if (clearEdit) {
      clearEdit();
    }
  };

  return (
    <form className={`flex flex-col items-center gap-4 p-4 rounded-lg ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`} onSubmit={handleSubmit}>
      {alertMessage && <div className="text-red-600">{alertMessage}</div>}
      {!useCustomCategory ? (
        <select
          className={`px-4 py-2 w-full border rounded ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {predefinedCategories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.emoji} {cat.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={`px-4 py-2 w-full border rounded ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}
          type="text"
          placeholder="Custom Category"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          required
        />
      )}
      <input
        className={`px-4 py-2 w-full border rounded ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}
        type="number"
        placeholder="Limit"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        required
      />
      <button
        className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-transform transform hover:scale-105"
        type="submit"
      >
        {budgetToEdit ? 'Update Budget' : 'Add Budget'}
      </button>
      {budgetToEdit && (
        <button
          className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-transform transform hover:scale-105"
          type="button"
          onClick={clearForm}
        >
          Cancel
        </button>
      )}
      <div className="flex gap-2 mt-2">
        <button
          className={`px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg shadow-md hover:bg-emerald-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition-transform transform hover:scale-105`}
          type="button"
          onClick={() => setUseCustomCategory(!useCustomCategory)}
        >
          {useCustomCategory ? 'Use Predefined Category' : 'Use Custom Category'}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;
