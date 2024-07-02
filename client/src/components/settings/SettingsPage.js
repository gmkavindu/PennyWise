import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import AccountSettings from './AccountSettings';
import PersonalInformation from './PersonalInformation';
import ThemeAppearance from './ThemeAppearance';
import Navbar from '../Navbar'; // Import your Navbar component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faUser, faPalette, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons

const SettingsPage = () => {
  const [theme, setTheme] = useState('light');
  const [modalContent, setModalContent] = useState(null);
  const modalRef = useRef(null);
  const isThemeAppearanceModal = useRef(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && modalRef.current.contains(e.target)) {
        return;
      }
      closeModal();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const openModal = (content, isThemeModal = false) => {
    setModalContent(content);
    isThemeAppearanceModal.current = isThemeModal;
  };

  const closeModal = () => {
    setModalContent(null);
    if (isThemeAppearanceModal.current) {
      window.location.reload();
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'), // Assuming token is stored in localStorage
        },
      });
      const data = await response.json();
      console.log(data); // Log success message or handle response as needed

      // Remove authentication details from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('theme');

      // Reload the page
      window.location.reload();

      // Add delay before navigating to root
      navigate('/');

    } catch (error) {
      console.error('Error deleting account:', error);
      // Handle error response or display error to user
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'text-gray-900 bg-gray-100' : 'text-white bg-gray-800'}`}>
      <Navbar />
      <div className="p-6 mt-60">
        <nav className="mb-6">
          <ul className="flex flex-col gap-4">
            <li>
              <button
                className="block w-full text-left text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg p-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center"
                onClick={() => openModal(<AccountSettings closeModal={closeModal} />)}
              >
                <FontAwesomeIcon icon={faUserCog} className="mr-3" />
                Account Settings
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg p-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center"
                onClick={() => openModal(<PersonalInformation closeModal={closeModal} />)}
              >
                <FontAwesomeIcon icon={faUser} className="mr-3" />
                Personal Information
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg p-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center"
                onClick={() => openModal(<ThemeAppearance closeModal={closeModal} onThemeChange={handleThemeChange} />, true)}
              >
                <FontAwesomeIcon icon={faPalette} className="mr-3" />
                Theme and Appearance
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 rounded-lg p-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center"
                onClick={handleDeleteAccount}
              >
                <FontAwesomeIcon icon={faTrashAlt} className="mr-3" />
                Delete Account
              </button>
            </li>
          </ul>
        </nav>
        {modalContent && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 transition-opacity duration-300 ease-in-out">
            <div 
              className={`relative p-4 rounded-lg shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white'} transition-transform duration-300 ease-in-out transform scale-95`} 
              ref={modalRef} 
              onClick={handleModalClick}
            >
              <button 
                className={`absolute top-2 right-2 ${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-white hover:text-gray-300'}`} 
                onClick={closeModal}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {modalContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
