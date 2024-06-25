import React from 'react';
import BudgetItem from './BudgetItem';

const listStyle = {
  listStyleType: 'none',
  padding: '0',
};

const BudgetList = ({ budgets, onEdit, onDelete }) => {
  return (
    <ul style={listStyle}>
      {budgets.map((budget) => (
        <BudgetItem key={budget._id} budget={budget} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default BudgetList;
