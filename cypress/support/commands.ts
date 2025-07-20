/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Import factories and mocks
import { factories } from './factories';
import { mocks } from './mocks';

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// Custom commands for PetBook testing

/**
 * Login command for testing authenticated flows
 */
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/signin');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
});

/**
 * Logout command for testing session management
 */
Cypress.Commands.add('logout', () => {
  // For now, we'll just visit the signin page to simulate logout
  // This will need to be updated once we have a proper logout flow
  cy.visit('/auth/signin');
});

/**
 * Wait for page to load completely
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('[data-testid="loading-spinner"]').should('not.exist');
  cy.get('body').should('not.contain', 'Loading...');
});

/**
 * Clear test data from localStorage and cookies
 */
Cypress.Commands.add('clearTestData', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.clearAllSessionStorage();
});

/**
 * Mock authenticated session for testing
 */
Cypress.Commands.add(
  'mockAuthenticatedSession',
  (userData: Record<string, any> = {}) => {
    const user = factories.createUser(userData);
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: { user },
    }).as('getUser');
  }
);

/**
 * Mock unauthenticated session for testing
 */
Cypress.Commands.add('mockUnauthenticatedSession', () => {
  cy.intercept('GET', '/api/auth/user', {
    statusCode: 401,
    body: { error: 'Not authenticated' },
  }).as('getUser');
});

/**
 * Create test pet data using factories
 */
Cypress.Commands.add('createTestPet', (petData = {}) => {
  const pet = factories.createPet(petData);
  cy.intercept('POST', '/api/pets', {
    statusCode: 201,
    body: pet,
  }).as('createPet');
  return cy.wrap(pet);
});

/**
 * Create test appointment data using factories
 */
Cypress.Commands.add('createTestAppointment', (appointmentData = {}) => {
  const appointment = factories.createAppointment(appointmentData);
  cy.intercept('POST', '/api/appointments', {
    statusCode: 201,
    body: appointment,
  }).as('createAppointment');
  return cy.wrap(appointment);
});

/**
 * Mock dashboard stats using factories
 */
Cypress.Commands.add('mockDashboardStats', (stats = {}) => {
  const dashboardStats = factories.createDashboardStats(stats);
  cy.intercept('GET', '/api/dashboard/stats', {
    statusCode: 200,
    body: dashboardStats,
  }).as('getDashboardStats');
  return cy.wrap(dashboardStats);
});

/**
 * Mock API error for testing error handling
 */
Cypress.Commands.add(
  'mockApiError',
  (
    endpoint: string,
    statusCode = 500,
    errorMessage = 'Internal server error'
  ) => {
    cy.intercept(endpoint, {
      statusCode,
      body: { error: errorMessage },
    }).as('apiError');
  }
);

/**
 * Mock network error for testing offline scenarios
 */
Cypress.Commands.add('mockNetworkError', (endpoint: string) => {
  cy.intercept(endpoint, {
    forceNetworkError: true,
  }).as('networkError');
});

/**
 * Mock rate limiting for testing throttling scenarios
 */
Cypress.Commands.add('mockRateLimit', (endpoint: string, retryAfter = 60) => {
  cy.intercept(endpoint, {
    statusCode: 429,
    body: {
      error: 'Rate limit exceeded',
      retryAfter,
    },
  }).as('rateLimit');
});

/**
 * Wait for API request and verify status
 */
Cypress.Commands.add(
  'waitForApiRequest',
  (alias: string, expectedStatus = 200) => {
    cy.wait(alias).its('response.statusCode').should('eq', expectedStatus);
  }
);

/**
 * Verify API request data
 */
Cypress.Commands.add('verifyApiRequest', (alias: string, expectedData: any) => {
  cy.wait(alias).its('response.body').should('deep.include', expectedData);
});

/**
 * Mock file upload response
 */
Cypress.Commands.add(
  'mockFileUpload',
  (endpoint: string, fileName = 'test-file.jpg') => {
    const uploadResponse = mocks.files.uploadImage(fileName);
    cy.intercept('POST', endpoint, uploadResponse).as('fileUpload');
  }
);

/**
 * Mock PDF export response
 */
Cypress.Commands.add('mockPdfExport', (endpoint: string) => {
  cy.intercept('GET', endpoint, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="report.pdf"',
    },
    body: 'mock-pdf-content',
  }).as('pdfExport');
});

/**
 * Create test data collection using factories
 */
Cypress.Commands.add('createTestDataCollection', (type: string, count = 5) => {
  let collection;
  switch (type) {
    case 'users':
      collection = factories.createUserCollection(count);
      break;
    case 'pets':
      collection = factories.createPetCollection(count);
      break;
    case 'clients':
      collection = factories.createClientCollection(count);
      break;
    case 'appointments':
      collection = factories.createAppointmentCollection(count);
      break;
    case 'services':
      collection = factories.createServiceCollection(count);
      break;
    default:
      throw new Error(`Unknown test data type: ${type}`);
  }
  return cy.wrap(collection);
});

/**
 * Mock paginated API response
 */
Cypress.Commands.add(
  'mockPaginatedResponse',
  (endpoint: string, data: any[], page = 1, limit = 10) => {
    const response = {
      statusCode: 200,
      body: {
        data,
        pagination: {
          page,
          limit,
          total: data.length,
          totalPages: Math.ceil(data.length / limit),
        },
      },
    };
    cy.intercept('GET', endpoint, response).as('paginatedRequest');
  }
);

/**
 * Mock authentication flow
 */
Cypress.Commands.add('mockAuthFlow', (userData = {}) => {
  const loginResponse = mocks.auth.login(userData);
  const userResponse = mocks.users.getCurrentUser(userData);

  cy.intercept('POST', '/api/auth/login', loginResponse).as('login');
  cy.intercept('GET', '/api/auth/user', userResponse).as('getUser');
  cy.intercept('POST', '/api/auth/logout', mocks.auth.logout()).as('logout');
});

/**
 * Mock pet management API
 */
Cypress.Commands.add('mockPetAPI', (pets = []) => {
  const petsData = pets.length > 0 ? pets : factories.createPetCollection(5);

  cy.intercept('GET', '/api/pets', mocks.pets.getPets(petsData.length)).as(
    'getPets'
  );
  cy.intercept('POST', '/api/pets', mocks.pets.createPet()).as('createPet');
  cy.intercept('PUT', '/api/pets/*', mocks.pets.updatePet()).as('updatePet');
  cy.intercept('DELETE', '/api/pets/*', mocks.pets.deletePet()).as('deletePet');
});

/**
 * Mock client management API
 */
Cypress.Commands.add('mockClientAPI', (clients = []) => {
  const clientsData =
    clients.length > 0 ? clients : factories.createClientCollection(10);

  cy.intercept(
    'GET',
    '/api/clients',
    mocks.clients.getClients(clientsData.length)
  ).as('getClients');
  cy.intercept('POST', '/api/clients', mocks.clients.createClient()).as(
    'createClient'
  );
  cy.intercept('PUT', '/api/clients/*', mocks.clients.updateClient()).as(
    'updateClient'
  );
  cy.intercept('DELETE', '/api/clients/*', mocks.clients.deleteClient()).as(
    'deleteClient'
  );
});

/**
 * Mock appointment management API
 */
Cypress.Commands.add('mockAppointmentAPI', (appointments = []) => {
  const appointmentsData =
    appointments.length > 0
      ? appointments
      : factories.createAppointmentCollection(8);

  cy.intercept(
    'GET',
    '/api/appointments',
    mocks.appointments.getAppointments(appointmentsData.length)
  ).as('getAppointments');
  cy.intercept(
    'POST',
    '/api/appointments',
    mocks.appointments.createAppointment()
  ).as('createAppointment');
  cy.intercept(
    'PUT',
    '/api/appointments/*',
    mocks.appointments.updateAppointment()
  ).as('updateAppointment');
  cy.intercept(
    'DELETE',
    '/api/appointments/*',
    mocks.appointments.deleteAppointment()
  ).as('deleteAppointment');
});

/**
 * Mock dashboard API
 */
Cypress.Commands.add('mockDashboardAPI', (stats = {}) => {
  cy.intercept(
    'GET',
    '/api/dashboard/stats',
    mocks.dashboard.getStats(stats)
  ).as('getDashboardStats');
  cy.intercept(
    'GET',
    '/api/dashboard/activity',
    mocks.dashboard.getRecentActivity()
  ).as('getRecentActivity');
  cy.intercept(
    'GET',
    '/api/dashboard/revenue',
    mocks.dashboard.getRevenueChart()
  ).as('getRevenueChart');
});

/**
 * Mock error scenarios
 */
Cypress.Commands.add('mockErrorScenarios', () => {
  cy.intercept('GET', '/api/error/not-found', mocks.errors.notFound()).as(
    'notFound'
  );
  cy.intercept(
    'GET',
    '/api/error/unauthorized',
    mocks.errors.unauthorized()
  ).as('unauthorized');
  cy.intercept('GET', '/api/error/forbidden', mocks.errors.forbidden()).as(
    'forbidden'
  );
  cy.intercept(
    'GET',
    '/api/error/validation',
    mocks.errors.validationError()
  ).as('validationError');
  cy.intercept('GET', '/api/error/server', mocks.errors.serverError()).as(
    'serverError'
  );
  cy.intercept('GET', '/api/error/network', mocks.errors.networkError()).as(
    'networkError'
  );
  cy.intercept('GET', '/api/error/timeout', mocks.errors.timeout()).as(
    'timeout'
  );
});

/**
 * Mock service management API
 */
Cypress.Commands.add('mockServiceAPI', (services = []) => {
  const servicesData =
    services.length > 0 ? services : factories.createServiceCollection(8);

  cy.intercept(
    'GET',
    '/api/services',
    mocks.services.getServices(servicesData.length)
  ).as('getServices');
  cy.intercept('POST', '/api/services', mocks.services.createService()).as(
    'createService'
  );
  cy.intercept('PUT', '/api/services/*', mocks.services.updateService()).as(
    'updateService'
  );
  cy.intercept('DELETE', '/api/services/*', mocks.services.deleteService()).as(
    'deleteService'
  );
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      waitForPageLoad(): Chainable<void>;
      clearTestData(): Chainable<void>;
      mockAuthenticatedSession(userData?: any): Chainable<void>;
      mockUnauthenticatedSession(): Chainable<void>;
      createTestPet(petData?: any): Chainable<any>;
      createTestAppointment(appointmentData?: any): Chainable<any>;
      mockDashboardStats(stats?: any): Chainable<any>;
      mockApiError(
        endpoint: string,
        statusCode?: number,
        errorMessage?: string
      ): Chainable<void>;
      mockNetworkError(endpoint: string): Chainable<void>;
      mockRateLimit(endpoint: string, retryAfter?: number): Chainable<void>;
      waitForApiRequest(
        alias: string,
        expectedStatus?: number
      ): Chainable<void>;
      verifyApiRequest(alias: string, expectedData: any): Chainable<void>;
      mockFileUpload(endpoint: string, fileName?: string): Chainable<void>;
      mockPdfExport(endpoint: string): Chainable<void>;
      createTestDataCollection(type: string, count?: number): Chainable<any>;
      mockPaginatedResponse(
        endpoint: string,
        data: any[],
        page?: number,
        limit?: number
      ): Chainable<void>;
      mockAuthFlow(userData?: any): Chainable<void>;
      mockPetAPI(pets?: any[]): Chainable<void>;
      mockClientAPI(clients?: any[]): Chainable<void>;
      mockAppointmentAPI(appointments?: any[]): Chainable<void>;
      mockDashboardAPI(stats?: any): Chainable<void>;
      mockErrorScenarios(): Chainable<void>;
      mockServiceAPI(services?: any[]): Chainable<void>;
    }
  }
}
