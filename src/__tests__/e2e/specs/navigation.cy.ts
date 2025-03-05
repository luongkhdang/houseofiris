describe('Navigation', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('should navigate to Gallery page', () => {
    // Find and click on the gallery link/button
    cy.contains(/gallery/i).click();
    
    // Verify that we're on the gallery page
    cy.url().should('include', '/gallery');
    cy.contains(/photos/i).should('be.visible');
  });

  it('should navigate to Second page', () => {
    // Find and click on the second page link/button
    cy.contains(/second page/i).click();
    
    // Verify that we're on the second page
    cy.url().should('include', '/second');
    cy.contains(/feedback/i).should('be.visible');
  });

  it('should navigate back to home page', () => {
    // First navigate to another page
    cy.contains(/gallery/i).click();
    cy.url().should('include', '/gallery');
    
    // Find and click on the home link/button
    cy.contains(/home/i).click();
    
    // Verify that we're back on the home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains(/welcome to house of iris/i).should('be.visible');
  });
}); 