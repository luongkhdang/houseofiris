// src/__tests__/e2e/support/commands.ts
// Custom Cypress commands

// Example of a custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// Example of a custom command for cleaning test data
Cypress.Commands.add('cleanTestData', () => {
  // This would typically make an API call to clean up test data
  cy.request('POST', '/api/test/cleanup').then((response) => {
    expect(response.status).to.eq(200);
  });
});

// Example of a custom command to check if an element contains a specific text
Cypress.Commands.add('containsText', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject).should('contain', text);
  return cy.wrap(subject);
});

// Declare the Cypress namespace to extend with custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      cleanTestData(): Chainable<void>;
      containsText(text: string): Chainable<Element>;
    }
  }
} 