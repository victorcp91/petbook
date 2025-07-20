describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    // Mock authenticated session for all tests
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: {
        user: {
          id: 'test-user-id',
          email: 'joao.silva@petbook.com',
          role: 'owner',
        },
      },
    }).as('getUser');
  });

  describe('Dashboard Data Loading', () => {
    it('should load dashboard with KPI data', () => {
      // Mock dashboard stats
      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 200,
        body: {
          totalPets: 150,
          totalAppointments: 45,
          totalRevenue: 12500,
          monthlyGrowth: 12.5,
          recentAppointments: [
            {
              id: 'appointment-1',
              petName: 'Rex',
              serviceType: 'banho_tosa',
              date: '2024-01-15T10:00:00Z',
              status: 'scheduled',
            },
          ],
        },
      }).as('getDashboardStats');

      cy.visit('/dashboard');
      cy.wait('@getUser');
      cy.wait('@getDashboardStats');

      // Verify KPI cards are displayed
      cy.get('[data-testid="total-pets-card"]').should('contain', '150');
      cy.get('[data-testid="total-appointments-card"]').should('contain', '45');
      cy.get('[data-testid="total-revenue-card"]').should(
        'contain',
        'R$ 12.500'
      );
      cy.get('[data-testid="monthly-growth-card"]').should('contain', '12.5%');
    });

    it('should show loading states while fetching data', () => {
      // Mock delayed response
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
      cy.wait('@getUser');

      // Should show loading spinner
      cy.get('[data-testid="loading-spinner"]').should('be.visible');

      cy.wait('@getDashboardStatsDelayed');

      // Loading spinner should disappear
      cy.get('[data-testid="loading-spinner"]').should('not.exist');
    });

    it('should handle dashboard data fetch errors gracefully', () => {
      // Mock error response
      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 500,
        body: {
          error: 'Internal server error',
        },
      }).as('getDashboardStatsError');

      cy.visit('/dashboard');
      cy.wait('@getUser');
      cy.wait('@getDashboardStatsError');

      // Should show error message
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Erro ao carregar dados'
      );
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });
  });

  describe('Date Range Filtering', () => {
    it('should filter dashboard data by date range', () => {
      // Mock initial dashboard data
      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 200,
        body: {
          totalPets: 150,
          totalAppointments: 45,
          totalRevenue: 12500,
          monthlyGrowth: 12.5,
        },
      }).as('getDashboardStats');

      cy.visit('/dashboard');
      cy.wait('@getUser');
      cy.wait('@getDashboardStats');

      // Mock filtered data
      cy.intercept(
        'GET',
        '/api/dashboard/stats?startDate=2024-01-01&endDate=2024-01-31',
        {
          statusCode: 200,
          body: {
            totalPets: 120,
            totalAppointments: 30,
            totalRevenue: 8500,
            monthlyGrowth: 8.2,
          },
        }
      ).as('getFilteredStats');

      // Select date range
      cy.get('[data-testid="date-range-picker"]').click();
      cy.get('[data-testid="date-range-option-7d"]').click();

      cy.wait('@getFilteredStats');

      // Verify filtered data is displayed
      cy.get('[data-testid="total-appointments-card"]').should('contain', '30');
      cy.get('[data-testid="total-revenue-card"]').should(
        'contain',
        'R$ 8.500'
      );
    });

    it('should handle date range filter errors', () => {
      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 200,
        body: {
          totalPets: 150,
          totalAppointments: 45,
          totalRevenue: 12500,
          monthlyGrowth: 12.5,
        },
      }).as('getDashboardStats');

      cy.visit('/dashboard');
      cy.wait('@getUser');
      cy.wait('@getDashboardStats');

      // Mock filter error
      cy.intercept('GET', '/api/dashboard/stats?startDate=*&endDate=*', {
        statusCode: 400,
        body: {
          error: 'Invalid date range',
        },
      }).as('getFilteredStatsError');

      cy.get('[data-testid="date-range-picker"]').click();
      cy.get('[data-testid="date-range-option-30d"]').click();

      cy.wait('@getFilteredStatsError');

      // Should show error message
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Erro ao filtrar dados'
      );
    });
  });

  describe('Role-Based Dashboard Access', () => {
    it('should show owner-specific dashboard features', () => {
      // Mock owner user
      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: {
          user: {
            id: 'test-user-id',
            email: 'joao.silva@petbook.com',
            role: 'owner',
          },
        },
      }).as('getOwnerUser');

      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 200,
        body: {
          totalPets: 150,
          totalAppointments: 45,
          totalRevenue: 12500,
          monthlyGrowth: 12.5,
        },
      }).as('getDashboardStats');

      cy.visit('/dashboard');
      cy.wait('@getOwnerUser');
      cy.wait('@getDashboardStats');

      // Owner should see admin features
      cy.get('[data-testid="admin-menu-items"]').should('be.visible');
      cy.get('[data-testid="user-management-link"]').should('be.visible');
      cy.get('[data-testid="reports-link"]').should('be.visible');
    });

    it('should show groomer-specific dashboard features', () => {
      // Mock groomer user
      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: {
          user: {
            id: 'test-groomer-id',
            email: 'maria.groomer@petbook.com',
            role: 'groomer',
          },
        },
      }).as('getGroomerUser');

      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 200,
        body: {
          totalPets: 150,
          totalAppointments: 45,
          totalRevenue: 12500,
          monthlyGrowth: 12.5,
        },
      }).as('getDashboardStats');

      cy.visit('/dashboard');
      cy.wait('@getGroomerUser');
      cy.wait('@getDashboardStats');

      // Groomer should see grooming-specific features
      cy.get('[data-testid="groomer-menu-items"]').should('be.visible');
      cy.get('[data-testid="queue-link"]').should('be.visible');
      cy.get('[data-testid="appointments-link"]').should('be.visible');

      // Groomer should not see admin features
      cy.get('[data-testid="admin-menu-items"]').should('not.exist');
    });

    it('should show attendant-specific dashboard features', () => {
      // Mock attendant user
      cy.intercept('GET', '/api/auth/user', {
        statusCode: 200,
        body: {
          user: {
            id: 'test-attendant-id',
            email: 'carlos.attendant@petbook.com',
            role: 'attendant',
          },
        },
      }).as('getAttendantUser');

      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 200,
        body: {
          totalPets: 150,
          totalAppointments: 45,
          totalRevenue: 12500,
          monthlyGrowth: 12.5,
        },
      }).as('getDashboardStats');

      cy.visit('/dashboard');
      cy.wait('@getAttendantUser');
      cy.wait('@getDashboardStats');

      // Attendant should see appointment management features
      cy.get('[data-testid="attendant-menu-items"]').should('be.visible');
      cy.get('[data-testid="appointments-link"]').should('be.visible');
      cy.get('[data-testid="clients-link"]').should('be.visible');

      // Attendant should not see admin features
      cy.get('[data-testid="admin-menu-items"]').should('not.exist');
    });
  });

  describe('Navigation and Menu Integration', () => {
    it('should navigate between dashboard sections', () => {
      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 200,
        body: {
          totalPets: 150,
          totalAppointments: 45,
          totalRevenue: 12500,
          monthlyGrowth: 12.5,
        },
      }).as('getDashboardStats');

      cy.visit('/dashboard');
      cy.wait('@getUser');
      cy.wait('@getDashboardStats');

      // Navigate to appointments
      cy.get('[data-testid="appointments-link"]').click();
      cy.url().should('include', '/appointments');

      // Navigate to clients
      cy.get('[data-testid="clients-link"]').click();
      cy.url().should('include', '/clients');

      // Navigate to pets
      cy.get('[data-testid="pets-link"]').click();
      cy.url().should('include', '/pets');

      // Navigate back to dashboard
      cy.get('[data-testid="dashboard-link"]').click();
      cy.url().should('include', '/dashboard');
    });

    it('should handle user menu interactions', () => {
      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 200,
        body: {
          totalPets: 150,
          totalAppointments: 45,
          totalRevenue: 12500,
          monthlyGrowth: 12.5,
        },
      }).as('getDashboardStats');

      cy.visit('/dashboard');
      cy.wait('@getUser');
      cy.wait('@getDashboardStats');

      // Open user menu
      cy.get('[data-testid="user-menu"]').click();

      // Should show menu options
      cy.get('[data-testid="profile-link"]').should('be.visible');
      cy.get('[data-testid="settings-link"]').should('be.visible');
      cy.get('[data-testid="signout-button"]').should('be.visible');

      // Navigate to profile
      cy.get('[data-testid="profile-link"]').click();
      cy.url().should('include', '/profile');
    });
  });

  describe('Real-time Updates', () => {
    it('should update dashboard data in real-time', () => {
      // Mock initial dashboard data
      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 200,
        body: {
          totalPets: 150,
          totalAppointments: 45,
          totalRevenue: 12500,
          monthlyGrowth: 12.5,
        },
      }).as('getDashboardStats');

      cy.visit('/dashboard');
      cy.wait('@getUser');
      cy.wait('@getDashboardStats');

      // Mock updated data
      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 200,
        body: {
          totalPets: 151,
          totalAppointments: 46,
          totalRevenue: 12600,
          monthlyGrowth: 12.8,
        },
      }).as('getUpdatedStats');

      // Simulate real-time update
      cy.get('[data-testid="refresh-button"]').click();
      cy.wait('@getUpdatedStats');

      // Verify updated data
      cy.get('[data-testid="total-pets-card"]').should('contain', '151');
      cy.get('[data-testid="total-appointments-card"]').should('contain', '46');
    });

    it('should handle real-time update errors', () => {
      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 200,
        body: {
          totalPets: 150,
          totalAppointments: 45,
          totalRevenue: 12500,
          monthlyGrowth: 12.5,
        },
      }).as('getDashboardStats');

      cy.visit('/dashboard');
      cy.wait('@getUser');
      cy.wait('@getDashboardStats');

      // Mock update error
      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 503,
        body: {
          error: 'Service temporarily unavailable',
        },
      }).as('getUpdateError');

      cy.get('[data-testid="refresh-button"]').click();
      cy.wait('@getUpdateError');

      // Should show error message
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Erro ao atualizar dados'
      );
    });
  });

  describe('Data Export Integration', () => {
    it('should export dashboard data to PDF', () => {
      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 200,
        body: {
          totalPets: 150,
          totalAppointments: 45,
          totalRevenue: 12500,
          monthlyGrowth: 12.5,
        },
      }).as('getDashboardStats');

      cy.visit('/dashboard');
      cy.wait('@getUser');
      cy.wait('@getDashboardStats');

      // Mock PDF export
      cy.intercept('POST', '/api/dashboard/export', {
        statusCode: 200,
        body: {
          downloadUrl: '/api/downloads/dashboard-report.pdf',
        },
      }).as('exportDashboard');

      cy.get('[data-testid="export-button"]').click();
      cy.wait('@exportDashboard');

      // Should show success message
      cy.get('[data-testid="success-message"]').should(
        'contain',
        'Relatório exportado com sucesso'
      );
    });

    it('should handle export errors', () => {
      cy.intercept('GET', '/api/dashboard/stats', {
        statusCode: 200,
        body: {
          totalPets: 150,
          totalAppointments: 45,
          totalRevenue: 12500,
          monthlyGrowth: 12.5,
        },
      }).as('getDashboardStats');

      cy.visit('/dashboard');
      cy.wait('@getUser');
      cy.wait('@getDashboardStats');

      // Mock export error
      cy.intercept('POST', '/api/dashboard/export', {
        statusCode: 500,
        body: {
          error: 'Failed to generate report',
        },
      }).as('exportError');

      cy.get('[data-testid="export-button"]').click();
      cy.wait('@exportError');

      // Should show error message
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Erro ao exportar relatório'
      );
    });
  });
});
