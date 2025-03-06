# Performance Optimizations

This document outlines the performance optimizations implemented in Phase 4 of the House of Iris and Tommy project refactoring.

## Code Splitting

We've implemented code splitting to reduce the initial bundle size and improve loading times:

### Dynamic Imports

We use Next.js dynamic imports to load components only when they're needed:

```typescript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <LoadingSpinner />,
  ssr: true, // Enable or disable server-side rendering
});
```

### Key Components Using Dynamic Imports

- Main page components (HomePage, SecondPage, GalleryPage)
- Feature-specific components that aren't needed on initial load
- Heavy third-party libraries

### Benefits

- Reduced initial bundle size
- Faster initial page load
- Better performance on low-end devices and slow connections

## Image Optimization

We've implemented comprehensive image optimization strategies:

### Cloudinary Transformations

We use Cloudinary's URL-based transformations to optimize images:

```typescript
// Example of optimized URLs for different purposes
thumbnail: `${cloudinaryBase}/upload/c_thumb,w_80,h_80,q_auto:good,f_auto/${imagePath}`,
preview: `${cloudinaryBase}/upload/c_fill,w_400,h_400,q_auto:good,f_auto/${imagePath}`,
fullsize: `${cloudinaryBase}/upload/c_limit,w_1200,q_auto:best,f_auto/${imagePath}`,
blurDataURL: `${cloudinaryBase}/upload/c_thumb,w_10,h_10,q_30,e_blur:1000,f_auto/${imagePath}`,
```

### Next.js Image Component

We use the Next.js Image component with optimized properties:

- `fill` for responsive sizing
- `sizes` attribute for responsive loading
- `priority` for critical images
- `loading="lazy"` for non-critical images
- `placeholder="blur"` with `blurDataURL` for better loading experience

### Responsive Image Loading

We load different image sizes based on the device and viewport:

```typescript
// Example of responsive sizes attribute
sizes="(max-width: 640px) 90vw, (max-width: 768px) 70vw, (max-width: 1024px) 50vw, 800px"
```

### Benefits

- Reduced bandwidth usage
- Faster page loading
- Better user experience during image loading
- Optimized for different devices and screen sizes

## Caching Strategies

We've implemented advanced caching strategies using React Query:

### Centralized Query Client

We've created a centralized query client with optimized default settings:

```typescript
export const STALE_TIMES = {
  NEVER: Infinity,
  LONG: 24 * 60 * 60 * 1000, // 24 hours
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  SHORT: 30 * 1000, // 30 seconds
};

export const CACHE_TIMES = {
  NORMAL: 5 * 60 * 1000, // 5 minutes
  EXTENDED: 60 * 60 * 1000, // 1 hour
  LONG: 24 * 60 * 60 * 1000, // 24 hours
};

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIMES.MEDIUM,
        gcTime: CACHE_TIMES.EXTENDED,
        // ... other options
      },
    },
  });
};
```

### Data-Specific Caching

We use different caching strategies for different types of data:

- **Photos**: Medium stale time (5 minutes) with extended cache time (1 hour)
- **Feedback**: Short stale time (30 seconds) with normal cache time (5 minutes)
- **Schedules**: Medium stale time (5 minutes) with extended cache time (1 hour)

### Optimistic Updates

We implement optimistic updates for mutations to provide immediate feedback:

```typescript
onMutate: async (newItem) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey: ['items'] });
  
  // Snapshot the previous value
  const previousItems = queryClient.getQueryData<Item[]>(['items']);
  
  // Optimistically update the cache
  if (previousItems) {
    queryClient.setQueryData<Item[]>(['items'], [...previousItems, newItem]);
  }
  
  return { previousItems };
},
```

### Benefits

- Reduced API calls
- Faster user experience
- Better offline support
- Immediate feedback for user actions

## Bundle Size Reduction

We've implemented several strategies to reduce the overall bundle size:

### Tree Shaking

- Import only what's needed from libraries
- Use ES modules for better tree shaking
- Avoid importing entire libraries when only a few components are needed

### Code Optimization

- Remove unused code and dependencies
- Use smaller alternatives for large libraries
- Implement proper code splitting

### Benefits

- Faster initial load time
- Reduced memory usage
- Better performance on mobile devices

## Best Practices

When implementing performance optimizations, we follow these best practices:

1. **Measure First**: Use tools like Lighthouse, WebPageTest, and Chrome DevTools to identify performance bottlenecks before optimizing.

2. **Progressive Enhancement**: Ensure the application works without optimizations, then add them as enhancements.

3. **User-Centric Metrics**: Focus on metrics that affect user experience, such as First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Time to Interactive (TTI).

4. **Regular Monitoring**: Continuously monitor performance metrics to ensure optimizations remain effective over time.

5. **Balance**: Find the right balance between performance and developer experience/code maintainability. 