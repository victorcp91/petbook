describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    // Clear any existing session
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('User Registration Flow', () => {
    it('should complete full user registration with shop information', () => {
      cy.visit('/auth/signup');

      // Fill in personal information
      cy.get('[data-testid="full-name-input"]').type('João Silva');
      cy.get('[data-testid="email-input"]').type('joao.silva@petbook.com');
      cy.get('[data-testid="phone-input"]').type('(11) 99999-9999');
      cy.get('[data-testid="cpf-input"]').type('123.456.789-09');
      cy.get('[data-testid="password-input"]').type('SecurePassword123!');
      cy.get('[data-testid="confirm-password-input"]').type(
        'SecurePassword123!'
      );

      // Fill in shop information
      cy.get('[data-testid="shop-name-input"]').type('Pet Shop Silva');
      cy.get('[data-testid="shop-address-input"]').type(
        'Rua das Flores, 123 - São Paulo, SP'
      );
      cy.get('[data-testid="shop-phone-input"]').type('(11) 88888-8888');

      // Mock successful registration
      cy.intercept('POST', '/api/auth/signup', {
        statusCode: 200,
        body: {
          user: {
            id: 'test-user-id',
            email: 'joao.silva@petbook.com',
            role: 'owner',
          },
          session: {
            access_token: 'test-token',
            refresh_token: 'test-refresh-token',
          },
        },
      }).as('signupRequest');

      cy.get('[data-testid="signup-button"]').click();

      cy.wait('@signupRequest');

      // Should redirect to email confirmation page
      cy.url().should('include', '/auth/confirm');
      cy.get('[data-testid="email-confirmation-message"]').should('be.visible');
    });

    it('should validate form fields and show appropriate errors', () => {
      cy.visit('/auth/signup');

      // Try to submit empty form
      cy.get('[data-testid="signup-button"]').click();

      // Should show validation errors
      cy.get('[data-testid="full-name-error"]').should(
        'contain',
        'Nome é obrigatório'
      );
      cy.get('[data-testid="email-error"]').should(
        'contain',
        'Email é obrigatório'
      );
      cy.get('[data-testid="password-error"]').should(
        'contain',
        'Senha é obrigatória'
      );

      // Test invalid email format
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="email-error"]').should('contain', 'Email inválido');

      // Test password strength requirements
      cy.get('[data-testid="password-input"]').type('weak');
      cy.get('[data-testid="password-error"]').should(
        'contain',
        'Senha deve ter pelo menos 8 caracteres'
      );

      // Test password confirmation mismatch
      cy.get('[data-testid="password-input"]')
        .clear()
        .type('StrongPassword123!');
      cy.get('[data-testid="confirm-password-input"]').type(
        'DifferentPassword123!'
      );
      cy.get('[data-testid="confirm-password-input"]').blur();
      cy.get('[data-testid="confirm-password-error"]').should(
        'contain',
        'Senhas não coincidem'
      );
    });

    it('should handle registration errors gracefully', () => {
      cy.visit('/auth/signup');

      // Fill form with existing email
      cy.get('[data-testid="full-name-input"]').type('João Silva');
      cy.get('[data-testid="email-input"]').type('existing@petbook.com');
      cy.get('[data-testid="phone-input"]').type('(11) 99999-9999');
      cy.get('[data-testid="cpf-input"]').type('123.456.789-09');
      cy.get('[data-testid="password-input"]').type('SecurePassword123!');
      cy.get('[data-testid="confirm-password-input"]').type(
        'SecurePassword123!'
      );
      cy.get('[data-testid="shop-name-input"]').type('Pet Shop Silva');
      cy.get('[data-testid="shop-address-input"]').type('Rua das Flores, 123');
      cy.get('[data-testid="shop-phone-input"]').type('(11) 88888-8888');

      // Mock registration error
      cy.intercept('POST', '/api/auth/signup', {
        statusCode: 400,
        body: {
          error: 'Email já está em uso',
        },
      }).as('signupError');

      cy.get('[data-testid="signup-button"]').click();

      cy.wait('@signupError');

      // Should show error message
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Email já está em uso'
      );
    });
  });

  describe('User Login Flow', () => {
    it('should successfully authenticate user and redirect to dashboard', () => {
      cy.visit('/auth/signin');

      // Fill login form
      cy.get('[data-testid="email-input"]').type('joao.silva@petbook.com');
      cy.get('[data-testid="password-input"]').type('SecurePassword123!');

      // Mock successful login
      cy.intercept('POST', '/api/auth/signin', {
        statusCode: 200,
        body: {
          user: {
            id: 'test-user-id',
            email: 'joao.silva@petbook.com',
            role: 'owner',
          },
          session: {
            access_token: 'test-token',
            refresh_token: 'test-refresh-token',
          },
        },
      }).as('signinRequest');

      cy.get('[data-testid="signin-button"]').click();

      cy.wait('@signinRequest');

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="dashboard-header"]').should('be.visible');
    });

    it('should handle invalid credentials and show error message', () => {
      cy.visit('/auth/signin');

      cy.get('[data-testid="email-input"]').type('wrong@petbook.com');
      cy.get('[data-testid="password-input"]').type('WrongPassword123!');

      // Mock login error
      cy.intercept('POST', '/api/auth/signin', {
        statusCode: 401,
        body: {
          error: 'Credenciais inválidas',
        },
      }).as('signinError');

      cy.get('[data-testid="signin-button"]').click();

      cy.wait('@signinError');

      // Should show error message
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Credenciais inválidas'
      );
      cy.url().should('include', '/auth/signin');
    });

    it('should validate login form fields', () => {
      cy.visit('/auth/signin');

      // Try to submit empty form
      cy.get('[data-testid="signin-button"]').click();

      // Should show validation errors
      cy.get('[data-testid="email-error"]').should(
        'contain',
        'Email é obrigatório'
      );
      cy.get('[data-testid="password-error"]').should(
        'contain',
        'Senha é obrigatória'
      );

      // Test invalid email format
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="email-error"]').should('contain', 'Email inválido');
    });
  });

  describe('Password Reset Flow', () => {
    it('should initiate password reset process', () => {
      cy.visit('/auth/reset-password');

      cy.get('[data-testid="email-input"]').type('joao.silva@petbook.com');

      // Mock password reset request
      cy.intercept('POST', '/api/auth/reset-password', {
        statusCode: 200,
        body: {
          message: 'Email de recuperação enviado',
        },
      }).as('resetPasswordRequest');

      cy.get('[data-testid="reset-password-button"]').click();

      cy.wait('@resetPasswordRequest');

      // Should show success message
      cy.get('[data-testid="success-message"]').should(
        'contain',
        'Email de recuperação enviado'
      );
    });

    it('should handle password reset with non-existent email', () => {
      cy.visit('/auth/reset-password');

      cy.get('[data-testid="email-input"]').type('nonexistent@petbook.com');

      // Mock error response
      cy.intercept('POST', '/api/auth/reset-password', {
        statusCode: 404,
        body: {
          error: 'Email não encontrado',
        },
      }).as('resetPasswordError');

      cy.get('[data-testid="reset-password-button"]').click();

      cy.wait('@resetPasswordError');

      // Should show error message
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Email não encontrado'
      );
    });
  });

  describe('Password Update Flow', () => {
    it('should update password with valid token', () => {
      // Mock valid token in URL
      cy.visit('/auth/update-password?token=valid-token');

      cy.get('[data-testid="new-password-input"]').type(
        'NewSecurePassword123!'
      );
      cy.get('[data-testid="confirm-password-input"]').type(
        'NewSecurePassword123!'
      );

      // Mock password update request
      cy.intercept('POST', '/api/auth/update-password', {
        statusCode: 200,
        body: {
          message: 'Senha atualizada com sucesso',
        },
      }).as('updatePasswordRequest');

      cy.get('[data-testid="update-password-button"]').click();

      cy.wait('@updatePasswordRequest');

      // Should redirect to sign in page
      cy.url().should('include', '/auth/signin');
      cy.get('[data-testid="success-message"]').should(
        'contain',
        'Senha atualizada com sucesso'
      );
    });

    it('should handle invalid or expired token', () => {
      cy.visit('/auth/update-password?token=invalid-token');

      // Mock error response
      cy.intercept('POST', '/api/auth/update-password', {
        statusCode: 400,
        body: {
          error: 'Token inválido ou expirado',
        },
      }).as('updatePasswordError');

      cy.get('[data-testid="new-password-input"]').type(
        'NewSecurePassword123!'
      );
      cy.get('[data-testid="confirm-password-input"]').type(
        'NewSecurePassword123!'
      );
      cy.get('[data-testid="update-password-button"]').click();

      cy.wait('@updatePasswordError');

      // Should show error message
      cy.get('[data-testid="error-message"]').should(
        'contain',
        'Token inválido ou expirado'
      );
    });
  });

  describe('Session Management', () => {
    it('should maintain session across page navigation', () => {
      // Mock authenticated session
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

      cy.visit('/dashboard');
      cy.wait('@getUser');

      // Navigate to different pages
      cy.get('[data-testid="navigation-menu"]').click();
      cy.get('[data-testid="profile-link"]').click();
      cy.url().should('include', '/profile');

      // Session should still be valid
      cy.get('[data-testid="user-menu"]').should('be.visible');
    });

    it('should handle session expiration and redirect to login', () => {
      // Mock expired session
      cy.intercept('GET', '/api/auth/user', {
        statusCode: 401,
        body: {
          error: 'Session expired',
        },
      }).as('getUserExpired');

      cy.visit('/dashboard');
      cy.wait('@getUserExpired');

      // Should redirect to login page
      cy.url().should('include', '/auth/signin');
    });

    it('should allow user to logout and clear session', () => {
      // Mock authenticated session
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

      cy.visit('/dashboard');
      cy.wait('@getUser');

      // Mock logout request
      cy.intercept('POST', '/api/auth/signout', {
        statusCode: 200,
        body: {
          message: 'Logout successful',
        },
      }).as('signoutRequest');

      // Perform logout
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="signout-button"]').click();

      cy.wait('@signoutRequest');

      // Should redirect to login page
      cy.url().should('include', '/auth/signin');
    });
  });

  describe('Protected Route Access', () => {
    it('should redirect unauthenticated users to login', () => {
      // Mock no session
      cy.intercept('GET', '/api/auth/user', {
        statusCode: 401,
        body: {
          error: 'Not authenticated',
        },
      }).as('getUserUnauthenticated');

      cy.visit('/dashboard');
      cy.wait('@getUserUnauthenticated');

      // Should redirect to login
      cy.url().should('include', '/auth/signin');
    });

    it('should allow authenticated users to access protected routes', () => {
      // Mock authenticated session
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

      cy.visit('/dashboard');
      cy.wait('@getUser');

      // Should access dashboard successfully
      cy.get('[data-testid="dashboard-header"]').should('be.visible');
      cy.url().should('include', '/dashboard');
    });
  });
});
