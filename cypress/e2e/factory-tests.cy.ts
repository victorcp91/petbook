describe('Factory and Mock Tests', () => {
  beforeEach(() => {
    cy.clearTestData();
  });

  describe('Test Data Factories', () => {
    it('should create user data with factories', () => {
      // Create a single user
      const user = cy.createTestDataCollection('users', 1);
      user.should('have.length', 1);
    });

    it('should create pet data with factories', () => {
      // Create multiple pets
      const pets = cy.createTestDataCollection('pets', 3);
      pets.should('have.length', 3);
    });

    it('should create client data with factories', () => {
      // Create clients
      const clients = cy.createTestDataCollection('clients', 2);
      clients.should('have.length', 2);
    });

    it('should create appointment data with factories', () => {
      // Create appointments
      const appointments = cy.createTestDataCollection('appointments', 4);
      appointments.should('have.length', 4);
    });
  });

  describe('API Mocking', () => {
    it('should mock authentication flow', () => {
      cy.mockAuthFlow({
        name: 'Test Owner',
        email: 'owner@petbook.com',
        role: 'owner',
      });

      cy.visit('/auth/signin');
      cy.get('#email').type('owner@petbook.com');
      cy.get('#password').type('password123');
      cy.get('button[type="submit"]').click();

      // Should trigger login request
      cy.wait('@login');
      cy.wait('@getUser');
    });

    it('should mock pet management API', () => {
      cy.mockPetAPI();

      cy.visit('/pets');

      // Should trigger pets request
      cy.wait('@getPets');
    });

    it('should mock client management API', () => {
      cy.mockClientAPI();

      cy.visit('/clients');

      // Should trigger clients request
      cy.wait('@getClients');
    });

    it('should mock appointment management API', () => {
      cy.mockAppointmentAPI();

      cy.visit('/appointments');

      // Should trigger appointments request
      cy.wait('@getAppointments');
    });

    it('should mock dashboard API', () => {
      cy.mockDashboardAPI({
        totalPets: 150,
        totalAppointments: 45,
        totalRevenue: 12500,
      });

      cy.visit('/dashboard');

      // Should trigger dashboard requests
      cy.wait('@getDashboardStats');
      cy.wait('@getRecentActivity');
      cy.wait('@getRevenueChart');
    });
  });

  describe('Error Handling Mocks', () => {
    it('should handle network errors', () => {
      cy.mockNetworkError('/api/dashboard/stats');

      cy.visit('/dashboard');

      // Should show error state
      cy.get('body').should('be.visible');
    });

    it('should handle server errors', () => {
      cy.mockApiError('/api/pets', 500, 'Internal server error');

      cy.visit('/pets');

      // Should show error message
      cy.get('body').should('be.visible');
    });

    it('should handle validation errors', () => {
      cy.mockApiError('/api/pets', 422, 'Validation failed');

      cy.visit('/pets');
      cy.get('body').should('be.visible');
    });

    it('should handle unauthorized access', () => {
      cy.mockApiError('/api/dashboard/stats', 401, 'Unauthorized');

      cy.visit('/dashboard');

      // Should redirect to login or show unauthorized message
      cy.get('body').should('be.visible');
    });
  });

  describe('File Upload Mocks', () => {
    it('should mock image upload', () => {
      cy.mockFileUpload('/api/upload/image', 'test-pet.jpg');

      cy.visit('/pets');
      cy.get('body').should('be.visible');
    });

    it('should mock PDF export', () => {
      cy.mockPdfExport('/api/reports/export');

      cy.visit('/reports');
      cy.get('body').should('be.visible');
    });
  });

  describe('Pagination Mocks', () => {
    it('should mock paginated responses', () => {
      cy.mockPaginatedResponse('/api/pets', [], 1, 10);

      cy.visit('/pets');

      // Should trigger paginated request
      cy.wait('@paginatedRequest');
    });
  });

  describe('Rate Limiting Mocks', () => {
    it('should handle rate limiting', () => {
      cy.mockRateLimit('/api/pets', 60);

      cy.visit('/pets');

      // Should show rate limit message
      cy.get('body').should('be.visible');
    });
  });

  describe('Custom Test Data', () => {
    it('should create custom test data', () => {
      // Create custom pet with specific data
      const customPet = cy.createTestPet({
        name: 'Custom Pet',
        species: 'dog',
        breed: 'Golden Retriever',
        weight: 30,
      });

      customPet.should('be.an', 'object');
    });

    it('should create custom appointment data', () => {
      // Create custom appointment with specific data
      const customAppointment = cy.createTestAppointment({
        serviceType: 'banho_tosa',
        status: 'scheduled',
        price: 100,
      });

      customAppointment.should('be.an', 'object');
    });
  });
});
