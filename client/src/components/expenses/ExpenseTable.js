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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredExpenses = expenses.filter(expense => {
    return (
      (filterCategory === '' || expense.category === filterCategory) &&
      (filterDate === '' || new Date(expense.date).toISOString().split('T')[0] === filterDate) &&
      (searchTerm === '' || expense.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Search by description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Utilities">Utilities</option>
      </select>
      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />
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
          {filteredExpenses.map(expense => (
            <tr key={expense._id}>
              <td style={tdStyle}>{expense.amount}</td>
              <td style={tdStyle}>{expense.category}</td>
              <td style={tdStyle}>{new Date(expense.date).toLocaleDateString()}</td>
              <td style={tdStyle}>{expense.description}</td>
              <td style={tdStyle}>
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
