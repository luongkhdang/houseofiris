/**
 * Schedule Service
 * 
 * This service handles all API calls related to schedules and provides
 * React Query hooks for data fetching and mutations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiDelete, ApiError } from '../../../services/api';
import { STALE_TIMES, CACHE_TIMES } from '../../../services/queryClient';

// Types
export interface Schedule {
  id?: string;
  title: string;
  date: string;
  description: string;
}

// Context type for mutations
interface MutationContext {
  previousSchedules?: Schedule[];
}

// API functions
export const fetchSchedules = async (): Promise<Schedule[]> => {
  return apiGet<Schedule[]>('/schedules');
};

export const addSchedule = async (schedule: Omit<Schedule, 'id'>): Promise<Schedule> => {
  return apiPost<Schedule>('/schedules', schedule);
};

export const deleteSchedule = async (id: string): Promise<void> => {
  return apiDelete<void>(`/schedules/${id}`);
};

// React Query hooks
export const useSchedules = () => {
  return useQuery<Schedule[], ApiError>({
    queryKey: ['schedules'],
    queryFn: fetchSchedules,
    staleTime: STALE_TIMES.MEDIUM, // Schedules don't change very frequently
    gcTime: CACHE_TIMES.EXTENDED,
    retry: 2,
  });
};

export const useAddSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Schedule, ApiError, Omit<Schedule, 'id'>, MutationContext>({
    mutationFn: addSchedule,
    onMutate: async (newSchedule) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['schedules'] });
      
      // Snapshot the previous value
      const previousSchedules = queryClient.getQueryData<Schedule[]>(['schedules']);
      
      // Optimistically update to the new value
      if (previousSchedules) {
        queryClient.setQueryData<Schedule[]>(['schedules'], [
          ...previousSchedules,
          // Create a temporary ID for the optimistic update
          { ...newSchedule, id: `temp-${Date.now()}` }
        ]);
      }
      
      return { previousSchedules };
    },
    onError: (err, newSchedule, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSchedules) {
        queryClient.setQueryData<Schedule[]>(['schedules'], context.previousSchedules);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, ApiError, string, MutationContext>({
    mutationFn: deleteSchedule,
    onMutate: async (id) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['schedules'] });
      
      // Snapshot the previous value
      const previousSchedules = queryClient.getQueryData<Schedule[]>(['schedules']);
      
      // Optimistically update to the new value
      if (previousSchedules) {
        queryClient.setQueryData<Schedule[]>(
          ['schedules'],
          previousSchedules.filter(schedule => schedule.id !== id)
        );
      }
      
      return { previousSchedules };
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSchedules) {
        queryClient.setQueryData<Schedule[]>(['schedules'], context.previousSchedules);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}; 