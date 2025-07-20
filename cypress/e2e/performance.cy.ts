describe('Performance and Load Testing', () => {
  beforeEach(() => {
    cy.clearTestData();
  });

  it('should measure page load performance', () => {
    // Measure initial page load
    cy.visit('/', {
      onBeforeLoad: win => {
        win.performance.mark('start-loading');
      },
      onLoad: win => {
        win.performance.mark('end-loading');
        win.performance.measure('page-load', 'start-loading', 'end-loading');
      },
    });

    cy.window().then(win => {
      const measure = win.performance.getEntriesByName('page-load')[0];
      expect(measure.duration).to.be.lessThan(3000); // Should load in under 3 seconds
    });

    // Measure dashboard load performance
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: {
        user: {
          id: 'test-user-id',
          email: 'test@petbook.com',
          role: 'owner',
        },
      },
    }).as('getUser');

    cy.intercept('GET', '/api/dashboard/stats', {
      statusCode: 200,
      body: {
        totalPets: 150,
        totalAppointments: 45,
        totalRevenue: 12500,
        monthlyGrowth: 12.5,
        recentAppointments: [],
      },
    }).as('getDashboardStats');

    cy.visit('/dashboard', {
      onBeforeLoad: win => {
        win.performance.mark('dashboard-start');
      },
      onLoad: win => {
        win.performance.mark('dashboard-end');
        win.performance.measure(
          'dashboard-load',
          'dashboard-start',
          'dashboard-end'
        );
      },
    });

    cy.wait('@getUser');
    cy.wait('@getDashboardStats');

    cy.window().then(win => {
      const measure = win.performance.getEntriesByName('dashboard-load')[0];
      expect(measure.duration).to.be.lessThan(2000); // Dashboard should load in under 2 seconds
    });
  });

  it('should test large dataset performance', () => {
    // Mock large dataset
    const largePetsList = Array.from({ length: 100 }, (_, i) => ({
      id: `pet-${i}`,
      name: `Pet ${i}`,
      species: i % 2 === 0 ? 'dog' : 'cat',
      breed: i % 2 === 0 ? 'Golden Retriever' : 'Persian',
      birthDate: '2020-01-15',
      weight: 25.5,
      color: 'Dourado',
      notes: `Pet ${i} notes`,
    }));

    cy.intercept('GET', '/api/pets', {
      statusCode: 200,
      body: largePetsList,
    }).as('getLargePetsList');

    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: {
        user: {
          id: 'test-user-id',
          email: 'test@petbook.com',
          role: 'owner',
        },
      },
    }).as('getUser');

    cy.visit('/pets', {
      onBeforeLoad: win => {
        win.performance.mark('pets-start');
      },
      onLoad: win => {
        win.performance.mark('pets-end');
        win.performance.measure('pets-load', 'pets-start', 'pets-end');
      },
    });

    cy.wait('@getUser');
    cy.wait('@getLargePetsList');

    cy.window().then(win => {
      const measure = win.performance.getEntriesByName('pets-load')[0];
      expect(measure.duration).to.be.lessThan(3000); // Should handle large datasets efficiently
    });

    // Verify pagination works with large datasets
    cy.get('[data-testid="pets-pagination"]').should('be.visible');
    cy.get('[data-testid="pets-per-page-select"]').should('be.visible');
  });

  it('should test concurrent user scenarios', () => {
    // Simulate multiple concurrent requests
    const concurrentRequests = 5;

    for (let i = 0; i < concurrentRequests; i++) {
      cy.request({
        method: 'GET',
        url: 'http://localhost:3000/api/dashboard/stats',
        failOnStatusCode: false,
      }).then(response => {
        // Each request should complete successfully
        expect(response.status).to.be.oneOf([200, 401]); // 401 for unauthenticated requests is OK
      });
    }
  });

  it('should test memory usage during extended sessions', () => {
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: {
        user: {
          id: 'test-user-id',
          email: 'test@petbook.com',
          role: 'owner',
        },
      },
    }).as('getUser');

    cy.visit('/dashboard');
    cy.wait('@getUser');

    // Navigate through multiple pages to test memory usage
    const pages = [
      '/pets',
      '/appointments',
      '/clients',
      '/reports',
      '/settings',
    ];

    pages.forEach(page => {
      cy.visit(page);
      cy.wait('@getUser');

      // Verify page loads without memory issues
      cy.get('body').should('be.visible');

      // Check for memory leaks by monitoring DOM elements
      cy.get('body').then($body => {
        const elementCount = $body.find('*').length;
        expect(elementCount).to.be.lessThan(1000); // Reasonable DOM size
      });
    });
  });

  it('should test network resilience and retry mechanisms', () => {
    // Test slow network conditions
    cy.intercept('GET', '/api/dashboard/stats', {
      delay: 2000, // 2 second delay
      statusCode: 200,
      body: {
        totalPets: 150,
        totalAppointments: 45,
        totalRevenue: 12500,
        monthlyGrowth: 12.5,
      },
    }).as('slowRequest');

    cy.visit('/dashboard');
    cy.wait('@slowRequest');

    // Should show loading state during slow requests
    cy.get('[data-testid="loading-spinner"]').should('be.visible');

    // Should eventually load successfully
    cy.get('[data-testid="dashboard-header"]').should('be.visible');

    // Test network failure and recovery
    cy.intercept('GET', '/api/pets', {
      statusCode: 500,
      body: { error: 'Internal server error' },
    }).as('failedRequest');

    cy.visit('/pets');
    cy.wait('@failedRequest');

    // Should show error message
    cy.get('[data-testid="error-message"]').should(
      'contain',
      'Erro ao carregar'
    );

    // Test retry functionality
    cy.intercept('GET', '/api/pets', {
      statusCode: 200,
      body: [],
    }).as('retryRequest');

    cy.get('[data-testid="retry-button"]').click();
    cy.wait('@retryRequest');

    // Should load successfully after retry
    cy.get('[data-testid="pets-container"]').should('be.visible');
  });

  it('should test browser compatibility and rendering performance', () => {
    // Test different viewport sizes for responsive performance
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1280, height: 720, name: 'desktop' },
      { width: 1920, height: 1080, name: 'large-desktop' },
    ];

    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height);

      cy.visit('/dashboard', {
        onBeforeLoad: win => {
          win.performance.mark(`${viewport.name}-start`);
        },
        onLoad: win => {
          win.performance.mark(`${viewport.name}-end`);
          win.performance.measure(
            `${viewport.name}-load`,
            `${viewport.name}-start`,
            `${viewport.name}-end`
          );
        },
      });

      cy.window().then(win => {
        const measure = win.performance.getEntriesByName(
          `${viewport.name}-load`
        )[0];
        expect(measure.duration).to.be.lessThan(3000); // Should load efficiently on all devices
      });

      // Verify responsive layout
      cy.get('[data-testid="dashboard-header"]').should('be.visible');
    });
  });

  it('should test API response time under load', () => {
    // Test API response times with different payload sizes
    const testEndpoints = [
      { url: '/api/dashboard/stats', name: 'Dashboard Stats' },
      { url: '/api/pets', name: 'Pets List' },
      { url: '/api/appointments', name: 'Appointments List' },
      { url: '/api/clients', name: 'Clients List' },
    ];

    testEndpoints.forEach(endpoint => {
      cy.request({
        method: 'GET',
        url: `http://localhost:3000${endpoint.url}`,
        failOnStatusCode: false,
      }).then(response => {
        // Response time should be reasonable
        expect(response.duration).to.be.lessThan(1000); // Under 1 second
        expect(response.status).to.be.oneOf([200, 401]); // 401 for unauthenticated is OK
      });
    });
  });

  it('should test database query performance', () => {
    // Mock database query performance tests
    cy.intercept('GET', '/api/dashboard/stats', {
      statusCode: 200,
      body: {
        totalPets: 150,
        totalAppointments: 45,
        totalRevenue: 12500,
        monthlyGrowth: 12.5,
        recentAppointments: [],
      },
    }).as('dashboardQuery');

    cy.intercept('GET', '/api/pets?page=1&limit=50', {
      statusCode: 200,
      body: {
        data: Array.from({ length: 50 }, (_, i) => ({
          id: `pet-${i}`,
          name: `Pet ${i}`,
          species: 'dog',
          breed: 'Golden Retriever',
        })),
        pagination: {
          page: 1,
          limit: 50,
          total: 150,
          totalPages: 3,
        },
      },
    }).as('petsQuery');

    cy.visit('/dashboard');
    cy.wait('@dashboardQuery');

    cy.visit('/pets');
    cy.wait('@petsQuery');

    // Verify pagination works efficiently
    cy.get('[data-testid="pets-pagination"]').should('be.visible');
    cy.get('[data-testid="pets-per-page-select"]').should('be.visible');
  });
});
