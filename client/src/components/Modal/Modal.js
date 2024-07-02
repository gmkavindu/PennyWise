// Modal.js
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isVisible, onClose, children, theme }) => {
  const handleOutsideClick = (e) => {
    if (e.target.className.includes('fixed')) {
      onClose();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isVisible]);

  const modalBgClasses = {
    light: 'bg-white text-gray-700',
    dark: 'bg-gray-800 text-white',
  };

  return ReactDOM.createPortal(
    <>
      {isVisible && (
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center ${theme === 'light' ? modalBgClasses.light : modalBgClasses.dark}`}
          onClick={handleOutsideClick}
        >
          <div className={`p-1 rounded-lg shadow-lg w-full max-w-3xl relative ${theme === 'light' ? 'bg-white text-gray-700' : 'bg-gray-0 text-white'}`} onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800 text-2xl"
              onClick={onClose}
            >
              &times;
            </button>
            {children}
          </div>
        </div>
      )}
    </>,
    document.body
  );
};

export default Modal;
