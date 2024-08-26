import React, { useState, useRef, useEffect } from 'react';

const CustomDropdown = ({ options, selected, onSelect, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${theme === 'light' ? 'bg-white' : 'bg-gray-700'} border border-gray-300 rounded-md shadow-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`} ref={dropdownRef}>
      <button
        type="button"
        className={`w-full p-2 text-left flex justify-between items-center ${theme === 'light' ? 'bg-white' : 'bg-gray-700'} rounded-md focus:outline-none`}
        onClick={handleToggle}
      >
        {selected}
        <svg className={`w-5 h-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className={`absolute w-full mt-1 rounded-md border border-gray-300 bg-${theme === 'light' ? 'white' : 'gray-800'} shadow-lg`}>
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`w-full px-4 py-2 text-left hover:bg-${theme === 'light' ? 'gray-100' : 'gray-600'} ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
