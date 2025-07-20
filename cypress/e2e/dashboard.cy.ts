describe('Dashboard', () => {
  beforeEach(() => {
    // Mock authentication - in a real scenario, you'd use test data
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
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
      },
    }).as('getDashboardStats');
  });

  it('should load dashboard with authentication', () => {
    cy.visit('/dashboard');
    cy.wait('@getUser');
    cy.wait('@getDashboardStats');

    // Should show dashboard content
    cy.get('[data-testid="dashboard-header"]').should('be.visible');
    cy.get('[data-testid="stats-cards"]').should('be.visible');
    cy.get('[data-testid="navigation-menu"]').should('be.visible');
  });

  it('should display KPI cards with correct data', () => {
    cy.visit('/dashboard');
    cy.wait('@getDashboardStats');

    cy.get('[data-testid="total-pets-card"]').should('contain', '150');
    cy.get('[data-testid="total-appointments-card"]').should('contain', '45');
    cy.get('[data-testid="total-revenue-card"]').should('contain', 'R$ 12.500');
    cy.get('[data-testid="monthly-growth-card"]').should('contain', '12.5%');
  });

  it('should show loading states while fetching data', () => {
    cy.intercept('GET', '/api/dashboard/stats', {
      delay: 1000,
      statusCode: 200,
      body: {
        totalPets: 150,
        totalAppointments: 45,
        totalRevenue: 12500,
        monthlyGrowth: 12.5,
      },
    }).as('getDashboardStatsDelayed');

    cy.visit('/dashboard');
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    cy.wait('@getDashboardStatsDelayed');
    cy.get('[data-testid="loading-spinner"]').should('not.exist');
  });

  it('should handle dashboard data fetch errors gracefully', () => {
    cy.intercept('GET', '/api/dashboard/stats', {
      statusCode: 500,
      body: { error: 'Internal server error' },
    }).as('getDashboardStatsError');

    cy.visit('/dashboard');
    cy.wait('@getDashboardStatsError');

    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="retry-button"]').should('be.visible');
  });

  it('should allow date range filtering', () => {
    cy.visit('/dashboard');
    cy.wait('@getDashboardStats');

    cy.get('[data-testid="date-range-picker"]').click();
    cy.get('[data-testid="date-range-option-7d"]').click();

    // Should trigger new data fetch with date filter
    cy.intercept('GET', '/api/dashboard/stats?startDate=*&endDate=*', {
      statusCode: 200,
      body: {
        totalPets: 120,
        totalAppointments: 30,
        totalRevenue: 8500,
        monthlyGrowth: 8.2,
      },
    }).as('getFilteredStats');

    cy.wait('@getFilteredStats');
  });

  it('should show different navigation based on user role', () => {
    // Test for owner role
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: {
        user: {
          id: 'test-user-id',
          email: 'owner@example.com',
          role: 'owner',
        },
      },
    }).as('getOwnerUser');

    cy.visit('/dashboard');
    cy.wait('@getOwnerUser');

    cy.get('[data-testid="owner-menu-items"]').should('be.visible');
    cy.get('[data-testid="admin-menu-items"]').should('not.exist');
  });

  it('should allow user to sign out', () => {
    cy.visit('/dashboard');
    cy.wait('@getUser');

    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="signout-button"]').click();

    // Should redirect to sign in page
    cy.url().should('include', '/auth/signin');
  });
});
