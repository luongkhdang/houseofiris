/**
 * ScheduleView Component
 * 
 * This component allows users to create and manage schedules.
 * It includes responsive design, loading states, animations, and accessibility features.
 */

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useSchedules, useAddSchedule, useDeleteSchedule } from '../services/scheduleService';
import { Schedule } from '../services/scheduleService';

const ScheduleView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  
  // Use React Query hooks for data fetching and mutations
  const { data: schedules = [], isLoading, error } = useSchedules();
  const { mutate: addSchedule, isPending: isAdding } = useAddSchedule();
  const { mutate: deleteSchedule, isPending: isDeleting } = useDeleteSchedule();
  
  // Function to check if a date is in the past
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  // Handle save schedule
  const handleSave = () => {
    if (!selectedDate) {
      alert('Please select a date!');
      return;
    }
    
    if (!title.trim()) {
      alert('Please enter a title!');
      return;
    }
    
    const newSchedule: Omit<Schedule, 'id'> = {
      title: title.trim(),
      date: selectedDate.toISOString(),
      description: description.trim() || 'No description provided'
    };
    
    addSchedule(newSchedule, {
      onSuccess: () => {
        setSelectedDate(null);
        setTitle('');
        setDescription('');
      },
      onError: (error) => {
        console.error('Failed to save schedule:', error);
        alert('Failed to save schedule. Please try again.');
      }
    });
  };
  
  // Handle delete schedule
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      deleteSchedule(id, {
        onError: (error) => {
          console.error('Failed to delete schedule:', error);
          alert('Failed to delete schedule. Please try again.');
        }
      });
    }
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
    <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-6">
      <motion.h1 
        className="text-2xl md:text-3xl font-bold text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📅 Schedule Planner
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-4 md:p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">Select a Date</h2>
          <div className="calendar-wrapper">
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) {
                  setSelectedDate(value);
                } else if (Array.isArray(value)) {
                  setSelectedDate(value[0]);
                }
              }}
              value={selectedDate}
              className="w-full border-0 rounded-lg"
              tileClassName={({ date }) => {
                // Check if this date has a schedule
                const hasSchedule = schedules.some(
                  schedule => new Date(schedule.date).toDateString() === date.toDateString()
                );
                
                let classes = '';
                if (isPastDate(date)) classes += ' text-gray-400';
                if (hasSchedule) classes += ' bg-blue-100 font-medium';
                return classes.trim();
              }}
              tileDisabled={({ date }) => isPastDate(date)}
              next2Label={null}
              prev2Label={null}
            />
          </div>
        </motion.div>
        
        {/* Add Schedule Form */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-4 md:p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">Add Schedule</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="selected-date" className="block text-sm font-medium text-gray-700 mb-1">
                Selected Date
              </label>
              <input
                id="selected-date"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                value={selectedDate ? selectedDate.toDateString() : 'No date selected'}
                readOnly
                aria-describedby="date-description"
              />
              <p id="date-description" className="mt-1 text-xs text-gray-500">
                Please select a date from the calendar
              </p>
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter schedule title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!selectedDate || isAdding}
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[100px]"
                placeholder="Enter schedule details (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!selectedDate || isAdding}
              />
            </div>
            
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              onClick={handleSave}
              disabled={!selectedDate || !title.trim() || isAdding}
              aria-busy={isAdding}
            >
              {isAdding ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Schedule'}
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Schedules List */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Your Schedules</h2>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p>Failed to load schedules. Please try again later.</p>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && !error && schedules.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">No schedules yet. Add your first schedule above!</p>
          </div>
        )}
        
        {/* Schedules list */}
        {!isLoading && !error && schedules.length > 0 && (
          <motion.ul 
            className="divide-y divide-gray-100"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {schedules
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((schedule) => (
                  <motion.li 
                    key={schedule.id}
                    className="py-4 first:pt-0 last:pb-0"
                    variants={itemVariants}
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium">
                              {new Date(schedule.date).getDate()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">{schedule.title}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(schedule.date).toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        {schedule.description && (
                          <p className="mt-2 text-gray-600 ml-13">{schedule.description}</p>
                        )}
                      </div>
                      <button
                        className="self-start md:self-center text-red-500 hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full p-1"
                        onClick={() => schedule.id && handleDelete(schedule.id)}
                        disabled={isDeleting}
                        aria-label={`Delete schedule: ${schedule.title}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </motion.li>
                ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default ScheduleView; 