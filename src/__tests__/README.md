# Testing Documentation for House of Iris and Tommy

This directory contains all the tests for the House of Iris and Tommy project. The testing strategy follows the guidelines outlined in the main DOCUMENTATION.md file.

## Test Structure

```
__tests__/
├── api/                 # API route tests
│   ├── feedbacks.test.ts
│   ├── photos.test.ts
│   ├── schedules.test.ts
│   └── sticker-list.test.ts
├── components/          # React component tests
│   ├── GalleryPage.test.tsx
│   ├── HomePage.test.tsx
│   ├── JailPage.test.tsx
│   └── SecondPage.test.tsx
├── e2e/                 # End-to-end tests using Cypress
│   ├── cypress.config.ts
│   ├── specs/
│   │   └── navigation.cy.ts
│   └── support/
│       ├── commands.ts
│       └── e2e.ts
├── __mocks__/           # Mock files for testing
│   ├── fileMock.js
│   └── styleMock.js
├── setupTests.ts        # Test setup configuration
├── jest.config.js       # Jest configuration
└── README.md            # This file
```

## Testing Frameworks

1. **Jest**: Used for unit and integration testing
2. **React Testing Library**: Used for testing React components
3. **Cypress**: Used for end-to-end testing
4. **Lighthouse**: Used for performance testing
5. **OWASP ZAP**: Used for security testing

## Running Tests

### Unit and Integration Tests

To run all Jest tests with coverage:

```bash
npm test
```

To run tests in watch mode during development:

```bash
npm run test:watch
```

### End-to-End Tests

To run Cypress tests in headless mode:

```bash
npm run test:e2e
```

To open the Cypress test runner:

```bash
npm run test:e2e:open
```

### All Tests

To run all tests (unit, integration, and end-to-end):

```bash
npm run test:all
```

### Performance Testing

To run Lighthouse performance tests:

```bash
npm run lighthouse
```

## Testing Best Practices

1. **Test Coverage**: Aim for at least 80% code coverage.
2. **Test Organization**: Follow the established directory structure.
3. **Mocking**: Use Jest mocks for external dependencies.
4. **Component Testing**: Focus on user interactions and accessibility.
5. **API Testing**: Test both success and error cases.
6. **End-to-End Testing**: Test critical user flows.

## Writing Tests

### API Tests

API tests should:
- Test both success and error cases
- Mock external dependencies like Redis
- Verify proper HTTP status codes and response formats

Example:

```typescript
describe('API Route', () => {
  it('should return expected data for success case', async () => {
    // Setup
    // Execute
    // Assert
  });

  it('should handle errors gracefully', async () => {
    // Setup
    // Execute
    // Assert
  });
});
```

### Component Tests

Component tests should:
- Focus on user interactions
- Test accessibility
- Verify component renders correctly
- Mock external dependencies and data fetching

Example:

```tsx
describe('Component Name', () => {
  it('should render correctly', () => {
    // Render component
    // Assert expected elements exist
  });

  it('should handle user interactions', () => {
    // Render component
    // Simulate user interaction
    // Assert expected behavior
  });
});
```

### End-to-End Tests

E2E tests should:
- Test critical user flows
- Verify navigation works correctly
- Test forms and data submission
- Verify visual elements appear correctly

Example:

```typescript
describe('User Flow', () => {
  it('should complete the entire flow', () => {
    // Visit starting page
    // Perform actions
    // Assert expected outcomes
  });
});
```

## Continuous Integration

Tests are automatically run in the CI pipeline with each pull request. PRs cannot be merged unless all tests pass.

## Adding New Tests

When adding new features or components:
1. Create corresponding tests following the established patterns
2. Ensure tests cover both success and failure cases
3. Run the tests locally before submitting a PR
4. Include test coverage in your PR description

## Troubleshooting

If tests are failing:
1. Check if your changes broke existing functionality
2. Verify that all dependencies are installed
3. Check for environmental differences between local and CI
4. Update tests if the expected behavior has changed

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/guides/overview/why-cypress) 