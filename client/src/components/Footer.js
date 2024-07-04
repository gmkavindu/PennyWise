import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-2 text-center fixed bottom-0 left-0 w-full">
      <p>&copy; {new Date().getFullYear()} Kavindu Mihiran. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;