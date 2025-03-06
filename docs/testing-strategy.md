# Testing Strategy

This document outlines the testing strategy for the House of Iris and Tommy project, including the types of tests, testing tools, and best practices.

## Table of Contents

- [Overview](#overview)
- [Testing Pyramid](#testing-pyramid)
- [Testing Tools](#testing-tools)
- [Test Types](#test-types)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
  - [End-to-End Tests](#end-to-end-tests)
  - [Accessibility Tests](#accessibility-tests)
  - [Performance Tests](#performance-tests)
- [Test Organization](#test-organization)
- [Mocking Strategy](#mocking-strategy)
- [Continuous Integration](#continuous-integration)
- [Best Practices](#best-practices)
- [Special Testing Considerations](#special-testing-considerations)
- [Code Coverage](#code-coverage)

## Overview

Testing is a critical part of our development process, ensuring that our application functions correctly, maintains high quality, and provides a good user experience. Our testing strategy is designed to catch issues early in the development cycle and provide confidence in our codebase.

## Testing Pyramid

We follow the testing pyramid approach, which suggests having:

1. **Many unit tests** - Fast, focused tests that verify individual components and functions
2. **Some integration tests** - Tests that verify interactions between components
3. **Few end-to-end tests** - Tests that verify the entire application flow

This approach provides a balance between test coverage, execution speed, and maintenance cost.

## Testing Tools

We use the following tools for testing:

- **Jest** - JavaScript testing framework for unit and integration tests
- **React Testing Library** - Library for testing React components
- **Cypress** - End-to-end testing framework
- **Axe** - Accessibility testing library
- **Lighthouse** - Performance testing tool

## Test Types

### Unit Tests

Unit tests verify that individual components and functions work correctly in isolation. They should be fast, focused, and cover a wide range of scenarios.

#### Example Unit Test

```tsx
// Testing a component
it('should render the photo title and description', () => {
  render(<PhotoDetails photo={mockPhoto} />);
  
  expect(screen.getByText('Test Photo 1')).toBeInTheDocument();
  expect(screen.getByText('Description for test photo 1')).toBeInTheDocument();
});

// Testing a function
it('fetchPhotos should call apiGet with correct endpoint', async () => {
  (apiGet as jest.Mock).mockResolvedValue([]);
  
  await fetchPhotos();
  
  expect(apiGet).toHaveBeenCalledWith('/photos');
  expect(apiGet).toHaveBeenCalledTimes(1);
});
```

### Integration Tests

Integration tests verify that multiple components work together correctly. They test the interactions between components and ensure that data flows correctly through the application.

#### Example Integration Test

```tsx
it('should navigate to next photo when clicking next button', async () => {
  // Mock the usePhotos hook to return data
  (usePhotos as jest.Mock).mockReturnValue({
    data: mockPhotos,
    isLoading: false,
    error: null,
    isError: false,
  });
  
  render(
    <QueryClientProvider client={queryClient}>
      <GalleryPage />
    </QueryClientProvider>
  );
  
  // Find and click the next button
  const nextButton = screen.getByLabelText('Next photo');
  fireEvent.click(nextButton);
  
  // Check if the second photo is now displayed
  await waitFor(() => {
    expect(screen.getByText('Test Photo 2')).toBeInTheDocument();
  });
});
```

### End-to-End Tests

End-to-end tests verify that the entire application works correctly from the user's perspective. They simulate user interactions and verify that the application behaves as expected.

#### Example End-to-End Test

```js
describe('Gallery Page', () => {
  it('should navigate through photos', () => {
    cy.visit('/gallery');
    cy.get('h1').should('contain', 'Our Gallery');
    
    // Check if the first photo is displayed
    cy.get('[data-testid="photo-title"]').should('contain', 'First Photo');
    
    // Click the next button
    cy.get('[aria-label="Next photo"]').click();
    
    // Check if the second photo is displayed
    cy.get('[data-testid="photo-title"]').should('contain', 'Second Photo');
  });
});
```

### Accessibility Tests

Accessibility tests verify that the application is accessible to all users, including those with disabilities. They check for issues such as missing alt text, insufficient color contrast, and keyboard navigation.

#### Example Accessibility Test

```js
it('should have no accessibility violations', async () => {
  const { container } = render(<GalleryPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Performance Tests

Performance tests verify that the application performs well under various conditions. They check for issues such as slow loading times, excessive memory usage, and poor responsiveness.

#### Example Performance Test

```js
describe('Performance', () => {
  it('should load the gallery page quickly', () => {
    cy.visit('/gallery');
    cy.lighthouse({
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
    });
  });
});
```

## Test Organization

Tests are organized in a way that mirrors the structure of the source code. For example, tests for components in `src/features/gallery/components` are located in `src/__tests__/features/gallery/components`.

```
src/
├── __tests__/
│   ├── features/
│   │   ├── gallery/
│   │   │   ├── components/
│   │   │   │   ├── GalleryPage.test.tsx
│   │   │   │   ├── Photo.test.tsx
│   │   │   │   └── PhotoDetails.test.tsx
│   │   │   └── services/
│   │   │       └── photoService.test.ts
│   │   ├── feedback/
│   │   └── schedule/
│   ├── lib/
│   └── setup.ts
└── features/
    ├── gallery/
    ├── feedback/
    └── schedule/
```

## Mocking Strategy

We use Jest's mocking capabilities to isolate components and functions during testing. This allows us to test components without relying on external dependencies.

### API Mocking

```tsx
// Mock the API functions
jest.mock('../../../lib/api', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiDelete: jest.fn(),
}));

// Import the mocked API functions
const { apiGet, apiPost, apiDelete } = jest.requireMock('../../../lib/api');
```

### Component Mocking

```tsx
// Mock the photoService hooks
jest.mock('../../../features/gallery/services/photoService', () => ({
  usePhotos: jest.fn(),
  Photo: jest.requireActual('../../../features/gallery/services/photoService').Photo,
}));
```

### External Library Mocking

```tsx
// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock framer-motion to avoid animation-related issues in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }) => (
        <div data-testid="motion-div" {...props}>{children}</div>
      ),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});
```

## Continuous Integration

Tests are run automatically as part of our continuous integration (CI) pipeline. This ensures that all tests pass before code is merged into the main branch.

## Best Practices

1. **Write tests first** - Follow test-driven development (TDD) principles when possible
2. **Keep tests simple** - Tests should be easy to understand and maintain
3. **Test behavior, not implementation** - Focus on what the component does, not how it does it
4. **Use meaningful assertions** - Make it clear what you're testing and why
5. **Avoid testing implementation details** - Test the public API of components and functions
6. **Use realistic test data** - Use data that resembles what the component will receive in production
7. **Clean up after tests** - Reset mocks and clean up DOM after each test
8. **Avoid test interdependence** - Tests should not depend on the order in which they run
9. **Test edge cases** - Test boundary conditions and error scenarios
10. **Keep tests fast** - Tests should run quickly to provide fast feedback

## Special Testing Considerations

### Local-Only Features

Some features in the application are designed for local development only and are not included in the production build:

- **Secret Admin Page**: The `/secret` route provides a local-only interface for editing database entries. This page is not uploaded to GitHub or deployed to production.
  - **Testing Approach**: Tests for this page should be kept in a separate directory and excluded from CI/CD pipelines.
  - **Test Isolation**: Ensure tests for this page use mocked data and don't interact with the actual database.
  - **Security Verification**: Include tests to verify that this page is not included in production builds.

When testing local-only features, use the following guidelines:

1. **Isolate the tests** - Keep tests for local-only features separate from the main test suite
2. **Use environment flags** - Use environment variables to conditionally run these tests
3. **Mock external dependencies** - Avoid interacting with real databases or services
4. **Verify security boundaries** - Test that these features are properly excluded from production builds

## Code Coverage

We aim for high code coverage, but quality is more important than quantity. We focus on testing critical paths and complex logic, rather than aiming for 100% coverage.

Our current coverage goals are:
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

Coverage reports are generated as part of our CI pipeline and can be viewed locally by running:

```bash
npm run test:coverage
``` 