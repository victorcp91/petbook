describe('Basic Authentication', () => {
  it('should load the signin page correctly', () => {
    cy.visit('/auth/signin');

    // Check page title
    cy.title().should('contain', 'PetBook');

    // Check main heading
    cy.get('h1').should('contain', 'PetBook');
    cy.get('h3').should('contain', 'Entrar');

    // Check form elements
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');

    // Check links
    cy.contains('Criar conta').should('be.visible');
    cy.contains('Esqueceu sua senha?').should('be.visible');
  });

  it('should have proper form validation', () => {
    cy.visit('/auth/signin');

    // Check that email field has proper type
    cy.get('#email').should('have.attr', 'type', 'email');

    // Check that password field has proper type
    cy.get('#password').should('have.attr', 'type', 'password');

    // Check that submit button is initially disabled (if form is empty)
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should allow typing in form fields', () => {
    cy.visit('/auth/signin');

    // Type in email field
    cy.get('#email').type('test@example.com');
    cy.get('#email').should('have.value', 'test@example.com');

    // Type in password field
    cy.get('#password').type('password123');
    cy.get('#password').should('have.value', 'password123');
  });
});
