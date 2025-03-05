/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in a user
     * @example cy.login('user@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<Element>;

    /**
     * Custom command to clean test data
     * @example cy.cleanTestData()
     */
    cleanTestData(): Chainable<Element>;

    /**
     * Custom command to check if an element contains text
     * @example cy.get('.element').containsText('Hello World')
     */
    containsText(text: string): Chainable<Element>;
  }
} 