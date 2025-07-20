// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Import visual regression testing
import 'cypress-visual-regression/dist/commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top;
if (
  app &&
  !app.document.head.querySelector('[data-hide-command-log-request]')
) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Configure visual regression testing
Cypress.Commands.add('compareSnapshot', (name: string, options = {}) => {
  cy.compareSnapshot(name, {
    threshold: 0.1,
    thresholdType: 'percent',
    ...options,
  });
});

// Custom visual regression commands
Cypress.Commands.add('takeVisualSnapshot', (name: string, options = {}) => {
  cy.compareSnapshot(name, {
    threshold: 0.1,
    thresholdType: 'percent',
    ...options,
  });
});

Cypress.Commands.add('compareVisualSnapshot', (name: string, options = {}) => {
  cy.compareSnapshot(name, {
    threshold: 0.1,
    thresholdType: 'percent',
    ...options,
  });
});

// Wait for animations to complete before taking screenshots
Cypress.Commands.add('waitForAnimations', () => {
  cy.wait(1000); // Wait for any animations to complete
});

// Ensure consistent viewport for visual testing
Cypress.Commands.add('setVisualViewport', (width = 1280, height = 720) => {
  cy.viewport(width, height);
});

// Hide dynamic content that changes between runs
Cypress.Commands.add('hideDynamicContent', () => {
  // Hide timestamps, dates, and other dynamic content
  cy.get('body').then($body => {
    // Hide elements with dynamic content
    $body
      .find(
        '[data-testid="timestamp"], [data-testid="date"], [data-testid="time"]'
      )
      .hide();
    $body.find('.timestamp, .date, .time').hide();
  });
});

// Prepare page for visual testing
Cypress.Commands.add('prepareForVisualTest', () => {
  cy.waitForAnimations();
  cy.hideDynamicContent();
});

declare global {
  namespace Cypress {
    interface Chainable {
      compareSnapshot(name: string, options?: any): Chainable<void>;
      takeVisualSnapshot(name: string, options?: any): Chainable<void>;
      compareVisualSnapshot(name: string, options?: any): Chainable<void>;
      waitForAnimations(): Chainable<void>;
      setVisualViewport(width?: number, height?: number): Chainable<void>;
      hideDynamicContent(): Chainable<void>;
      prepareForVisualTest(): Chainable<void>;
    }
  }
}

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // for uncaught exceptions in the application
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});
