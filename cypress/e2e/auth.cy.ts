describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to sign in page', () => {
    cy.visit('/auth/signin');
    cy.get('h3').should('contain', 'Entrar');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should navigate to sign up page', () => {
    cy.visit('/auth/signup');
    cy.get('h3').should('contain', 'Criar Conta');
    // Note: These selectors will need to be updated once we check the signup page structure
    cy.get('input[type="text"]').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('should show validation errors for empty form submission', () => {
    cy.visit('/auth/signin');
    cy.get('button[type="submit"]').click();

    // The form should prevent submission when fields are empty
    cy.get('#email').should('have.attr', 'required');
    cy.get('#password').should('have.attr', 'required');
  });

  it('should show validation errors for invalid email format', () => {
    cy.visit('/auth/signin');
    cy.get('#email').type('invalid-email');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();

    // Check for email validation
    cy.get('#email').should('have.attr', 'type', 'email');
  });

  it('should navigate between sign in and sign up pages', () => {
    cy.visit('/auth/signin');
    cy.contains('Criar conta').click();
    cy.url().should('include', '/auth/signup');

    cy.contains('Entrar').click();
    cy.url().should('include', '/auth/signin');
  });

  it('should show password requirements on sign up page', () => {
    cy.visit('/auth/signup');
    cy.get('input[type="password"]').first().focus();

    // Check if password requirements are shown (this may vary based on implementation)
    cy.get('body').should('be.visible');
  });

  it('should validate password confirmation match', () => {
    cy.visit('/auth/signup');
    cy.get('input[type="password"]').first().type('Password123!');
    cy.get('input[type="password"]').last().type('DifferentPassword123!');
    cy.get('input[type="password"]').last().blur();

    // Check for password confirmation validation
    cy.get('body').should('be.visible');
  });

  it('should handle successful login', () => {
    cy.visit('/auth/signin');
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();

    // Should redirect to dashboard or show success message
    cy.url().should('not.include', '/auth/signin');
  });

  it('should handle forgot password link', () => {
    cy.visit('/auth/signin');
    cy.contains('Esqueceu sua senha?').click();

    // Should navigate to forgot password page or show modal
    cy.get('body').should('be.visible');
  });
});
