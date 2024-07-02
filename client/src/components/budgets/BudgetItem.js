import React from 'react';
import { RiPencilLine, RiDeleteBinLine } from 'react-icons/ri'; // Importing icons from react-icons

const BudgetItem = ({ budget, onEdit, onDelete, theme }) => {
  return (
    <li className={`p-4 mb-4 border rounded flex justify-between items-center ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
      <span>{budget.category}: RS.{budget.limit}</span>
      <div>
        <button
          className={`px-3 py-3 rounded-full cursor-pointer mr-2 ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-blue-700 text-white'}`}
          onClick={() => onEdit(budget)}
        >
          <RiPencilLine /> {/* Edit icon */}
        </button>
        <button
          className={`px-3 py-3 rounded-full cursor-pointer ${theme === 'light' ? 'bg-red-500 text-white' : 'bg-red-700 text-white'}`}
          onClick={() => onDelete(budget._id)}
        >
          <RiDeleteBinLine /> {/* Delete icon */}
        </button>
      </div>
    </li>
  );
};

export default BudgetItem;
