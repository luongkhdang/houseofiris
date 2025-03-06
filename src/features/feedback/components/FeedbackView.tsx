/**
 * FeedbackView Component
 * 
 * This component allows users to submit feedback and view previous feedback.
 * It includes responsive design, loading states, animations, and accessibility features.
 */

"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFeedbacks, useSubmitFeedback } from '../services/feedbackService';

const FeedbackView: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  
  // Use React Query hooks for data fetching and mutations
  const { data: feedbackPosts = [], isLoading, error } = useFeedbacks();
  const { mutate: submitFeedback, isPending: isSubmitting } = useSubmitFeedback();
  
  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert('Please enter your feedback!');
      return;
    }
    
    // Submit feedback using the mutation
    submitFeedback(
      { 
        date: new Date().toISOString(), 
        content: feedback 
      },
      {
        onSuccess: () => {
          setFeedback('');
        },
        onError: (error) => {
          console.error('Failed to send feedback:', error);
          alert('Failed to send feedback. Please try again.');
        }
      }
    );
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 md:px-6">
      <motion.h1 
        className="text-2xl md:text-3xl font-bold text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📝 Message Box
      </motion.h1>

      {/* Textarea & Button Wrapper */}
      <motion.div 
        className="bg-white rounded-lg shadow-md p-4 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <label htmlFor="feedback-input" className="block text-sm font-medium text-gray-700 mb-2">
          Share your thoughts
        </label>
        <div className="flex flex-col md:flex-row gap-3">
          <textarea
            id="feedback-input"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none min-h-[100px]"
            placeholder="Type your message here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={isSubmitting}
            aria-describedby="feedback-description"
          />
          <div className="flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              onClick={handleSubmit}
              disabled={isSubmitting || !feedback.trim()}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : 'Send'}
            </button>
          </div>
        </div>
        <p id="feedback-description" className="mt-2 text-xs text-gray-500">
          Your message will be visible to everyone. Be kind and respectful.
        </p>
      </motion.div>

      {/* Display Submitted Feedback */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">🕊️ Message History</h2>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p>Failed to load messages. Please try again later.</p>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && !error && feedbackPosts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="mt-2">No messages yet. Be the first to share!</p>
          </div>
        )}
        
        {/* Message list */}
        {!isLoading && !error && feedbackPosts.length > 0 && (
          <motion.ul 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {feedbackPosts.map((post, index) => (
              <motion.li 
                key={post.id || index}
                className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                variants={itemVariants}
              >
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800">Message</span>
                    <time className="text-xs text-gray-500" dateTime={post.date}>
                      {new Date(post.date).toLocaleString()}
                    </time>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
                  
                  {post.replies && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-200">
                      <div className="flex items-center mb-1">
                        <span className="text-sm font-medium text-blue-600">Reply</span>
                      </div>
                      <p className="text-gray-700 text-sm">{post.replies}</p>
                    </div>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default FeedbackView; 