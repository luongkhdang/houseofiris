import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'src/__tests__/e2e/specs/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'src/__tests__/e2e/support/e2e.ts',
  },
}); 