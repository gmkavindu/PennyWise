// src/components/budgets/BudgetList.js
import React from 'react';
import BudgetItem from './BudgetItem';

const BudgetList = ({ budgets, onEdit, onDelete }) => {
  return (
    <div>
      {budgets.map(budget => (
        <BudgetItem
          key={budget._id}
          budget={budget}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BudgetList;
