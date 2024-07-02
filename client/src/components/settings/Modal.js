// Modal.js

import React from 'react';

const Modal = ({ isOpen, onClose, children, showCloseIcon }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevents clicks inside modal from closing it
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg" onClick={handleModalClick}>
        {showCloseIcon && (
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <div onClick={handleOverlayClick} className="absolute inset-0" />
        {children}
      </div>
    </div>
  );
};

export default Modal;
