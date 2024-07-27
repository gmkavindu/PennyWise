import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AccountSettings from './AccountSettings';
import PersonalInformation from './PersonalInformation';
import ThemeAppearance from './ThemeAppearance';
import Navbar from '../Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faUser, faPalette, faTrashAlt, faEnvelope, faGlobe, faInfoCircle  } from '@fortawesome/free-solid-svg-icons';
import Footer from '../Footer';

const SettingsPage = () => {
  const [theme, setTheme] = useState('light');
  const [modalContent, setModalContent] = useState(null);
  const modalRef = useRef(null);
  const isThemeAppearanceModal = useRef(false);
  const navigate = useNavigate();

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
      // Optionally handle theme change without reloading
      // setTheme(theme); // You might want to update theme state here
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
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete your account?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const response = await fetch('/api/auth/delete-account', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'x-auth-token': localStorage.getItem('token'),
                },
              });
              const data = await response.json();
              console.log(data); // Log success message or handle response as needed

              // Remove authentication details from localStorage
              localStorage.removeItem('token');
              localStorage.removeItem('theme');
              window.location.reload();

              // Navigate to root after successful deletion
              navigate('/');

            } catch (error) {
              console.error('Error deleting account:', error);
              // Handle error response or display error to user
            }
          },
          className: 'react-confirm-alert-button' // Green button style
        },
        {
          label: 'No',
          className: 'react-confirm-alert-button red' // Red button style
        }
      ]
    });
  };

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'light' ? 'text-gray-900 bg-gray-100' : 'text-white bg-gray-800'}`}>
      <Navbar />
      <div className="container mx-auto py-4 px-4 max-w-screen-lg mt-40 flex-1">
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
            <li className="mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                Version: v1.0.0
              </div>
            </li>
          </ul>
        </nav>
        {modalContent && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 transition-opacity duration-300 ease-in-out">
            <div 
              className={`relative p-4 rounded-lg shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-800 text-white'} transition-transform duration-300 ease-in-out transform scale-95`} 
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
      {/* Inline Footer Content */}
      <div className="bg-gray-900 text-white py-4">
        <div className="container mx-auto text-center">
          <p>
            <span className="mr-2">Contact:</span>
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            <a href="mailto:gmkavindu@gmail.com" className="hover:text-blue-400 mr-3">gmkavindu@gmail.com</a>
            <FontAwesomeIcon icon={faGlobe} className="mr-2" />
            <a href="https://gmkavindu.me" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">gmkavindu.me</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;
