import React, { useEffect, useState, useCallback } from 'react';
import { fetchFinancialTips, fetchBudgets, fetchExpenses, updatePrivacyPolicyAgreement } from '../services/api';
import Navbar from './Navbar';
import { Alert, Container, Button } from 'react-bootstrap';
import { FiLoader, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const FinancialTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Please wait, we are fetching your personalized financial tips...');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');
  const [reloadOnFirstError, setReloadOnFirstError] = useState(false);
  const [lastError, setLastError] = useState(false);
  const [hasBudgetsOrExpenses, setHasBudgetsOrExpenses] = useState(false);
  const [privacyPolicyAgreement, setPrivacyPolicyAgreement] = useState(false);
  const [privacyPolicyLoading, setPrivacyPolicyLoading] = useState(true);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const parseTips = useCallback((response) => {
    return response.split('\n').filter(line => line.trim() !== '').map((line, index) => ({
      text: line.trim(),
      index,
    }));
  }, []);

  const loadTips = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingMessage('Generating tips...');

      const response = await fetchFinancialTips();

      if (!response) {
        throw new Error('Empty response received');
      }

      if (Array.isArray(response) && response.length === 1 && typeof response[0] === 'string') {
        setTips(parseTips(response[0]));
        setLoading(false);
        setError('');
        setLastError(false); // Reset lastError state on successful load
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to load financial tips:', error);
      setError('Failed to load financial tips');
      setLoading(false);

      if (!reloadOnFirstError) {
        setReloadOnFirstError(true);
        setLoadingMessage('Failed to load tips. Retrying in 5 seconds...');
        window.location.reload();
      }

      // Set lastError to true to indicate last error occurred
      setLastError(true);
    }
  }, [parseTips, reloadOnFirstError]);

  const checkBudgetsAndExpenses = useCallback(async () => {
    try {
      const budgets = await fetchBudgets();
      const expenses = await fetchExpenses();
      
      if (budgets.length > 0 || expenses.length > 0) {
        setHasBudgetsOrExpenses(true);
        loadTips();
      } else {
        setLoading(false);
        setTips([]);
        setError('To receive personalized financial tips, please set your budget and add some expenses.');
        setHasBudgetsOrExpenses(false);
      }
    } catch (error) {
      console.error('Failed to fetch budgets or expenses:', error);
      setError('Failed to fetch budgets or expenses');
      setLoading(false);
    }
  }, [loadTips]);

  const checkPrivacyPolicyAgreement = useCallback(async () => {
    try {
      const response = await fetch('/api/user/me', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      }).then(res => res.json());

      if (response.agreedToPrivacyPolicy) {
        setPrivacyPolicyAgreement(true);
        checkBudgetsAndExpenses();
      } else {
        setPrivacyPolicyAgreement(false);
      }
    } catch (error) {
      console.error('Failed to fetch privacy policy agreement status:', error);
    } finally {
      setPrivacyPolicyLoading(false);
    }
  }, [checkBudgetsAndExpenses]);

  const handleAgreeToPrivacyPolicy = async () => {
    try {
      await updatePrivacyPolicyAgreement(true);
      setPrivacyPolicyAgreement(true);
      checkBudgetsAndExpenses();
    } catch (error) {
      setError('Failed to update privacy policy agreement. Please try again.');
    }
  };

  const handleDisagreeToPrivacyPolicy = async () => {
    try {
      setPrivacyPolicyLoading(true); // Show loading state
      await updatePrivacyPolicyAgreement(false);
      setPrivacyPolicyAgreement(false);
      setTips([]); // Clear tips if user disagrees
      setError('You have disagreed with the privacy policy. You will not receive personalized financial tips.');
    } catch (error) {
      console.error('Failed to update privacy policy agreement:', error);
      setError('Failed to update privacy policy agreement. Please try again.');
    } finally {
      setPrivacyPolicyLoading(false); // Hide loading state
    }
  };

  useEffect(() => {
    checkPrivacyPolicyAgreement();
  }, [checkPrivacyPolicyAgreement]);

  const handleReload = () => {
    setReloadOnFirstError(false);
    window.location.reload();
  };

  const renderTips = () => {
    if (loading) {
      return (
        <div className="text-center">
          <p>{loadingMessage}</p>
          <div className="mt-4">
            <FiLoader className="animate-spin mx-auto text-2xl text-blue-500" />
          </div>
          <Alert variant="info" className="flex items-center justify-center">
            <FiCheckCircle className="mr-2 text-xl text-green-500" />
            Note: These tips are generated by AI and may not always be perfectly accurate.
          </Alert>
          <Alert className="mt-4">This might take a few moments.</Alert>
        </div>
      );
    }

    if (error && !lastError) { // Display error only if it's not the last error
      return (
        <div className="text-center mt-4">
          <Alert variant="danger" className="flex items-center justify-center">
            <FiAlertCircle className="mr-2 text-xl text-red-500" />
            Error: {error}
            {error.includes('budget') && (
              <div className="mt-3">
                <Link to="/budgets" className="inline-block px-4 py-2 text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Set your budget here.
                </Link>
              </div>
            )}
          </Alert>
          {hasBudgetsOrExpenses && (
            <Button variant="primary" onClick={handleReload} className="mt-3">
              Reload Tips
            </Button>
          )}
        </div>
      );
    }

    if (tips.length === 0) {
      return <Alert variant="info" className="text-center mt-4">Fetching personalized financial tips...</Alert>;
    }

    return (
      <div className="mt-4">
        <div className="text-center mb-4">
          <Alert variant="info" className="text-gray-400 flex items-center justify-center">
            <FiCheckCircle className="mr-2 text-xl text-green-500" />
            Note: These tips are generated by AI and may not always be perfectly accurate.
          </Alert>
        </div>
        {tips.map(({ text, index }) => {
          const formattedText = text
            .replace(/\*\*(.+?)\*\*/g, '<span class="text-emerald-500 font-extrabold">$1</span>')
            .replace(/\*(.+?)\*/g, '<span class="font-semibold">$1</span>');
          const isBoldSection = index === 0 || index === tips.length - 1;
          return (
            <div key={index} className={`mb-4 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 border-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} ${theme === 'dark' ? 'bg-gray-800 text-white border border-white' : 'bg-white text-gray-800'} text-center`}>
              <div className={`text-base ${isBoldSection ? 'font-bold text-blue-400' : 'font-semibold'}`} dangerouslySetInnerHTML={{ __html: formattedText }} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Container className="d-flex flex-grow justify-content-center align-items-center" fluid>
        <div className={`rounded-lg shadow-md p-4 mx-auto my-20 mt-28 ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'} max-w-3xl w-full p-6`}>
          <h1 className="text-4xl font-bold mb-8 text-center">Personalized Financial Tips</h1>
          {privacyPolicyLoading ? (
            <div className="text-center mt-4">
              <Alert variant="info" className="flex items-center justify-center">
                <FiLoader className="animate-spin mx-auto text-2xl text-blue-500" />
                Checking privacy policy status...
              </Alert>
            </div>
          ) : !privacyPolicyAgreement ? (
            <div className="text-center mt-4">
              <Alert variant="info" className="flex items-center justify-center">
                <FiAlertCircle className="mr-2 text-xl text-yellow-500" />
                To receive personalized financial tips, you need to agree to our privacy policy.
              </Alert>
              <div className="mt-3 flex flex-col items-center">
                <Button
                  variant="primary"
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="mb-2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition duration-150 ease-in-out"
                >
                  View Privacy Policy
                </Button>
                <Button
                  variant="success"
                  onClick={handleAgreeToPrivacyPolicy}
                  className="mb-2 bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-white px-4 py-2 rounded-lg shadow-md transition duration-150 ease-in-out"
                >
                  Agree
                </Button>
              </div>
            </div>
          ) : (
            <>
              {renderTips()}
              <div className="text-center mt-4">
                <Alert variant="info" className="flex items-center justify-center">
                  <FiCheckCircle className="mr-2 text-xl text-green-500" />
                  You have agreed to our privacy policy. You can disagree at any time.
                </Alert>
                <Button
                  variant="danger"
                  onClick={handleDisagreeToPrivacyPolicy}
                  className="mt-4 bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-white px-4 py-2 rounded-lg shadow-md transition duration-150 ease-in-out"
                >
                  Disagree
                </Button>
              </div>
            </>
          )}
        </div>
      </Container>
      <Footer />

      {showPrivacyPolicy && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className={`p-8 rounded-lg shadow-lg z-10 max-w-lg w-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
            <div
              className="mb-4"
              dangerouslySetInnerHTML={{
                __html: `
                <p>
                  Your privacy is important to us. This privacy policy explains how we handle your data.
                  <br /><br />
                  <strong>Data Collection:</strong> We collect your budget and expense data to provide personalized financial tips.
                  <br /><br />
                  <strong>Data Usage:</strong> Your data is used exclusively to generate financial tips tailored to your needs.
                  <br /><br />
                  <strong>Data Privacy:</strong> Your data is anonymized and handled with the utmost care.
                  <br /><br />
                  By agreeing to this policy, you consent to the collection and use of your data as described.
                </p>
                `,
              }}
            />
            <div className="text-center">
              <Button
                variant="primary"
                onClick={() => setShowPrivacyPolicy(false)}
                className="mr-2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition duration-150 ease-in-out"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialTips;
