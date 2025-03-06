# House of Iris - Unified Documentation

## Table of Contents
- [Overview](#overview)
- [Quick Reference](#quick-reference)
- [Development Guidelines](#development-guidelines)
- [Testing](#testing)
- [Performance](#performance)
- [UI/UX](#uiux)
- [API and State Management](#api-and-state-management)
- [Troubleshooting](#troubleshooting)
- [AI Agent Guide](#ai-agent-guide)

## Overview

House of Iris is a personal memory storage application built using modern web technologies. It provides a secure and intuitive interface for managing personal content including photos, videos, and love letters.

### Key Features
| Feature | Description |
|---------|-------------|
| Memory Storage | Manages personal memories |
| User Authentication | Handles login and registration |
| Media Upload | Uploads photos and videos to Cloudinary |
| Email Notification | Sends notifications using EmailJS |
| Gallery | Displays photos in a gallery format |
| Feedback | Collects and displays user feedback |

### Technology Stack
| Technology | Purpose |
|------------|---------|
| Next.js | React framework for web applications |
| TypeScript | Typed JavaScript superset |
| Tailwind CSS | Utility-first styling |
| Chakra UI | Accessible UI components |
| Framer Motion | React animations |
| Redis | In-memory data store |
| Cloudinary | Image & video CDN |
| EmailJS | Client-side email API |
| Axios | HTTP client |
| React Query | Data fetching & caching |

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables (see .env.example)
cp .env.example .env.local

# Run the development server
npm run dev
```

### Project Structure
| Directory | Purpose |
|-----------|---------|
| `/components` | Reusable React components |
| `/pages` | Next.js pages corresponding to application routes |
| `/styles` | Global and component-specific styles using Tailwind CSS |
| `/utils` | Utility functions and helpers |
| `/public` | Static assets like images and fonts |
| `/api` | API routes for server-side logic |
| `/lib` | Libraries and configurations |
| `/hooks` | Custom React hooks |
| `/types` | TypeScript type definitions |

## Quick Reference

### Common Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

### Code Patterns
| Pattern | Example |
|---------|---------|
| React Server Component | `export default function Page() { ... }` |
| Client Component | `'use client'; export default function Component() { ... }` |
| Custom Hook | `export function useCustomHook() { ... }` |
| API Route | `export async function GET(request) { ... }` |

### Environment Variables
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL for API requests |
| `CLOUDINARY_URL` | Cloudinary connection string |
| `REDIS_URL` | Redis connection string |
| `EMAILJS_SERVICE_ID` | EmailJS service ID |
| `EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `EMAILJS_USER_ID` | EmailJS user ID |

## Development Guidelines

### Coding Standards
- Use TypeScript for type safety
- Follow functional programming principles
- Adhere to DRY (Don't Repeat Yourself) principles
- Use descriptive variable and function names
- Organize files logically
- Use lowercase-dash directories (e.g., components/auth-wizard)

### TypeScript Best Practices
- Define interfaces for component props
- Use type inference where possible
- Create reusable type definitions in `/types`
- Use discriminated unions for complex state

```typescript
// Example of well-typed component
interface PhotoProps {
  id: string;
  url: string;
  title: string;
  description?: string;
}

export function Photo({ id, url, title, description }: PhotoProps) {
  // Component implementation
}
```

### Component Structure
- Keep components focused on a single responsibility
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Implement proper error handling

```typescript
// Example of component composition
export function PhotoGallery() {
  const { photos, isLoading, error } = usePhotos();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!photos.length) return <EmptyState message="No photos found" />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map(photo => (
        <Photo key={photo.id} {...photo} />
      ))}
    </div>
  );
}
```

## Testing

### Testing Approach
| Test Type | Tool | Purpose |
|-----------|------|---------|
| Unit | Jest + RTL | Test individual components and functions |
| Integration | Jest + RTL | Test component interactions |
| E2E | Cypress | Test complete user flows |
| Accessibility | Axe | Test for accessibility issues |
| Performance | Lighthouse | Test for performance issues |

### Unit Testing Guidelines
- Test component rendering and behavior
- Test utility functions with various inputs
- Mock external dependencies
- Focus on behavior, not implementation details

```typescript
// Example unit test
it('should render the photo title and description', () => {
  render(<PhotoDetails photo={mockPhoto} />);
  
  expect(screen.getByText('Test Photo 1')).toBeInTheDocument();
  expect(screen.getByText('Description for test photo 1')).toBeInTheDocument();
});
```

### Integration Testing Guidelines
- Test interactions between components
- Test data flow through multiple components
- Mock external API calls

```typescript
// Example integration test
it('should navigate to next photo when clicking next button', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <GalleryPage />
    </QueryClientProvider>
  );
  
  const nextButton = screen.getByLabelText('Next photo');
  fireEvent.click(nextButton);
  
  await waitFor(() => {
    expect(screen.getByText('Test Photo 2')).toBeInTheDocument();
  });
});
```

### E2E Testing Guidelines
- Test critical user flows
- Test on multiple browsers and devices
- Include accessibility checks

```javascript
// Example E2E test
describe('Gallery Page', () => {
  it('should navigate through photos', () => {
    cy.visit('/gallery');
    cy.get('h1').should('contain', 'Our Gallery');
    
    cy.get('[data-testid="photo-title"]').should('contain', 'First Photo');
    cy.get('[aria-label="Next photo"]').click();
    cy.get('[data-testid="photo-title"]').should('contain', 'Second Photo');
  });
});
```

## Performance

### Code Splitting
- Use dynamic imports for large components
- Lazy load non-critical components
- Split code by route using Next.js page structure

```typescript
// Example of dynamic import
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <LoadingSpinner />,
  ssr: true,
});
```

### Image Optimization
- Use Next.js Image component
- Implement responsive images
- Use Cloudinary for image transformations

```typescript
// Example of optimized image
import Image from 'next/image';

export function OptimizedImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      sizes="(max-width: 640px) 90vw, (max-width: 768px) 70vw, 800px"
      placeholder="blur"
      blurDataURL={`${src}?w=10&q=10`}
      priority={false}
      loading="lazy"
    />
  );
}
```

### Caching Strategy
- Use React Query for data fetching and caching
- Implement stale-while-revalidate pattern
- Use optimistic updates for mutations

```typescript
// Example of React Query setup
export const STALE_TIMES = {
  NEVER: Infinity,
  LONG: 24 * 60 * 60 * 1000, // 24 hours
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  SHORT: 30 * 1000, // 30 seconds
};

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIMES.MEDIUM,
        gcTime: CACHE_TIMES.EXTENDED,
      },
    },
  });
};
```

## UI/UX

### Design Principles
- Consistent visual language
- Responsive design for all devices
- Accessible to all users
- Intuitive navigation
- Meaningful feedback for user actions

### Component Library
- Use Tailwind CSS for styling
- Use Chakra UI for complex components
- Use Framer Motion for animations

```typescript
// Example of styled component with Tailwind
export function Button({ children, onClick, variant = 'primary' }) {
  const baseClasses = "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Accessibility Guidelines
- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure sufficient color contrast
- Support keyboard navigation
- Test with screen readers

```typescript
// Example of accessible component
export function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border rounded">
      <button
        className="w-full p-4 text-left font-medium"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title}`}
      >
        {title}
        <span className="float-right" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        id={`accordion-content-${title}`}
        className={`p-4 ${isOpen ? 'block' : 'hidden'}`}
      >
        {children}
      </div>
    </div>
  );
}
```

## API and State Management

### API Structure
- RESTful API endpoints
- Consistent error handling
- Proper status codes
- Authentication with JWT

### Data Fetching
- Use React Query for data fetching
- Implement loading and error states
- Handle pagination and infinite scrolling

```typescript
// Example of data fetching with React Query
export function usePhotos(page = 1) {
  return useQuery({
    queryKey: ['photos', page],
    queryFn: () => fetchPhotos(page),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Usage in component
function PhotoGallery() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isPreviousData } = usePhotos(page);
  
  // Component implementation
}
```

### State Management
- Use React Query for server state
- Use Zustand for client state
- Use React Context for theme and authentication

```typescript
// Example of Zustand store
import create from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

## Troubleshooting

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Build fails with TypeScript errors | Check type definitions and fix type errors |
| Images not loading | Verify Cloudinary configuration and image paths |
| API requests failing | Check API endpoints and authentication |
| Slow performance | Implement code splitting and optimize images |
| Memory leaks | Check for missing cleanup in useEffect hooks |

### Debugging Tools
- React DevTools for component inspection
- Redux DevTools for state inspection
- Chrome DevTools for performance analysis
- Lighthouse for performance auditing

### Error Handling
- Implement error boundaries for React components
- Use try/catch blocks for async operations
- Log errors to monitoring service

```typescript
// Example of error boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

## AI Agent Guide

### Quick Commands
| Command | Response |
|---------|----------|
| `specific_command` | See DOCUMENTATION.md > 'Best Practices' |
| `another_command` | See DOCUMENTATION.md > 'Project Structure' |
| `testing_command` | See DOCUMENTATION.md > 'Testing' |
| `deployment_command` | See DOCUMENTATION.md > 'Deployment' |
| `installation_command` | See DOCUMENTATION.md > 'Installation' |
| `feature_command` | See DOCUMENTATION.md > 'Core Features' |
| `performance_command` | See DOCUMENTATION.md > 'Performance Optimization' |
| `ui_command` | See DOCUMENTATION.md > 'UI/UX Guidelines' |
| `api_command` | See DOCUMENTATION.md > 'API and State Management' |
| `refactoring_command` | See DOCUMENTATION.md > 'Refactoring Plans' |
| `build_issues_command` | See DOCUMENTATION.md > 'Build Issues Resolution' |
| `documentation_command` | See DOCUMENTATION.md > 'Documentation Guidelines' |

### Decision Trees

#### Troubleshooting Build Issues
```
Is the build failing? 
├── Yes
│   ├── Are there TypeScript errors?
│   │   ├── Yes → Fix type definitions and type errors
│   │   └── No → Continue
│   ├── Are there dependency issues?
│   │   ├── Yes → Update dependencies or fix version conflicts
│   │   └── No → Continue
│   └── Is it an environment issue?
│       ├── Yes → Check environment variables and configuration
│       └── No → Check build logs for specific errors
└── No → Continue with other troubleshooting
```

#### Performance Optimization
```
Is the application slow?
├── Yes
│   ├── Is initial load slow?
│   │   ├── Yes → Implement code splitting and optimize bundle size
│   │   └── No → Continue
│   ├── Are images slow to load?
│   │   ├── Yes → Optimize images with Next.js Image and Cloudinary
│   │   └── No → Continue
│   └── Are interactions slow?
│       ├── Yes → Optimize React rendering and implement memoization
│       └── No → Profile application to identify bottlenecks
└── No → No action needed
```

### Metadata for AI Consumption
```json
{
  "project": {
    "name": "House of Iris",
    "type": "Next.js Web Application",
    "purpose": "Personal memory storage"
  },
  "technologies": [
    {"name": "Next.js", "version": "13.x", "purpose": "React framework"},
    {"name": "TypeScript", "version": "4.x", "purpose": "Type safety"},
    {"name": "Tailwind CSS", "version": "3.x", "purpose": "Styling"},
    {"name": "React Query", "version": "4.x", "purpose": "Data fetching"}
  ],
  "structure": {
    "components": "Reusable UI components",
    "pages": "Next.js pages and routes",
    "api": "API routes and handlers",
    "lib": "Utility functions and configurations",
    "hooks": "Custom React hooks",
    "types": "TypeScript type definitions"
  }
}
``` 