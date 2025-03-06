/**
 * Centralized API client for making HTTP requests
 * 
 * This file provides a standardized way to make API requests throughout the application.
 * It uses axios for HTTP requests and provides consistent error handling.
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Create a base axios instance with common configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Add request interceptor for authentication or other request modifications
api.interceptors.request.use(
  (config) => {
    // You can modify the request config here (add auth tokens, etc.)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Create a standardized error object
    const errorResponse = {
      status: error.response?.status || 500,
      message: error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? String(error.response.data.message)
        : error.message || 'An unexpected error occurred',
      data: error.response?.data || {},
      originalError: error,
    };

    // Log errors in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', errorResponse);
    }

    return Promise.reject(errorResponse);
  }
);

// Type for the standardized error response
export interface ApiError {
  status: number;
  message: string;
  data: unknown;
  originalError: AxiosError;
}

// Helper functions for common HTTP methods
export const apiGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.get<T>(url, config);
  return response.data;
};

export const apiPost = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.post<T>(url, data, config);
  return response.data;
};

export const apiPut = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.put<T>(url, data, config);
  return response.data;
};

export const apiDelete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.delete<T>(url, config);
  return response.data;
};

export default api; 