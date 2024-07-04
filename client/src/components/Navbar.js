import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import { FiHome, FiDollarSign, FiBarChart2, FiHelpCircle, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';
import { MdAttachMoney } from 'react-icons/md';
import logoName from '../assets/images/logo-name.png';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    // Function to close menu when clicking outside
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen || isPopupOpen) {
        if (menuRef.current && !menuRef.current.contains(event.target) && popupRef.current && !popupRef.current.contains(event.target)) {
          setIsMobileMenuOpen(false);
          setIsPopupOpen(false);
        }
      }
    };

    // Adding event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleaning up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, isPopupOpen]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/');
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Determine background color and text color based on theme
  const getBackgroundColor = () => {
    return localStorage.getItem('theme') === 'dark' ? 'bg-gray-800' : 'bg-white';
  };

  const getTextColor = () => {
    return localStorage.getItem('theme') === 'dark' ? 'text-white' : 'text-gray-800';
  };

  const getHoverTextColor = () => {
    return localStorage.getItem('theme') === 'dark' ? 'text-gray-100' : 'text-gray-800';
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 shadow-md ${getBackgroundColor()} transition-all duration-300`}>
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center">
          <Link to="/dashboard">
            <img src={logoName} alt="Logo" className="h-16 md:h-20 w-auto mr-4" />
          </Link>
        </div>

        {/* Default Desktop Menu */}
        <div className="hidden md:flex space-x-4" ref={menuRef}>
          <Link to="/dashboard" className={`btn-nav ${getTextColor()} hover:${getHoverTextColor()} transition duration-300`}>
            <FiHome className="mr-2" /> Dashboard
          </Link>
          <Link to="/expenses" className={`btn-nav ${getTextColor()} hover:${getHoverTextColor()} transition duration-300`}>
            <MdAttachMoney className="mr-2" /> Expenses
          </Link>
          <Link to="/budgets" className={`btn-nav ${getTextColor()} hover:${getHoverTextColor()} transition duration-300`}>
            <FiDollarSign className="mr-2" /> Budgets
          </Link>
          <Link to="/visualization" className={`btn-nav ${getTextColor()} hover:${getHoverTextColor()} transition duration-300`}>
            <FiBarChart2 className="mr-2" /> Data
          </Link>
          <Link to="/financial-tips" className={`btn-nav ${getTextColor()} hover:${getHoverTextColor()} transition duration-300`}>
            <FiHelpCircle className="mr-2" /> Financial Tips
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden" ref={menuRef}>
          <button
            className="circle-btn-nav text-2xl p-2 rounded-full hover:bg-gray-200 transition duration-300"
            onClick={toggleMobileMenu}
            aria-haspopup="true"
          >
            <FiMenu />
          </button>
          {isMobileMenuOpen && (
            <div className={`absolute right-0 mt-2 w-48 shadow-lg rounded-lg ${getBackgroundColor()}`} ref={popupRef}>
              <Link to="/dashboard" className={`block w-full px-4 py-2 ${getTextColor()} hover:${getHoverTextColor()} flex items-center transition duration-300`}>
                <FiHome className="mr-2" /> Dashboard
              </Link>
              <Link to="/expenses" className={`block w-full px-4 py-2 ${getTextColor()} hover:${getHoverTextColor()} flex items-center transition duration-300`}>
                <MdAttachMoney className="mr-2" /> Expenses
              </Link>
              <Link to="/budgets" className={`block w-full px-4 py-2 ${getTextColor()} hover:${getHoverTextColor()} flex items-center transition duration-300`}>
                <FiDollarSign className="mr-2" /> Budgets
              </Link>
              <Link to="/visualization" className={`block w-full px-4 py-2 ${getTextColor()} hover:${getHoverTextColor()} flex items-center transition duration-300`}>
                <FiBarChart2 className="mr-2" /> Data
              </Link>
              <Link to="/financial-tips" className={`block w-full px-4 py-2 ${getTextColor()} hover:${getHoverTextColor()} flex items-center transition duration-300`}>
                <FiHelpCircle className="mr-2" /> Financial Tips
              </Link>
              <Link to="/settings" className={`block w-full px-4 py-2 ${getTextColor()} hover:${getHoverTextColor()} flex items-center transition duration-300`}>
                <FiSettings className="mr-2" /> Settings
              </Link>
              <button onClick={handleLogout} className={`block w-full px-4 py-2 text-red-500 hover:${getHoverTextColor()} flex items-center transition duration-300`}>
                <FiLogOut className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Default Popup Menu */}
        <div className="relative hidden md:block" ref={menuRef}>
          <button
            className="circle-btn-nav text-2xl p-2 rounded-full hover:bg-gray-200 transition duration-300"
            onClick={togglePopup}
            aria-haspopup="true"
          >
            <FiMenu />
          </button>
          {isPopupOpen && (
            <div className={`absolute right-0 mt-2 w-48 shadow-lg rounded-lg ${getBackgroundColor()}`} ref={popupRef}>
              <Link to="/settings" className={`block w-full px-4 py-2 ${getTextColor()} hover:${getHoverTextColor()} flex items-center transition duration-300`}>
                <FiSettings className="mr-2" /> Settings
              </Link>
              <button onClick={handleLogout} className={`block w-full px-4 py-2 text-red-500 hover:${getHoverTextColor()} flex items-center transition duration-300`}>
                <FiLogOut className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
