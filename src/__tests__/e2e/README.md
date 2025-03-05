# Cypress E2E Tests for House of Iris

This directory contains end-to-end tests using Cypress for the House of Iris and Tommy project.

## Structure

- `/specs`: Contains test specifications
- `/fixtures`: Contains test data
- `/support`: Contains custom commands and configuration

## Running Tests

To run the tests in headless mode:

```bash
npm run cypress:run
```

To open the Cypress Test Runner:

```bash
npm run cypress:open
```

## Writing Tests

1. Place test files in the `/specs` directory with the `.cy.ts` extension
2. Use data-testid attributes in your components for reliable test selectors
3. Use fixtures for test data

## Custom Commands

We have several custom commands available:

- `cy.login(email, password)`: Logs in a user
- `cy.cleanTestData()`: Cleans up test data
- `cy.containsText(text)`: Checks if an element contains specific text

## Tips

1. Avoid using CSS selectors or class names that might change
2. Keep tests independent from each other
3. Use beforeEach hooks for common setup
4. Use meaningful assertions
5. Use fixtures for test data rather than hardcoding it

## Integration with CI/CD

Tests are automatically run in the CI/CD pipeline. You can see the results in the GitHub Actions tab. 