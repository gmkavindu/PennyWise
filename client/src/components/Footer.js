import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-2 text-center left-0 w-full">
      <p>&copy; {new Date().getFullYear()} PennyWise. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
