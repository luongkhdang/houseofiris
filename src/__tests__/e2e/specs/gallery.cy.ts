describe('Gallery Page', () => {
  beforeEach(() => {
    // Load fixture data
    cy.fixture('userData.json').as('userData');
    
    // Visit the gallery page before each test
    cy.visit('/gallery');
  });

  it('should display gallery photos', () => {
    // Wait for photos to load
    cy.get('[data-testid="gallery-grid"]').should('be.visible');
    
    // Check that we have multiple photos
    cy.get('[data-testid="photo-item"]').should('have.length.at.least', 1);
  });

  it('should filter photos when using search', () => {
    // Type in the search box
    cy.get('[data-testid="search-input"]').type('vacation');
    
    // Verify filtered results
    cy.get('[data-testid="photo-item"]').should('contain', 'vacation');
  });

  it('should show photo details when clicked', () => {
    // Click on the first photo
    cy.get('[data-testid="photo-item"]').first().click();
    
    // Verify that the modal with photo details is shown
    cy.get('[data-testid="photo-modal"]').should('be.visible');
    cy.get('[data-testid="photo-title"]').should('be.visible');
    cy.get('[data-testid="photo-description"]').should('be.visible');
  });

  it('should use fixture data for testing', function(this: { userData: { photos: Array<{ title: string, url: string, description: string }> } }) {
    // Access the fixture data using the alias
    const { photos } = this.userData;
    
    // Use the fixture data to verify the UI
    if (photos && photos.length > 0) {
      // Check for photo items and retry until the condition is met
      cy.get('[data-testid="photo-item"]')
        .should('have.length.at.least', photos.length);
      
      // Check that at least the first photo title from our fixture exists somewhere on the page
      cy.contains(photos[0].title).should('exist');
    }
  });
}); 