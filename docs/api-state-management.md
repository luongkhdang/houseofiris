# API and State Management

This document outlines the API and state management approach used in the House of Iris and Tommy project.

## API Client

We've implemented a centralized API client using Axios to handle all API requests. This approach provides several benefits:

- Consistent error handling across the application
- Centralized request/response interceptors
- Easy configuration of base URL, headers, and timeouts
- Simplified API calls with helper methods

### API Client Structure

The API client is located at `src/services/api.ts` and includes:

- Base configuration for Axios
- Request interceptors for adding authentication headers
- Response interceptors for error handling
- Helper methods for common HTTP methods (GET, POST, PUT, DELETE)

### Error Handling

The API client includes a custom `ApiError` class that extends the standard Error class. This allows us to:

- Capture HTTP status codes
- Include the original error response
- Provide consistent error messages
- Enable type-safe error handling

## State Management with React Query

We use React Query for data fetching and state management. React Query provides:

- Automatic caching of API responses
- Background refetching of stale data
- Loading and error states
- Pagination and infinite scrolling support
- Optimistic updates for mutations

### Service Files

Each feature has its own service file that:

1. Defines TypeScript interfaces for the data
2. Implements API functions using the centralized API client
3. Creates React Query hooks for data fetching and mutations

### Example Service Structure

```typescript
// Define types
interface SomeData {
  id: string;
  name: string;
  // ...
}

// API functions
const fetchData = async (): Promise<SomeData[]> => {
  return apiGet('/endpoint');
};

const addData = async (data: Omit<SomeData, 'id'>): Promise<SomeData> => {
  return apiPost('/endpoint', data);
};

// React Query hooks
const useData = () => {
  return useQuery<SomeData[], ApiError>(['data'], fetchData, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const useAddData = () => {
  const queryClient = useQueryClient();
  
  return useMutation<SomeData, ApiError, Omit<SomeData, 'id'>>(addData, {
    onSuccess: () => {
      queryClient.invalidateQueries(['data']);
    },
  });
};
```

## Implemented Services

We've implemented the following services:

### Photo Service

Located at `src/features/gallery/services/photoService.ts`, this service:

- Defines the `Photo` interface
- Implements API functions for fetching, uploading, and deleting photos
- Creates React Query hooks: `usePhotos`, `useUploadPhoto`, and `useDeletePhoto`

### Feedback Service

Located at `src/features/feedback/services/feedbackService.ts`, this service:

- Defines the `Feedback` interface
- Implements API functions for fetching and submitting feedback
- Creates React Query hooks: `useFeedbacks` and `useSubmitFeedback`

### Schedule Service

Located at `src/features/schedule/services/scheduleService.ts`, this service:

- Defines the `Schedule` interface
- Implements API functions for fetching, adding, and deleting schedules
- Creates React Query hooks: `useSchedules`, `useAddSchedule`, and `useDeleteSchedule`

## Best Practices

When working with our API and state management:

1. Always use the centralized API client for API calls
2. Create service files for new features
3. Use React Query hooks for data fetching and mutations
4. Implement proper error handling
5. Set appropriate stale times for queries
6. Invalidate queries after mutations
7. Use TypeScript interfaces for type safety 