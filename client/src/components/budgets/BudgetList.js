import React from 'react';
import BudgetItem from './BudgetItem';

const BudgetList = ({ budgets, onEdit, onDelete, theme }) => {
  return (
    <ul className={`list-none ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
      {budgets.map((budget) => (
        <BudgetItem key={budget._id} budget={budget} onEdit={onEdit} onDelete={onDelete} theme={theme} />
      ))}
    </ul>
  );
};

export default BudgetList;
