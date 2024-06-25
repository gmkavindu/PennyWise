import React from 'react';

const itemStyle = {
  padding: '10px',
  marginBottom: '10px',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '5px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const buttonStyle = {
  padding: '5px 10px',
  marginLeft: '5px',
  borderRadius: '5px',
  cursor: 'pointer',
};

const editButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#007bff',
  color: '#fff',
};

const deleteButtonStyle = {
  ...buttonStyle,
  backgroundColor: 'red',
  color: '#fff',
};

const BudgetItem = ({ budget, onEdit, onDelete }) => {
  return (
    <li style={itemStyle}>
      <span>{budget.category}: RS.{budget.limit}</span>
      <div>
        <button onClick={() => onEdit(budget)} style={editButtonStyle}>Edit</button>
        <button onClick={() => onDelete(budget._id)} style={deleteButtonStyle}>Delete</button>
      </div>
    </li>
  );
};

export default BudgetItem;
