# House of Iris and Tommy: Testing Standards

## Introduction

This document outlines the testing standards for the House of Iris and Tommy project. By following these standards, we ensure:

- Consistent, maintainable tests across the codebase
- High-quality test coverage for critical functionality
- Clear expectations for how to write and structure tests
- Reliable test results that catch regressions

## Test Types

### Unit Tests

Unit tests focus on testing individual components or functions in isolation.

**When to use:**
- Testing utility functions
- Testing individual React components
- Testing specific edge cases for a single piece of functionality

**Structure:**
```typescript
describe('ComponentName', () => {
  // Setup before each test if needed
  beforeEach(() => {
    // Setup code
  });

  // Group related tests
  describe('specific functionality', () => {
    it('should behave in a specific way given certain inputs', () => {
      // Arrange - set up test data
      // Act - call the function or render the component
      // Assert - check the results match expectations
    });
  });
});
```

### Integration Tests

Integration tests examine how multiple components or functions work together.

**When to use:**
- Testing API endpoints with their handlers
- Testing component interactions
- Testing form submissions and responses

**Structure:**
Similar to unit tests, but with a focus on interactions between components.

### End-to-End Tests

E2E tests verify complete user flows through the application.

**When to use:**
- Critical user journeys (uploading photos, viewing gallery, submitting feedback)
- Complex multi-step workflows

## Mocking

### Standardized Mocks

Use the standardized mocks in `src/__tests__/__mocks__/` for common dependencies:

- `redisMock.ts` - For Redis operations
- `cloudinaryMock.ts` - For Cloudinary operations
- `emailjsMock.ts` - For EmailJS operations

**Example usage:**
```typescript
import redisMock from '../__mocks__/redisMock';

jest.mock('ioredis', () => redisMock);

// Test specific setup
beforeEach(() => {
  redisMock.__resetStore();
});
```

### Component Mocking

When mocking React components:

- Use simple function components that return minimal representations
- Include data-testid attributes for reliable test querying
- Mock only the minimum needed behavior

```typescript
jest.mock('../../components/ComplexComponent', () => {
  return function MockComponent(props) {
    return <div data-testid="mock-complex-component">{props.children}</div>;
  };
});
```

### API Mocking

Use the `setupApiMocks` utility from `src/__tests__/helpers/testUtils.ts`:

```typescript
import { setupApiMocks } from '../helpers/testUtils';

describe('Component with API calls', () => {
  const fetchMock = jest.spyOn(global, 'fetch');
  
  beforeEach(() => {
    setupApiMocks(fetchMock);
  });
});
```

## Testing Utilities

### Common Utilities

Use the testing utilities from `src/__tests__/helpers/testUtils.ts`:

- `renderWithProviders` - Renders components with all necessary providers
- `mockDate` - Mocks the global Date object
- `testData` - Provides consistent test data
- `setupApiMocks` - Sets up common API endpoint mocks

### Assertions

Prefer testing-library assertions when testing React components:

```typescript
// Prefer this:
expect(screen.getByText('Submit')).toBeInTheDocument();

// Over this:
expect(wrapper.find('button').text()).toBe('Submit');
```

## Best Practices

### Test Organization

1. Group tests logically using nested `describe` blocks
2. Name tests clearly using `it('should...')` syntax
3. Place mocks at the top of the file
4. Use `beforeEach` for common setup
5. Use `afterEach` for cleanup

### Testing Components

1. Test the component's primary functionality first
2. Test edge cases and error states
3. Test user interactions (clicking, typing, etc.)
4. Verify the component renders with the expected CSS classes

### Example Component Test:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../helpers/testUtils';
import MyComponent from '../../app/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly with default props', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    renderWithProviders(<MyComponent />);
    fireEvent.click(screen.getByText('Click me'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });

  it('should handle error states', () => {
    renderWithProviders(<MyComponent hasError={true} />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });
});
```

### Testing API Routes

1. Mock any dependencies (Redis, Cloudinary, etc.)
2. Test the route handler function directly when possible
3. Test both successful and error responses
4. Verify the response format matches expectations

## Coverage Goals

- **Overall coverage goal**: 70% or higher
- **Critical components/functions**: 90% or higher
- **API routes**: 80% or higher
- **Utility functions**: 90% or higher

## Running Tests

### Standard Test Run

```bash
npm test
```

### Coverage Report

```bash
npm test -- --coverage
```

### Watch Mode (During Development)

```bash
npm test -- --watch
```

## Continuous Improvement

This document will evolve as our testing practices improve. All team members are encouraged to suggest improvements to our testing standards and practices.

## References

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Next.js Testing Documentation](https://nextjs.org/docs/testing) 