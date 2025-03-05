import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    specPattern: 'src/__tests__/e2e/specs/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'src/__tests__/e2e/support/e2e.ts',
    fixturesFolder: 'src/__tests__/e2e/fixtures',
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
  video: false,
  screenshotOnRunFailure: true,
}); 