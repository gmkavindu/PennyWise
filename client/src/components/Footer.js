import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-0 text-center fixed bottom-0 left-0 w-full">
      <p>&copy; {new Date().getFullYear()} Your Company. All Rights Reserved.</p>
      <p>
        <a className="text-white hover:text-gray-300 mx-2" href="/privacy-policy">Privacy Policy</a>
        <span className="text-white">|</span>
        <a className="text-white hover:text-gray-300 mx-2" href="/terms-of-service">Terms of Service</a>
      </p>
    </footer>
  );
};

export default Footer;
