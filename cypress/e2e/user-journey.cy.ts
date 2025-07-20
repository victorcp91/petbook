describe('Complete User Journey E2E Test', () => {
  beforeEach(() => {
    // Clear any existing data
    cy.clearTestData();
  });

  it('should complete full user journey from registration to appointment booking', () => {
    // Step 1: User Registration
    cy.visit('/auth/signup');

    // Fill personal information
    cy.get('[data-testid="full-name-input"]').type('Maria Santos');
    cy.get('[data-testid="email-input"]').type('maria.santos@petbook.com');
    cy.get('[data-testid="phone-input"]').type('(11) 99999-8888');
    cy.get('[data-testid="cpf-input"]').type('987.654.321-00');
    cy.get('[data-testid="password-input"]').type('SecurePassword123!');
    cy.get('[data-testid="confirm-password-input"]').type('SecurePassword123!');

    // Fill shop information
    cy.get('[data-testid="shop-name-input"]').type('Pet Shop Santos');
    cy.get('[data-testid="shop-address-input"]').type(
      'Rua das Palmeiras, 456 - São Paulo, SP'
    );
    cy.get('[data-testid="shop-phone-input"]').type('(11) 88888-7777');

    // Mock successful registration
    cy.intercept('POST', '/api/auth/signup', {
      statusCode: 200,
      body: {
        user: {
          id: 'new-user-id',
          email: 'maria.santos@petbook.com',
          role: 'owner',
        },
        session: {
          access_token: 'new-test-token',
          refresh_token: 'new-test-refresh-token',
        },
      },
    }).as('signupRequest');

    cy.get('[data-testid="signup-button"]').click();
    cy.wait('@signupRequest');

    // Should redirect to email confirmation
    cy.url().should('include', '/auth/confirm');
    cy.get('[data-testid="email-confirmation-message"]').should('be.visible');

    // Step 2: Email Confirmation (simulated)
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: {
        user: {
          id: 'new-user-id',
          email: 'maria.santos@petbook.com',
          role: 'owner',
          emailVerified: true,
        },
      },
    }).as('getUser');

    // Navigate to dashboard
    cy.visit('/dashboard');
    cy.wait('@getUser');

    // Step 3: Dashboard Overview
    cy.get('[data-testid="dashboard-header"]').should('be.visible');
    cy.get('[data-testid="welcome-message"]').should('contain', 'Maria Santos');

    // Mock dashboard stats
    cy.intercept('GET', '/api/dashboard/stats', {
      statusCode: 200,
      body: {
        totalPets: 0,
        totalAppointments: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
        recentAppointments: [],
      },
    }).as('getDashboardStats');

    cy.wait('@getDashboardStats');

    // Step 4: Add First Pet
    cy.get('[data-testid="add-pet-button"]').click();

    // Mock pet creation
    cy.intercept('POST', '/api/pets', {
      statusCode: 201,
      body: {
        id: 'pet-1',
        name: 'Luna',
        species: 'cat',
        breed: 'Persian',
        birthDate: '2021-03-20',
        weight: 4.2,
        color: 'Branco',
        notes: 'Gata muito tranquila',
      },
    }).as('createPet');

    cy.get('[data-testid="pet-name-input"]').type('Luna');
    cy.get('[data-testid="pet-species-select"]').click();
    cy.get('[data-testid="species-option-cat"]').click();
    cy.get('[data-testid="pet-breed-input"]').type('Persian');
    cy.get('[data-testid="pet-birth-date-input"]').type('2021-03-20');
    cy.get('[data-testid="pet-weight-input"]').type('4.2');
    cy.get('[data-testid="pet-color-input"]').type('Branco');
    cy.get('[data-testid="pet-notes-input"]').type('Gata muito tranquila');
    cy.get('[data-testid="save-pet-button"]').click();

    cy.wait('@createPet');

    // Verify pet was added
    cy.get('[data-testid="pet-card"]').should('have.length', 1);
    cy.get('[data-testid="pet-name"]').should('contain', 'Luna');

    // Step 5: Book First Appointment
    cy.get('[data-testid="appointments-link"]').click();
    cy.url().should('include', '/appointments');

    // Mock appointments list
    cy.intercept('GET', '/api/appointments', {
      statusCode: 200,
      body: [],
    }).as('getAppointments');

    cy.wait('@getAppointments');

    cy.get('[data-testid="add-appointment-button"]').click();

    // Mock appointment creation
    cy.intercept('POST', '/api/appointments', {
      statusCode: 201,
      body: {
        id: 'appointment-1',
        petName: 'Luna',
        serviceType: 'banho_tosa',
        appointmentDate: '2024-01-20T10:00:00Z',
        duration: 90,
        status: 'scheduled',
        notes: 'Primeira vez no pet shop',
      },
    }).as('createAppointment');

    // Fill appointment form
    cy.get('[data-testid="appointment-pet-select"]').click();
    cy.get('[data-testid="pet-option-luna"]').click();
    cy.get('[data-testid="appointment-service-select"]').click();
    cy.get('[data-testid="service-option-banho_tosa"]').click();
    cy.get('[data-testid="appointment-date-input"]').type('2024-01-20');
    cy.get('[data-testid="appointment-time-input"]').type('10:00');
    cy.get('[data-testid="appointment-duration-input"]').type('90');
    cy.get('[data-testid="appointment-notes-input"]').type(
      'Primeira vez no pet shop'
    );
    cy.get('[data-testid="save-appointment-button"]').click();

    cy.wait('@createAppointment');

    // Verify appointment was created
    cy.get('[data-testid="appointment-card"]').should('have.length', 1);
    cy.get('[data-testid="appointment-pet-name"]').should('contain', 'Luna');
    cy.get('[data-testid="appointment-service-type"]').should(
      'contain',
      'Banho & Tosa'
    );

    // Step 6: View Appointment Details
    cy.get('[data-testid="appointment-card"]').first().click();
    cy.get('[data-testid="appointment-details-modal"]').should('be.visible');
    cy.get('[data-testid="appointment-details-pet-name"]').should(
      'contain',
      'Luna'
    );
    cy.get('[data-testid="appointment-details-service"]').should(
      'contain',
      'Banho & Tosa'
    );
    cy.get('[data-testid="appointment-details-date"]').should(
      'contain',
      '20/01/2024'
    );
    cy.get('[data-testid="appointment-details-time"]').should(
      'contain',
      '10:00'
    );

    // Close modal
    cy.get('[data-testid="close-modal-button"]').click();
    cy.get('[data-testid="appointment-details-modal"]').should('not.exist');

    // Step 7: Navigate to Dashboard and Verify Stats
    cy.get('[data-testid="dashboard-link"]').click();
    cy.url().should('include', '/dashboard');

    // Mock updated dashboard stats
    cy.intercept('GET', '/api/dashboard/stats', {
      statusCode: 200,
      body: {
        totalPets: 1,
        totalAppointments: 1,
        totalRevenue: 0,
        monthlyGrowth: 0,
        recentAppointments: [
          {
            id: 'appointment-1',
            petName: 'Luna',
            serviceType: 'banho_tosa',
            date: '2024-01-20T10:00:00Z',
            status: 'scheduled',
          },
        ],
      },
    }).as('getUpdatedStats');

    cy.wait('@getUpdatedStats');

    // Verify updated stats
    cy.get('[data-testid="total-pets-card"]').should('contain', '1');
    cy.get('[data-testid="total-appointments-card"]').should('contain', '1');

    // Step 8: User Profile Management
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="profile-link"]').click();
    cy.url().should('include', '/profile');

    // Mock profile data
    cy.intercept('GET', '/api/users/profile', {
      statusCode: 200,
      body: {
        id: 'new-user-id',
        fullName: 'Maria Santos',
        email: 'maria.santos@petbook.com',
        phone: '(11) 99999-8888',
        shopName: 'Pet Shop Santos',
        shopAddress: 'Rua das Palmeiras, 456 - São Paulo, SP',
        shopPhone: '(11) 88888-7777',
      },
    }).as('getProfile');

    cy.wait('@getProfile');

    // Verify profile information
    cy.get('[data-testid="profile-full-name"]').should(
      'contain',
      'Maria Santos'
    );
    cy.get('[data-testid="profile-email"]').should(
      'contain',
      'maria.santos@petbook.com'
    );
    cy.get('[data-testid="profile-shop-name"]').should(
      'contain',
      'Pet Shop Santos'
    );

    // Step 9: Logout and Session Management
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="signout-button"]').click();

    // Mock logout
    cy.intercept('POST', '/api/auth/signout', {
      statusCode: 200,
      body: {
        message: 'Logout successful',
      },
    }).as('signoutRequest');

    cy.wait('@signoutRequest');

    // Should redirect to login page
    cy.url().should('include', '/auth/signin');

    // Step 10: Login Again
    cy.get('[data-testid="email-input"]').type('maria.santos@petbook.com');
    cy.get('[data-testid="password-input"]').type('SecurePassword123!');

    // Mock login
    cy.intercept('POST', '/api/auth/signin', {
      statusCode: 200,
      body: {
        user: {
          id: 'new-user-id',
          email: 'maria.santos@petbook.com',
          role: 'owner',
        },
        session: {
          access_token: 'new-test-token',
          refresh_token: 'new-test-refresh-token',
        },
      },
    }).as('signinRequest');

    cy.get('[data-testid="signin-button"]').click();
    cy.wait('@signinRequest');

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="dashboard-header"]').should('be.visible');

    // Verify data persistence
    cy.get('[data-testid="total-pets-card"]').should('contain', '1');
    cy.get('[data-testid="total-appointments-card"]').should('contain', '1');
  });

  it('should handle errors gracefully during user journey', () => {
    // Test network error during registration
    cy.visit('/auth/signup');

    cy.get('[data-testid="full-name-input"]').type('Test User');
    cy.get('[data-testid="email-input"]').type('test@petbook.com');
    cy.get('[data-testid="phone-input"]').type('(11) 99999-9999');
    cy.get('[data-testid="cpf-input"]').type('123.456.789-09');
    cy.get('[data-testid="password-input"]').type('SecurePassword123!');
    cy.get('[data-testid="confirm-password-input"]').type('SecurePassword123!');
    cy.get('[data-testid="shop-name-input"]').type('Test Shop');
    cy.get('[data-testid="shop-address-input"]').type('Test Address');
    cy.get('[data-testid="shop-phone-input"]').type('(11) 88888-8888');

    // Mock network error
    cy.intercept('POST', '/api/auth/signup', {
      forceNetworkError: true,
    }).as('signupNetworkError');

    cy.get('[data-testid="signup-button"]').click();
    cy.wait('@signupNetworkError');

    // Should show error message
    cy.get('[data-testid="error-message"]').should(
      'contain',
      'Erro de conexão'
    );
    cy.get('[data-testid="retry-button"]').should('be.visible');
  });

  it('should test responsive design on different screen sizes', () => {
    // Test mobile viewport
    cy.viewport(375, 667);
    cy.visit('/auth/signin');

    // Verify mobile navigation
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-menu"]').should('be.visible');

    // Test tablet viewport
    cy.viewport(768, 1024);
    cy.visit('/dashboard');

    // Verify tablet layout
    cy.get('[data-testid="dashboard-header"]').should('be.visible');
    cy.get('[data-testid="sidebar-navigation"]').should('be.visible');

    // Test desktop viewport
    cy.viewport(1280, 720);
    cy.visit('/pets');

    // Verify desktop layout
    cy.get('[data-testid="pets-grid"]').should('be.visible');
    cy.get('[data-testid="filters-sidebar"]').should('be.visible');
  });

  it('should test accessibility features', () => {
    cy.visit('/auth/signin');

    // Test keyboard navigation
    cy.get('[data-testid="email-input"]').focus();
    cy.focused().should('have.attr', 'data-testid', 'email-input');

    cy.get('[data-testid="email-input"]').type('test@petbook.com');
    cy.get('[data-testid="password-input"]').focus();
    cy.focused().should('have.attr', 'data-testid', 'password-input');

    // Test ARIA labels
    cy.get('[data-testid="email-input"]').should('have.attr', 'aria-label');
    cy.get('[data-testid="password-input"]').should('have.attr', 'aria-label');

    // Test screen reader support
    cy.get('[data-testid="signin-button"]').should('have.attr', 'aria-label');
    cy.get('[data-testid="error-message"]').should(
      'have.attr',
      'role',
      'alert'
    );
  });
});
