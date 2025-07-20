describe('API Integration Tests', () => {
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

  describe('Pets API Integration', () => {
    it('should create, read, update, and delete pets', () => {
      // Mock pets list
      cy.intercept('GET', '/api/pets', {
        statusCode: 200,
        body: [
          {
            id: 'pet-1',
            name: 'Rex',
            species: 'dog',
            breed: 'Golden Retriever',
            birthDate: '2020-01-15',
            weight: 25.5,
            color: 'Dourado',
            notes: 'Pet muito dócil',
          },
        ],
      }).as('getPets');

      cy.visit('/pets');
      cy.wait('@getUser');
      cy.wait('@getPets');

      // Verify pets are displayed
      cy.get('[data-testid="pet-card"]').should('have.length', 1);
      cy.get('[data-testid="pet-name"]').should('contain', 'Rex');

      // Create new pet
      cy.intercept('POST', '/api/pets', {
        statusCode: 201,
        body: {
          id: 'pet-2',
          name: 'Luna',
          species: 'cat',
          breed: 'Persian',
          birthDate: '2021-03-20',
          weight: 4.2,
          color: 'Branco',
          notes: 'Gata tranquila',
        },
      }).as('createPet');

      cy.get('[data-testid="add-pet-button"]').click();
      cy.get('[data-testid="pet-name-input"]').type('Luna');
      cy.get('[data-testid="pet-species-select"]').click();
      cy.get('[data-testid="species-option-cat"]').click();
      cy.get('[data-testid="pet-breed-input"]').type('Persian');
      cy.get('[data-testid="pet-birth-date-input"]').type('2021-03-20');
      cy.get('[data-testid="pet-weight-input"]').type('4.2');
      cy.get('[data-testid="pet-color-input"]').type('Branco');
      cy.get('[data-testid="pet-notes-input"]').type('Gata tranquila');
      cy.get('[data-testid="save-pet-button"]').click();

      cy.wait('@createPet');

      // Verify new pet is added
      cy.get('[data-testid="pet-card"]').should('have.length', 2);
      cy.get('[data-testid="pet-name"]').should('contain', 'Luna');

      // Update pet
      cy.intercept('PUT', '/api/pets/pet-1', {
        statusCode: 200,
        body: {
          id: 'pet-1',
          name: 'Rex',
          species: 'dog',
          breed: 'Golden Retriever',
          birthDate: '2020-01-15',
          weight: 26.0,
          color: 'Dourado',
          notes: 'Pet muito dócil - ganhou peso',
        },
      }).as('updatePet');

      cy.get('[data-testid="edit-pet-button"]').first().click();
      cy.get('[data-testid="pet-weight-input"]').clear().type('26.0');
      cy.get('[data-testid="pet-notes-input"]')
        .clear()
        .type('Pet muito dócil - ganhou peso');
      cy.get('[data-testid="save-pet-button"]').click();

      cy.wait('@updatePet');

      // Verify pet is updated
      cy.get('[data-testid="pet-weight"]').first().should('contain', '26.0');

      // Delete pet
      cy.intercept('DELETE', '/api/pets/pet-2', {
        statusCode: 200,
        body: {
          message: 'Pet removido com sucesso',
        },
      }).as('deletePet');

      cy.get('[data-testid="delete-pet-button"]').last().click();
      cy.get('[data-testid="confirm-delete-button"]').click();

      cy.wait('@deletePet');

      // Verify pet is removed
      cy.get('[data-testid="pet-card"]').should('have.length', 1);
      cy.get('[data-testid="pet-name"]').should('not.contain', 'Luna');
    });

    it('should handle pet API errors gracefully', () => {
      // Mock API error
      cy.intercept('GET', '/api/pets', {
        statusCode: 500,
        body: {
          error: 'Internal server error',
        },
      }).as('getPetsError');

      cy.visit('/pets');
      cy.wait('@getUser');
      cy.wait('@getPetsError');

      // Should show error message
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Erro ao carregar pets'
      );
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });
  });

  describe('Appointments API Integration', () => {
    it('should manage appointments lifecycle', () => {
      // Mock appointments list
      cy.intercept('GET', '/api/appointments', {
        statusCode: 200,
        body: [
          {
            id: 'appointment-1',
            petName: 'Rex',
            serviceType: 'banho_tosa',
            appointmentDate: '2024-01-15T10:00:00Z',
            duration: 90,
            status: 'scheduled',
            notes: 'Primeira vez no pet shop',
          },
        ],
      }).as('getAppointments');

      cy.visit('/appointments');
      cy.wait('@getUser');
      cy.wait('@getAppointments');

      // Verify appointments are displayed
      cy.get('[data-testid="appointment-card"]').should('have.length', 1);
      cy.get('[data-testid="appointment-pet-name"]').should('contain', 'Rex');

      // Create new appointment
      cy.intercept('POST', '/api/appointments', {
        statusCode: 201,
        body: {
          id: 'appointment-2',
          petName: 'Luna',
          serviceType: 'banho',
          appointmentDate: '2024-01-16T14:00:00Z',
          duration: 60,
          status: 'scheduled',
          notes: 'Banho simples',
        },
      }).as('createAppointment');

      cy.get('[data-testid="add-appointment-button"]').click();
      cy.get('[data-testid="appointment-pet-select"]').click();
      cy.get('[data-testid="pet-option-luna"]').click();
      cy.get('[data-testid="appointment-service-select"]').click();
      cy.get('[data-testid="service-option-banho"]').click();
      cy.get('[data-testid="appointment-date-input"]').type('2024-01-16');
      cy.get('[data-testid="appointment-time-input"]').type('14:00');
      cy.get('[data-testid="appointment-duration-input"]').type('60');
      cy.get('[data-testid="appointment-notes-input"]').type('Banho simples');
      cy.get('[data-testid="save-appointment-button"]').click();

      cy.wait('@createAppointment');

      // Verify new appointment is added
      cy.get('[data-testid="appointment-card"]').should('have.length', 2);
      cy.get('[data-testid="appointment-pet-name"]').should('contain', 'Luna');

      // Update appointment status
      cy.intercept('PUT', '/api/appointments/appointment-1', {
        statusCode: 200,
        body: {
          id: 'appointment-1',
          petName: 'Rex',
          serviceType: 'banho_tosa',
          appointmentDate: '2024-01-15T10:00:00Z',
          duration: 90,
          status: 'completed',
          notes: 'Serviço realizado com sucesso',
        },
      }).as('updateAppointment');

      cy.get('[data-testid="appointment-status-select"]').first().click();
      cy.get('[data-testid="status-option-completed"]').click();

      cy.wait('@updateAppointment');

      // Verify appointment status is updated
      cy.get('[data-testid="appointment-status"]')
        .first()
        .should('contain', 'Concluído');
    });

    it('should handle appointment conflicts', () => {
      cy.intercept('GET', '/api/appointments', {
        statusCode: 200,
        body: [],
      }).as('getAppointments');

      cy.visit('/appointments');
      cy.wait('@getUser');
      cy.wait('@getAppointments');

      // Mock conflict error
      cy.intercept('POST', '/api/appointments', {
        statusCode: 409,
        body: {
          error: 'Horário já está ocupado',
        },
      }).as('createAppointmentConflict');

      cy.get('[data-testid="add-appointment-button"]').click();
      cy.get('[data-testid="appointment-pet-select"]').click();
      cy.get('[data-testid="pet-option-rex"]').click();
      cy.get('[data-testid="appointment-service-select"]').click();
      cy.get('[data-testid="service-option-banho_tosa"]').click();
      cy.get('[data-testid="appointment-date-input"]').type('2024-01-15');
      cy.get('[data-testid="appointment-time-input"]').type('10:00');
      cy.get('[data-testid="appointment-duration-input"]').type('90');
      cy.get('[data-testid="save-appointment-button"]').click();

      cy.wait('@createAppointmentConflict');

      // Should show conflict error
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Horário já está ocupado'
      );
    });
  });

  describe('Clients API Integration', () => {
    it('should manage client data', () => {
      // Mock clients list
      cy.intercept('GET', '/api/clients', {
        statusCode: 200,
        body: [
          {
            id: 'client-1',
            name: 'João Silva',
            email: 'joao.silva@email.com',
            phone: '(11) 99999-9999',
            address: 'Rua das Flores, 123',
            pets: [
              {
                id: 'pet-1',
                name: 'Rex',
                species: 'dog',
              },
            ],
          },
        ],
      }).as('getClients');

      cy.visit('/clients');
      cy.wait('@getUser');
      cy.wait('@getClients');

      // Verify clients are displayed
      cy.get('[data-testid="client-card"]').should('have.length', 1);
      cy.get('[data-testid="client-name"]').should('contain', 'João Silva');

      // Create new client
      cy.intercept('POST', '/api/clients', {
        statusCode: 201,
        body: {
          id: 'client-2',
          name: 'Maria Santos',
          email: 'maria.santos@email.com',
          phone: '(11) 88888-8888',
          address: 'Rua das Palmeiras, 456',
          pets: [],
        },
      }).as('createClient');

      cy.get('[data-testid="add-client-button"]').click();
      cy.get('[data-testid="client-name-input"]').type('Maria Santos');
      cy.get('[data-testid="client-email-input"]').type(
        'maria.santos@email.com'
      );
      cy.get('[data-testid="client-phone-input"]').type('(11) 88888-8888');
      cy.get('[data-testid="client-address-input"]').type(
        'Rua das Palmeiras, 456'
      );
      cy.get('[data-testid="save-client-button"]').click();

      cy.wait('@createClient');

      // Verify new client is added
      cy.get('[data-testid="client-card"]').should('have.length', 2);
      cy.get('[data-testid="client-name"]').should('contain', 'Maria Santos');
    });

    it('should handle client search and filtering', () => {
      cy.intercept('GET', '/api/clients', {
        statusCode: 200,
        body: [
          {
            id: 'client-1',
            name: 'João Silva',
            email: 'joao.silva@email.com',
            phone: '(11) 99999-9999',
          },
          {
            id: 'client-2',
            name: 'Maria Santos',
            email: 'maria.santos@email.com',
            phone: '(11) 88888-8888',
          },
        ],
      }).as('getClients');

      cy.visit('/clients');
      cy.wait('@getUser');
      cy.wait('@getClients');

      // Search for specific client
      cy.intercept('GET', '/api/clients?search=João', {
        statusCode: 200,
        body: [
          {
            id: 'client-1',
            name: 'João Silva',
            email: 'joao.silva@email.com',
            phone: '(11) 99999-9999',
          },
        ],
      }).as('searchClients');

      cy.get('[data-testid="client-search-input"]').type('João');
      cy.wait('@searchClients');

      // Should show only matching client
      cy.get('[data-testid="client-card"]').should('have.length', 1);
      cy.get('[data-testid="client-name"]').should('contain', 'João Silva');
    });
  });

  describe('Queue Management API Integration', () => {
    it('should manage grooming queue', () => {
      // Mock queue data
      cy.intercept('GET', '/api/queue', {
        statusCode: 200,
        body: [
          {
            id: 'queue-1',
            petName: 'Rex',
            ownerName: 'João Silva',
            serviceType: 'banho_tosa',
            status: 'waiting',
            estimatedTime: 30,
          },
        ],
      }).as('getQueue');

      cy.visit('/queue');
      cy.wait('@getUser');
      cy.wait('@getQueue');

      // Verify queue is displayed
      cy.get('[data-testid="queue-item"]').should('have.length', 1);
      cy.get('[data-testid="queue-pet-name"]').should('contain', 'Rex');

      // Start grooming session
      cy.intercept('PUT', '/api/queue/queue-1/start', {
        statusCode: 200,
        body: {
          id: 'queue-1',
          petName: 'Rex',
          ownerName: 'João Silva',
          serviceType: 'banho_tosa',
          status: 'in_progress',
          estimatedTime: 30,
          startTime: '2024-01-15T10:00:00Z',
        },
      }).as('startGrooming');

      cy.get('[data-testid="start-grooming-button"]').click();
      cy.wait('@startGrooming');

      // Verify status is updated
      cy.get('[data-testid="queue-status"]').should('contain', 'Em andamento');

      // Complete grooming session
      cy.intercept('PUT', '/api/queue/queue-1/complete', {
        statusCode: 200,
        body: {
          id: 'queue-1',
          petName: 'Rex',
          ownerName: 'João Silva',
          serviceType: 'banho_tosa',
          status: 'completed',
          estimatedTime: 30,
          startTime: '2024-01-15T10:00:00Z',
          endTime: '2024-01-15T10:30:00Z',
        },
      }).as('completeGrooming');

      cy.get('[data-testid="complete-grooming-button"]').click();
      cy.wait('@completeGrooming');

      // Verify completion
      cy.get('[data-testid="queue-status"]').should('contain', 'Concluído');
    });

    it('should handle queue priority and reordering', () => {
      cy.intercept('GET', '/api/queue', {
        statusCode: 200,
        body: [
          {
            id: 'queue-1',
            petName: 'Rex',
            ownerName: 'João Silva',
            serviceType: 'banho_tosa',
            status: 'waiting',
            priority: 1,
          },
          {
            id: 'queue-2',
            petName: 'Luna',
            ownerName: 'Maria Santos',
            serviceType: 'banho',
            status: 'waiting',
            priority: 2,
          },
        ],
      }).as('getQueue');

      cy.visit('/queue');
      cy.wait('@getUser');
      cy.wait('@getQueue');

      // Reorder queue items
      cy.intercept('PUT', '/api/queue/reorder', {
        statusCode: 200,
        body: {
          message: 'Queue reordered successfully',
        },
      }).as('reorderQueue');

      // Drag and drop to reorder (simulated)
      cy.get('[data-testid="queue-item"]').first().trigger('mousedown');
      cy.get('[data-testid="queue-item"]').last().trigger('mouseover');
      cy.get('[data-testid="queue-item"]').last().trigger('mouseup');

      cy.wait('@reorderQueue');

      // Verify reordering was applied
      cy.get('[data-testid="queue-item"]').first().should('contain', 'Luna');
    });
  });

  describe('Reports and Analytics API Integration', () => {
    it('should generate and export reports', () => {
      // Mock reports data
      cy.intercept('GET', '/api/reports/summary', {
        statusCode: 200,
        body: {
          totalRevenue: 12500,
          totalAppointments: 45,
          averageRating: 4.8,
          topServices: [
            { name: 'banho_tosa', count: 25 },
            { name: 'banho', count: 15 },
            { name: 'tosa', count: 5 },
          ],
        },
      }).as('getReports');

      cy.visit('/reports');
      cy.wait('@getUser');
      cy.wait('@getReports');

      // Verify reports are displayed
      cy.get('[data-testid="total-revenue"]').should('contain', 'R$ 12.500');
      cy.get('[data-testid="total-appointments"]').should('contain', '45');
      cy.get('[data-testid="average-rating"]').should('contain', '4.8');

      // Export report
      cy.intercept('POST', '/api/reports/export', {
        statusCode: 200,
        body: {
          downloadUrl: '/api/downloads/report-2024-01.pdf',
        },
      }).as('exportReport');

      cy.get('[data-testid="export-report-button"]').click();
      cy.wait('@exportReport');

      // Should show success message
      cy.get('[data-testid="success-message"]').should(
        'contain',
        'Relatório exportado com sucesso'
      );
    });

    it('should filter reports by date range', () => {
      cy.intercept('GET', '/api/reports/summary', {
        statusCode: 200,
        body: {
          totalRevenue: 12500,
          totalAppointments: 45,
          averageRating: 4.8,
        },
      }).as('getReports');

      cy.visit('/reports');
      cy.wait('@getUser');
      cy.wait('@getReports');

      // Mock filtered reports
      cy.intercept(
        'GET',
        '/api/reports/summary?startDate=2024-01-01&endDate=2024-01-31',
        {
          statusCode: 200,
          body: {
            totalRevenue: 8500,
            totalAppointments: 30,
            averageRating: 4.9,
          },
        }
      ).as('getFilteredReports');

      // Select date range
      cy.get('[data-testid="date-range-picker"]').click();
      cy.get('[data-testid="date-range-option-30d"]').click();

      cy.wait('@getFilteredReports');

      // Verify filtered data
      cy.get('[data-testid="total-revenue"]').should('contain', 'R$ 8.500');
      cy.get('[data-testid="total-appointments"]').should('contain', '30');
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle network errors and retry', () => {
      // Mock network error
      cy.intercept('GET', '/api/pets', {
        forceNetworkError: true,
      }).as('getPetsError');

      cy.visit('/pets');
      cy.wait('@getUser');
      cy.wait('@getPetsError');

      // Should show error message
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Erro de conexão'
      );
      cy.get('[data-testid="retry-button"]').should('be.visible');

      // Mock successful retry
      cy.intercept('GET', '/api/pets', {
        statusCode: 200,
        body: [],
      }).as('getPetsRetry');

      cy.get('[data-testid="retry-button"]').click();
      cy.wait('@getPetsRetry');

      // Should load successfully
      cy.get('[data-testid="pets-container"]').should('be.visible');
    });

    it('should handle authentication errors and redirect', () => {
      // Mock authentication error
      cy.intercept('GET', '/api/auth/user', {
        statusCode: 401,
        body: {
          error: 'Token expired',
        },
      }).as('getUserError');

      cy.visit('/dashboard');
      cy.wait('@getUserError');

      // Should redirect to login
      cy.url().should('include', '/auth/signin');
    });

    it('should handle rate limiting', () => {
      // Mock rate limit error
      cy.intercept('POST', '/api/pets', {
        statusCode: 429,
        body: {
          error: 'Too many requests',
          retryAfter: 60,
        },
      }).as('rateLimitError');

      cy.visit('/pets');
      cy.wait('@getUser');

      cy.get('[data-testid="add-pet-button"]').click();
      cy.get('[data-testid="pet-name-input"]').type('Test Pet');
      cy.get('[data-testid="save-pet-button"]').click();

      cy.wait('@rateLimitError');

      // Should show rate limit message
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Muitas requisições'
      );
      cy.get('[data-testid="retry-after"]').should('contain', '60 segundos');
    });
  });
});
