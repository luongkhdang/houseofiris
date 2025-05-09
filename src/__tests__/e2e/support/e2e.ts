// src/__tests__/e2e/support/e2e.ts
// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively import specific commands
// import './commands/authentication'

// Hide fetch/XHR requests from command log
const app = window.top;
if (app && !app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
} 