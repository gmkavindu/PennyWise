import React, { useEffect, useState, useCallback } from 'react';
import { fetchFinancialTips } from '../services/api';
import Navbar from './Navbar';
import { Spinner, Alert, Container, Button } from 'react-bootstrap';

const FinancialTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading tips...');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');
  const [reloadOnFirstError, setReloadOnFirstError] = useState(false); // State to trigger reload on first error
  const [lastError, setLastError] = useState(false); // State to track the last error occurrence

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const parseTips = useCallback((response) => {
    const lines = response.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => {
      let type = 'normal';
      let icon = '';

      const keywordToHighlight = 'WASH:';
      if (line.toUpperCase().includes(keywordToHighlight)) {
        type = 'highlighted';
      } else if (line.startsWith('### ')) {
        type = 'section';
        line = line.replace(/### /g, '').trim();
      } else if (line.startsWith('**') && line.endsWith('**')) {
        type = 'bold';
        line = line.replace(/\*\*/g, '').trim();
        icon = getIcon(line);
      } else if (line.startsWith('- **') && line.endsWith('**')) {
        type = 'semiBold';
        line = line.replace(/- \*\*/g, '').replace(/\*\*/g, '').trim();
      } else {
        line = line.replace(/[*-]/g, '').trim();
      }

      return { type, text: line, icon, index };
    });
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

      // Trigger auto-reload only once on first error occurrence
      if (!reloadOnFirstError) {
        setReloadOnFirstError(true);
        setLoadingMessage(`Failed to load tips. Retrying in 5 seconds...`);

        setTimeout(() => {
          window.location.reload();
        }, 5000); // Retry after 5 seconds
      }

      // Set lastError to true to indicate last error occurred
      setLastError(true);
    }
  }, [parseTips, reloadOnFirstError]);

  useEffect(() => {
    loadTips();
  }, [loadTips]);

  const getIcon = (title) => {
    switch (title.toUpperCase()) {
      // Icons mapping...
    }
  };

  const handleReload = () => {
    setReloadOnFirstError(false); // Allow reload on user-triggered action
    window.location.reload();
  };

  const renderTips = () => {
    if (loading) {
      return (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="primary" />
          <p>{loadingMessage}</p>
        </div>
      );
    }

    if (error && !lastError) { // Display error only if it's not the last error
      return (
        <div className="text-center mt-4">
          <Alert variant="danger">Error: {error}</Alert>
          <Button variant="primary" onClick={handleReload} className="mt-3">
            Reload Tips
          </Button>
        </div>
      );
    }

    if (tips.length === 0) {
      return <Alert variant="info" className="text-center mt-4">Fetching personalized financial tips...</Alert>;
    }

    return (
      <div className="mt-4">
        {tips.map(({ text, type, icon, index }) => (
          <div key={index} className={`mb-4 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white border border-white' : 'bg-white text-gray-800'}`}>
            {type === 'section' && (
              <div className="text-2xl font-bold mb-2 text-blue-600">{text}</div>
            )}
            {type === 'highlighted' && (
              <div className="font-bold text-red-600">{text}</div>
            )}
            {type !== 'section' && type !== 'highlighted' && (
              <div className={`text-base ${type === 'bold' ? 'font-bold text-blue-600' : ''} ${type === 'semiBold' ? 'font-semibold text-green-500' : ''} ${type === 'normal' ? (theme === 'dark' ? 'text-white' : 'text-gray-800') : ''}`}>
                {icon && <span className="mr-2">{icon}</span>}
                {text}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <Container>
        <div className={`rounded-lg shadow-md p-4 mx-auto mt-32 mb-20 ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} max-w-4xl`}>
          <h1 className="text-4xl font-bold mb-4 text-center">Personalized Financial Tips 💡</h1>
          {renderTips()}
        </div>
      </Container>
    </>
  );
};

export default FinancialTips;
