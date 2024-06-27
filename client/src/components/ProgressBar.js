import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ category, total, current, styles }) => {
  // Calculate the percentage of budget used
  const percentage = total !== 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div style={styles.progressBarContainer}>
      <p>{category}</p>
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progress,
            width: `${percentage}%`,
            backgroundColor: percentage > 80 ? 'red' : 'green',
          }}
        >
          {`${percentage.toFixed(2)}%`}
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  category: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  styles: PropTypes.object.isRequired,
};

export default ProgressBar;
