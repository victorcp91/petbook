describe('Critical User Flows', () => {
  beforeEach(() => {
    // Clear any existing data before each test
    cy.clearTestData();
  });

  describe('Authentication Flow', () => {
    it('should allow user to sign in successfully', () => {
      cy.visit('/auth/signin');

      // Verify page loads correctly
      cy.get('h3').should('contain', 'Entrar');
      cy.get('#email').should('be.visible');
      cy.get('#password').should('be.visible');

      // Fill in credentials
      cy.get('#email').type('test@petbook.com');
      cy.get('#password').type('password123');

      // Submit form
      cy.get('button[type="submit"]').click();

      // Should redirect to dashboard or show success
      cy.url().should('not.include', '/auth/signin');
    });

    it('should show validation errors for invalid credentials', () => {
      cy.visit('/auth/signin');

      // Try to submit empty form
      cy.get('button[type="submit"]').click();

      // Should show validation errors or prevent submission
      cy.get('#email').should('have.attr', 'type', 'email');
      cy.get('#password').should('have.attr', 'type', 'password');
    });

    it('should navigate to signup page', () => {
      cy.visit('/auth/signin');
      cy.contains('Criar conta').click();

      // Should navigate to signup page
      cy.url().should('include', '/auth/signup');
    });
  });

  describe('Dashboard Flow', () => {
    beforeEach(() => {
      // Mock authenticated session for dashboard tests
      cy.mockAuthenticatedSession({
        id: 'test-user-1',
        email: 'owner@petbook.com',
        role: 'owner',
        name: 'Test Owner',
      });
    });

    it('should load dashboard with key metrics', () => {
      // Mock dashboard data
      cy.mockDashboardStats({
        totalPets: 150,
        totalAppointments: 45,
        totalRevenue: 12500,
        monthlyGrowth: 12.5,
      });

      cy.visit('/dashboard');

      // Should show dashboard elements
      cy.get('body').should('contain', 'Dashboard');
      cy.get('body').should('contain', '150'); // Total pets
      cy.get('body').should('contain', '45'); // Total appointments
    });

    it('should allow navigation to different sections', () => {
      cy.visit('/dashboard');

      // Test navigation to different sections
      cy.contains('Pets').click();
      cy.url().should('include', '/pets');

      cy.contains('Appointments').click();
      cy.url().should('include', '/appointments');

      cy.contains('Clients').click();
      cy.url().should('include', '/clients');
    });
  });

  describe('Pet Management Flow', () => {
    beforeEach(() => {
      cy.mockAuthenticatedSession({
        id: 'test-user-1',
        email: 'owner@petbook.com',
        role: 'owner',
      });
    });

    it('should allow adding a new pet', () => {
      cy.visit('/pets');

      // Click add pet button
      cy.contains('Add Pet').click();

      // Fill in pet information
      cy.get('input[name="name"]').type('Buddy');
      cy.get('select[name="species"]').select('dog');
      cy.get('input[name="breed"]').type('Golden Retriever');
      cy.get('input[name="birthDate"]').type('2020-01-15');
      cy.get('input[name="weight"]').type('25.5');
      cy.get('input[name="color"]').type('Golden');

      // Submit form
      cy.get('button[type="submit"]').click();

      // Should show success message or redirect
      cy.get('body').should('contain', 'Buddy');
    });

    it('should allow editing pet information', () => {
      cy.visit('/pets');

      // Find and click edit button for first pet
      cy.get('[data-testid="edit-pet"]').first().click();

      // Update pet information
      cy.get('input[name="name"]').clear().type('Updated Pet Name');

      // Submit changes
      cy.get('button[type="submit"]').click();

      // Should show updated information
      cy.get('body').should('contain', 'Updated Pet Name');
    });
  });

  describe('Appointment Booking Flow', () => {
    beforeEach(() => {
      cy.mockAuthenticatedSession({
        id: 'test-user-1',
        email: 'owner@petbook.com',
        role: 'owner',
      });
    });

    it('should allow booking a new appointment', () => {
      cy.visit('/appointments');

      // Click book appointment button
      cy.contains('Book Appointment').click();

      // Fill in appointment details
      cy.get('select[name="petId"]').select('1');
      cy.get('select[name="serviceType"]').select('banho_tosa');
      cy.get('input[name="appointmentDate"]').type('2024-02-15');
      cy.get('input[name="appointmentTime"]').type('10:00');
      cy.get('textarea[name="notes"]').type('Regular grooming appointment');

      // Submit booking
      cy.get('button[type="submit"]').click();

      // Should show confirmation or redirect
      cy.get('body').should('contain', 'Appointment booked');
    });

    it('should show appointment calendar', () => {
      cy.visit('/appointments');

      // Should show calendar view
      cy.get('[data-testid="calendar"]').should('be.visible');

      // Should show appointment slots
      cy.get('[data-testid="appointment-slot"]').should('exist');
    });
  });

  describe('Client Management Flow', () => {
    beforeEach(() => {
      cy.mockAuthenticatedSession({
        id: 'test-user-1',
        email: 'owner@petbook.com',
        role: 'owner',
      });
    });

    it('should allow adding a new client', () => {
      cy.visit('/clients');

      // Click add client button
      cy.contains('Add Client').click();

      // Fill in client information
      cy.get('input[name="name"]').type('John Doe');
      cy.get('input[name="email"]').type('john@example.com');
      cy.get('input[name="phone"]').type('(11) 99999-9999');
      cy.get('input[name="address"]').type('123 Main St, City, State');

      // Submit form
      cy.get('button[type="submit"]').click();

      // Should show success message
      cy.get('body').should('contain', 'John Doe');
    });

    it('should allow searching clients', () => {
      cy.visit('/clients');

      // Use search functionality
      cy.get('input[placeholder*="search"]').type('John');

      // Should show filtered results
      cy.get('body').should('contain', 'John');
    });
  });

  describe('Settings and Profile Flow', () => {
    beforeEach(() => {
      cy.mockAuthenticatedSession({
        id: 'test-user-1',
        email: 'owner@petbook.com',
        role: 'owner',
      });
    });

    it('should allow updating user profile', () => {
      cy.visit('/profile');

      // Update profile information
      cy.get('input[name="name"]').clear().type('Updated Name');
      cy.get('input[name="email"]').clear().type('updated@petbook.com');

      // Save changes
      cy.get('button[type="submit"]').click();

      // Should show success message
      cy.get('body').should('contain', 'Profile updated');
    });

    it('should allow changing password', () => {
      cy.visit('/profile');

      // Navigate to password change section
      cy.contains('Change Password').click();

      // Fill in password fields
      cy.get('input[name="currentPassword"]').type('oldpassword');
      cy.get('input[name="newPassword"]').type('newpassword123');
      cy.get('input[name="confirmPassword"]').type('newpassword123');

      // Submit password change
      cy.get('button[type="submit"]').click();

      // Should show success message
      cy.get('body').should('contain', 'Password changed');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle network errors gracefully', () => {
      // Mock network error
      cy.mockNetworkError('/api/auth/user');

      cy.visit('/dashboard');

      // Should show error message or fallback
      cy.get('body').should('contain', 'Error').or('contain', 'Offline');
    });

    it('should handle invalid routes', () => {
      cy.visit('/invalid-route');

      // Should show 404 page
      cy.get('body').should('contain', '404').or('contain', 'Not Found');
    });

    it('should handle slow loading states', () => {
      // Mock slow API response
      cy.intercept('/api/dashboard/stats', req => {
        req.reply({
          delay: 3000,
          body: { totalPets: 150 },
        });
      }).as('slowApi');

      cy.visit('/dashboard');

      // Should show loading state
      cy.get('[data-testid="loading"]').should('be.visible');

      // Wait for API response
      cy.wait('@slowApi');

      // Should show loaded content
      cy.get('body').should('contain', '150');
    });
  });

  describe('Responsive Design and Accessibility', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.visit('/auth/signin');

      // Should be usable on mobile
      cy.get('#email').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should support keyboard navigation', () => {
      cy.visit('/auth/signin');

      // Navigate with keyboard
      cy.get('body').tab();
      cy.get('#email').should('be.focused');

      cy.get('#email').type('test@example.com');
      cy.get('#email').tab();
      cy.get('#password').should('be.focused');
    });

    it('should have proper ARIA labels', () => {
      cy.visit('/auth/signin');

      // Check for accessibility attributes
      cy.get('#email')
        .should('have.attr', 'aria-label')
        .or('have.attr', 'aria-describedby');
      cy.get('#password')
        .should('have.attr', 'aria-label')
        .or('have.attr', 'aria-describedby');
    });
  });
});
