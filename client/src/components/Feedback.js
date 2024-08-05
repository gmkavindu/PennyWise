import React, { useState, useEffect } from 'react';
import { submitFeedback, fetchFeedbacks } from '../services/api'; // Adjust the path if necessary
import Navbar from './Navbar';
import Footer from './Footer';

const Feedback = () => {
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = localStorage.getItem('theme') || 'light';

  useEffect(() => {
    fetchFeedbacksList();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitFeedback({ message });
      setMessage(''); // Clear the feedback input
      fetchFeedbacksList(); // Refresh the list of feedbacks
    } catch (error) {
      setError('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacksList = async () => {
    setLoading(true);
    try {
      const data = await fetchFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      setError('Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
      <Navbar />
      <div className="container mx-auto py-4 px-4 max-w-screen-lg mt-24 mb-20 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Feedback Form</h1>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="feedback-form mb-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your feedback here..."
            className={`w-full p-2 border rounded mb-2 ${theme === 'light' ? 'bg-white border-gray-300 text-black' : 'bg-gray-700 border-gray-600 text-white'}`}
            required
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="p-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
        <div className="feedback-list">
          <h2 className="text-xl font-bold mb-2">Past Feedbacks:</h2>
          {loading ? (
            <p>Loading feedbacks...</p>
          ) : feedbacks.length === 0 ? (
            <p className="text-gray-500">No feedbacks available yet. Be the first to share your thoughts!</p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {feedbacks.map((feedback, feedbackIndex) => (
                feedback.messages.map((msg, msgIndex) => (
                  <li key={`${feedbackIndex}-${msgIndex}`} className={`p-2 rounded ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
                    {msg.content}
                  </li>
                ))
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Feedback;
