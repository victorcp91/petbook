describe('Visual Regression Tests', () => {
  beforeEach(() => {
    cy.setVisualViewport(1280, 720);
    cy.mockAuthFlow();
  });

  describe('Authentication Pages', () => {
    it('should match signin page visual baseline', () => {
      cy.visit('/auth/signin');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('auth-signin-page');
    });

    it('should match signup page visual baseline', () => {
      cy.visit('/auth/signup');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('auth-signup-page');
    });

    it('should match forgot password page visual baseline', () => {
      cy.visit('/auth/reset-password');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('auth-forgot-password-page');
    });

    it('should match login form validation state', () => {
      cy.visit('/auth/signin');
      cy.get('#email').type('invalid-email');
      cy.get('#password').type('123');
      cy.get('button[type="submit"]').click();
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('auth-signin-validation-errors');
    });
  });

  describe('Dashboard Pages', () => {
    beforeEach(() => {
      cy.mockDashboardAPI({
        totalPets: 150,
        totalClients: 75,
        totalAppointments: 45,
        totalRevenue: 12500,
      });
    });

    it('should match owner dashboard visual baseline', () => {
      cy.visit('/dashboard');
      cy.wait('@getDashboardStats');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('dashboard-owner');
    });

    it('should match admin dashboard visual baseline', () => {
      cy.mockAuthFlow({ role: 'admin' });
      cy.visit('/admin/dashboard');
      cy.wait('@getDashboardStats');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('dashboard-admin');
    });

    it('should match employee dashboard visual baseline', () => {
      cy.mockAuthFlow({ role: 'employee' });
      cy.visit('/employee/dashboard');
      cy.wait('@getDashboardStats');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('dashboard-employee');
    });
  });

  describe('Pet Management Pages', () => {
    beforeEach(() => {
      cy.mockPetAPI();
    });

    it('should match pets list page visual baseline', () => {
      cy.visit('/pets');
      cy.wait('@getPets');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('pets-list-page');
    });

    it('should match add pet form visual baseline', () => {
      cy.visit('/pets');
      cy.contains('Add Pet').click();
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('pets-add-form');
    });

    it('should match pet details page visual baseline', () => {
      cy.visit('/pets/1');
      cy.wait('@getPet');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('pets-details-page');
    });

    it('should match edit pet form visual baseline', () => {
      cy.visit('/pets/1/edit');
      cy.wait('@getPet');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('pets-edit-form');
    });
  });

  describe('Client Management Pages', () => {
    beforeEach(() => {
      cy.mockClientAPI();
    });

    it('should match clients list page visual baseline', () => {
      cy.visit('/clients');
      cy.wait('@getClients');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('clients-list-page');
    });

    it('should match add client form visual baseline', () => {
      cy.visit('/clients');
      cy.contains('Add Client').click();
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('clients-add-form');
    });

    it('should match client details page visual baseline', () => {
      cy.visit('/clients/1');
      cy.wait('@getClient');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('clients-details-page');
    });

    it('should match edit client form visual baseline', () => {
      cy.visit('/clients/1/edit');
      cy.wait('@getClient');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('clients-edit-form');
    });
  });

  describe('Appointment Management Pages', () => {
    beforeEach(() => {
      cy.mockAppointmentAPI();
    });

    it('should match appointments list page visual baseline', () => {
      cy.visit('/appointments');
      cy.wait('@getAppointments');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('appointments-list-page');
    });

    it('should match book appointment form visual baseline', () => {
      cy.visit('/appointments/book');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('appointments-book-form');
    });

    it('should match appointment details page visual baseline', () => {
      cy.visit('/appointments/1');
      cy.wait('@getAppointment');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('appointments-details-page');
    });

    it('should match edit appointment form visual baseline', () => {
      cy.visit('/appointments/1/edit');
      cy.wait('@getAppointment');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('appointments-edit-form');
    });
  });

  describe('Service Management Pages', () => {
    beforeEach(() => {
      cy.mockServiceAPI();
    });

    it('should match services list page visual baseline', () => {
      cy.visit('/services');
      cy.wait('@getServices');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('services-list-page');
    });

    it('should match add service form visual baseline', () => {
      cy.visit('/services');
      cy.contains('Add Service').click();
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('services-add-form');
    });

    it('should match service details page visual baseline', () => {
      cy.visit('/services/1');
      cy.wait('@getService');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('services-details-page');
    });
  });

  describe('Responsive Design Tests', () => {
    it('should match mobile viewport visual baseline', () => {
      cy.setVisualViewport(375, 667); // iPhone SE
      cy.visit('/dashboard');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('dashboard-mobile-viewport');
    });

    it('should match tablet viewport visual baseline', () => {
      cy.setVisualViewport(768, 1024); // iPad
      cy.visit('/dashboard');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('dashboard-tablet-viewport');
    });

    it('should match large desktop viewport visual baseline', () => {
      cy.setVisualViewport(1920, 1080); // Full HD
      cy.visit('/dashboard');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('dashboard-large-desktop-viewport');
    });
  });

  describe('Component-Level Visual Tests', () => {
    it('should match navigation component visual baseline', () => {
      cy.visit('/dashboard');
      cy.get('nav').should('be.visible');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('navigation-component');
    });

    it('should match card component visual baseline', () => {
      cy.visit('/dashboard');
      cy.get('[data-testid="stats-card"]').first().should('be.visible');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('stats-card-component');
    });

    it('should match button component visual baseline', () => {
      cy.visit('/dashboard');
      cy.get('button').first().should('be.visible');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('button-component');
    });

    it('should match form component visual baseline', () => {
      cy.visit('/auth/signin');
      cy.get('form').should('be.visible');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('form-component');
    });
  });

  describe('Error State Visual Tests', () => {
    it('should match 404 error page visual baseline', () => {
      cy.visit('/non-existent-page');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('error-404-page');
    });

    it('should match network error state visual baseline', () => {
      cy.mockNetworkError('/api/dashboard/stats');
      cy.visit('/dashboard');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('network-error-state');
    });

    it('should match loading state visual baseline', () => {
      cy.intercept('/api/dashboard/stats', req => {
        req.reply({ delay: 2000 });
      });
      cy.visit('/dashboard');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('loading-state');
    });
  });

  describe('Modal and Overlay Visual Tests', () => {
    it('should match modal overlay visual baseline', () => {
      cy.visit('/pets');
      cy.contains('Add Pet').click();
      cy.get('[role="dialog"]').should('be.visible');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('modal-overlay');
    });

    it('should match dropdown menu visual baseline', () => {
      cy.visit('/dashboard');
      cy.get('[data-testid="user-menu"]').click();
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('dropdown-menu');
    });

    it('should match tooltip visual baseline', () => {
      cy.visit('/dashboard');
      cy.get('[data-testid="tooltip-trigger"]').trigger('mouseover');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('tooltip');
    });
  });

  describe('Data Table Visual Tests', () => {
    it('should match empty table state visual baseline', () => {
      cy.mockPaginatedResponse('/api/pets', [], 1, 10);
      cy.visit('/pets');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('empty-table-state');
    });

    it('should match paginated table visual baseline', () => {
      cy.mockPaginatedResponse('/api/pets', [], 1, 10);
      cy.visit('/pets');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('paginated-table');
    });

    it('should match table with filters visual baseline', () => {
      cy.visit('/pets');
      cy.get('[data-testid="filter-button"]').click();
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('table-with-filters');
    });
  });

  describe('Form Validation Visual Tests', () => {
    it('should match form validation errors visual baseline', () => {
      cy.visit('/pets');
      cy.contains('Add Pet').click();
      cy.get('button[type="submit"]').click();
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('form-validation-errors');
    });

    it('should match form success state visual baseline', () => {
      cy.visit('/pets');
      cy.contains('Add Pet').click();
      cy.get('input[name="name"]').type('Test Pet');
      cy.get('select[name="species"]').select('dog');
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('form-success-state');
    });
  });

  describe('Accessibility Visual Tests', () => {
    it('should match focus state visual baseline', () => {
      cy.visit('/auth/signin');
      cy.get('#email').focus();
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('focus-state');
    });

    it('should match keyboard navigation visual baseline', () => {
      cy.visit('/dashboard');
      cy.get('body').focus();
      cy.prepareForVisualTest();
      cy.takeVisualSnapshot('keyboard-navigation');
    });
  });
});
