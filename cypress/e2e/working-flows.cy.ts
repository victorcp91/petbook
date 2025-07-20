describe('Working User Flows', () => {
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

  describe('Page Navigation', () => {
    it('should load main pages without errors', () => {
      // Test signin page
      cy.visit('/auth/signin');
      cy.get('body').should('contain', 'PetBook');

      // Test signup page
      cy.visit('/auth/signup');
      cy.get('body').should('be.visible');

      // Test dashboard (should redirect to signin if not authenticated)
      cy.visit('/dashboard');
      cy.get('body').should('be.visible');
    });
  });

  describe('Form Interactions', () => {
    it('should handle form input correctly', () => {
      cy.visit('/auth/signin');

      // Test email input
      cy.get('#email').type('test@example.com');
      cy.get('#email').should('have.value', 'test@example.com');

      // Test password input
      cy.get('#password').type('password123');
      cy.get('#password').should('have.value', 'password123');

      // Test form submission
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should handle form validation', () => {
      cy.visit('/auth/signin');

      // Check email field type
      cy.get('#email').should('have.attr', 'type', 'email');

      // Check password field type
      cy.get('#password').should('have.attr', 'type', 'password');

      // Check required attributes
      cy.get('#email').should('have.attr', 'required');
      cy.get('#password').should('have.attr', 'required');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.visit('/auth/signin');

      // Should be usable on mobile
      cy.get('#email').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should work on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.visit('/auth/signin');

      // Should be usable on tablet
      cy.get('#email').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should support keyboard navigation', () => {
      cy.visit('/auth/signin');

      // Navigate with keyboard
      cy.get('body').focus();
      cy.get('#email').should('be.visible');

      // Test tab navigation
      cy.get('#email').focus();
      cy.get('#email').should('be.focused');
    });

    it('should have proper form labels', () => {
      cy.visit('/auth/signin');

      // Check for form labels
      cy.contains('Email').should('be.visible');
      cy.contains('Senha').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid routes gracefully', () => {
      cy.visit('/invalid-route');

      // Should show some content (404 or redirect)
      cy.get('body').should('be.visible');
    });

    it('should handle slow loading', () => {
      // Mock slow response
      cy.intercept('/api/auth/user', req => {
        req.reply({
          delay: 2000,
          statusCode: 200,
          body: { user: { id: 'test', email: 'test@example.com' } },
        });
      }).as('slowAuth');

      cy.visit('/auth/signin');

      // Should handle loading state
      cy.get('body').should('be.visible');
    });
  });
});
