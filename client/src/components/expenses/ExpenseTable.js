import React, { useState } from 'react';

const containerStyle = {
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

const ExpenseTable = ({ onEdit, onDelete, expenses }) => {
  // State hooks for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Extracting unique categories from expenses
  const categories = [...new Set(expenses.map(expense => expense.category))];

  // Filtering expenses based on search term, category, and date
  const filteredExpenses = expenses
    .filter(expense => {
      return (
        (filterCategory === '' || expense.category === filterCategory) &&
        (filterDate === '' || new Date(expense.date).toISOString().split('T')[0] === filterDate) &&
        (searchTerm === '' || expense.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date in descending order

  return (
    <div style={containerStyle}>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search by description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Category filter dropdown */}
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      {/* Date filter input */}
      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />
      {/* Expense table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping filtered expenses to table rows */}
          {filteredExpenses.map(expense => (
            <tr key={expense._id}>
              <td style={tdStyle}>{expense.amount}</td>
              <td style={tdStyle}>{expense.category}</td>
              <td style={tdStyle}>{new Date(expense.date).toLocaleDateString()}</td>
              <td style={tdStyle}>{expense.description}</td>
              <td style={tdStyle}>
                {/* Edit and delete buttons for each expense */}
                <button onClick={() => onEdit(expense)}>Edit</button>
                <button onClick={() => onDelete(expense._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
