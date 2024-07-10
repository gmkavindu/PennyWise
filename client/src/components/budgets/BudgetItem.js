import React from 'react';
import { RiPencilLine, RiDeleteBinLine } from 'react-icons/ri'; // Importing icons from react-icons
import { confirmAlert } from 'react-confirm-alert'; // Import confirmAlert from react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import stylesheet

const BudgetItem = ({ budget, onEdit, onDelete, theme }) => {

  const handleDeleteClick = () => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this budget item?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => onDelete(budget._id),
          className: 'react-confirm-alert-button' // Use the green button style
        },
        {
          label: 'No',
          className: 'react-confirm-alert-button red' // Use the red button style
        }
      ]
    });
  };

  return (
    <li className={`p-4 mb-4 border rounded flex justify-between items-center transition-transform transform-gpu hover:scale-105 ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}>
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
          onClick={handleDeleteClick} // Call handleDeleteClick for delete action
        >
          <RiDeleteBinLine /> {/* Delete icon */}
        </button>
      </div>
    </li>
  );
};

export default BudgetItem;
