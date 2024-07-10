import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ category, total, current }) => {
  const percentage = (current / total) * 100;

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  }, []);

  return (
    <div className="mb-4">
      <h3 className={`text-lg font-medium mb-2 ${localStorage.getItem('theme') === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        {category}
      </h3>
      <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden border border-black">
        <div
          className={`absolute left-0 top-0 h-full ${percentage >= 80 ? 'bg-red-500' : 'bg-green-500'} border border-transparent`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="font-semibold text-gray-700">{`${Math.round(percentage)}%`}</span>
        </div>
      </div>
      <div className={`text-right mt-1 text-sm ${localStorage.getItem('theme') === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        {`RS. ${current} of RS. ${total}`}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  category: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
};

export default ProgressBar;
