/**
 * Feedback Service
 * 
 * This service handles all API calls related to user feedback and provides
 * React Query hooks for data fetching and mutations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, ApiError } from '../../../services/api';
import { STALE_TIMES, CACHE_TIMES } from '../../../services/queryClient';

// Types
export interface Feedback {
  id?: string;
  date: string;
  content: string;
  replies?: string;
}

// API functions
export const fetchFeedbacks = async (): Promise<Feedback[]> => {
  return apiGet<Feedback[]>('/feedbacks');
};

export const submitFeedback = async (feedback: Omit<Feedback, 'id'>): Promise<Feedback> => {
  return apiPost<Feedback>('/feedbacks', feedback);
};

// React Query hooks
export const useFeedbacks = () => {
  return useQuery<Feedback[], ApiError>({
    queryKey: ['feedbacks'],
    queryFn: fetchFeedbacks,
    staleTime: STALE_TIMES.SHORT, // Feedback can change frequently
    gcTime: CACHE_TIMES.NORMAL,
    retry: 2,
  });
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Feedback, ApiError, Omit<Feedback, 'id'>>({
    mutationFn: submitFeedback,
    onSuccess: (newFeedback) => {
      // Optimistic update: Add the new feedback to the cache immediately
      queryClient.setQueryData<Feedback[]>(['feedbacks'], (oldData = []) => {
        return [...oldData, newFeedback].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      });
      
      // Then invalidate to ensure we get the latest data from the server
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    },
  });
}; 