// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your component test files.
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

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global configuration for component tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // for uncaught exceptions in the application
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});

// Extend the AUTWindow interface to include cypressRouter
declare global {
  interface Window {
    cypressRouter?: any;
  }
}

// Extend Cypress namespace for component testing
declare global {
  namespace Cypress {
    interface Chainable {
      mount(component: React.ReactElement): Chainable<void>;
      mockRouter(): Chainable<void>;
    }
  }
}

// Mock Next.js router for component tests
Cypress.Commands.add('mockRouter', () => {
  cy.window().then(win => {
    win.cypressRouter = {
      push: cy.stub().as('routerPush'),
      replace: cy.stub().as('routerReplace'),
      back: cy.stub().as('routerBack'),
      forward: cy.stub().as('routerForward'),
      refresh: cy.stub().as('routerRefresh'),
      prefetch: cy.stub().as('routerPrefetch'),
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      events: {
        on: cy.stub(),
        off: cy.stub(),
        emit: cy.stub(),
      },
      isFallback: false,
    };
  });
});
