import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignInForm } from '../../components/auth/SignInForm';
import { SignUpForm } from '../../components/auth/SignUpForm';
import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm';
import { UpdatePasswordForm } from '../../components/auth/UpdatePasswordForm';

// Mock Supabase client
const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockResetPassword = jest.fn();
const mockUpdateUser = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignIn,
      signUp: mockSignUp,
      resetPasswordForEmail: mockResetPassword,
      updateUser: mockUpdateUser,
    },
  },
}));

// Mock Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
      replace: mockReplace,
      prefetch: jest.fn(),
    };
  },
}));

// Mock auth context
const mockAuthContext = {
  signIn: jest.fn(),
  signUp: jest.fn(),
  resetPassword: jest.fn(),
  updatePassword: jest.fn(),
  signOut: jest.fn(),
  user: null,
  loading: false,
  error: null,
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: () => mockAuthContext,
}));

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthContext.signIn.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });
    mockAuthContext.signUp.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });
    mockAuthContext.resetPassword.mockResolvedValue({ data: {}, error: null });
    mockAuthContext.updatePassword.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });
  });

  describe('Complete User Registration Flow', () => {
    it('successfully registers a new user with all required information', async () => {
      const user = userEvent.setup();
      mockAuthContext.signUp.mockResolvedValue({
        data: { user: { id: '123', email: 'joao@example.com' } },
        error: null,
      });

      render(<SignUpForm />);

      // Fill in all required fields
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
      await user.type(screen.getByLabelText(/email/i), 'joao@example.com');
      await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999');
      await user.type(screen.getByLabelText(/cpf/i), '123.456.789-09');
      await user.type(screen.getByLabelText(/senha/i), 'Password123!');
      await user.type(
        screen.getByLabelText(/confirmar senha/i),
        'Password123!'
      );

      // Fill in shop information
      await user.type(
        screen.getByLabelText(/nome do pet shop/i),
        'Pet Shop Silva'
      );
      await user.type(
        screen.getByLabelText(/endereço do pet shop/i),
        'Rua das Flores, 123'
      );
      await user.type(
        screen.getByLabelText(/telefone do pet shop/i),
        '(11) 88888-8888'
      );

      const submitButton = screen.getByRole('button', { name: /criar conta/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthContext.signUp).toHaveBeenCalledWith(
          'joao@example.com',
          'Password123!',
          {
            name: 'João Silva',
            role: 'owner',
            shop_data: {
              name: 'Pet Shop Silva',
              address: 'Rua das Flores, 123',
              phone: '(11) 88888-8888',
              owner_email: 'joao@example.com',
            },
          }
        );
      });
    });

    it('handles registration failure and shows appropriate error', async () => {
      const user = userEvent.setup();
      mockAuthContext.signUp.mockResolvedValue({
        data: { user: null },
        error: { message: 'User already registered' },
      });

      render(<SignUpForm />);

      // Fill in all required fields
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
      await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
      await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999');
      await user.type(screen.getByLabelText(/cpf/i), '123.456.789-09');
      await user.type(screen.getByLabelText(/senha/i), 'Password123!');
      await user.type(
        screen.getByLabelText(/confirmar senha/i),
        'Password123!'
      );

      // Fill in shop information
      await user.type(
        screen.getByLabelText(/nome do pet shop/i),
        'Pet Shop Silva'
      );
      await user.type(
        screen.getByLabelText(/endereço do pet shop/i),
        'Rua das Flores, 123'
      );
      await user.type(
        screen.getByLabelText(/telefone do pet shop/i),
        '(11) 88888-8888'
      );

      const submitButton = screen.getByRole('button', { name: /criar conta/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email já cadastrado/i)).toBeInTheDocument();
      });
    });
  });

  describe('Complete User Login Flow', () => {
    it('successfully logs in with valid credentials', async () => {
      const user = userEvent.setup();
      mockAuthContext.signIn.mockResolvedValue({
        data: { user: { id: '123', email: 'joao@example.com' } },
        error: null,
      });

      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, 'joao@example.com');
      await user.type(passwordInput, 'Password123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthContext.signIn).toHaveBeenCalledWith({
          email: 'joao@example.com',
          password: 'Password123!',
        });
      });
    });

    it('handles login failure and shows appropriate error', async () => {
      const user = userEvent.setup();
      mockAuthContext.signIn.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      });

      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, 'joao@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
      });
    });
  });

  describe('Complete Password Reset Flow', () => {
    it('successfully requests password reset and updates password', async () => {
      const user = userEvent.setup();

      // Step 1: Request password reset
      mockAuthContext.resetPassword.mockResolvedValue({
        data: {},
        error: null,
      });

      render(<ResetPasswordForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });

      await user.type(emailInput, 'joao@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthContext.resetPassword).toHaveBeenCalledWith(
          'joao@example.com'
        );
      });
      await waitFor(() => {
        expect(
          screen.getByText(/email enviado com sucesso/i)
        ).toBeInTheDocument();
      });

      // Step 2: Update password with reset token
      mockAuthContext.updatePassword.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      });

      render(<UpdatePasswordForm />);

      const newPasswordInput = screen.getByLabelText(/nova senha/i);
      const confirmPasswordInput =
        screen.getByLabelText(/confirmar nova senha/i);
      const updateButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });

      await user.type(newPasswordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockAuthContext.updatePassword).toHaveBeenCalledWith(
          'NewPassword123!'
        );
      });
      await waitFor(() => {
        expect(
          screen.getByText(/senha atualizada com sucesso/i)
        ).toBeInTheDocument();
      });
    });

    it('handles password reset request failure', async () => {
      const user = userEvent.setup();
      mockAuthContext.resetPassword.mockResolvedValue({
        data: {},
        error: { message: 'User not found' },
      });

      render(<ResetPasswordForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });

      await user.type(emailInput, 'nonexistent@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email não encontrado/i)).toBeInTheDocument();
      });
    });

    it('handles password update failure with invalid token', async () => {
      const user = userEvent.setup();
      mockAuthContext.updatePassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid reset token' },
      });

      render(<UpdatePasswordForm />);

      const newPasswordInput = screen.getByLabelText(/nova senha/i);
      const confirmPasswordInput =
        screen.getByLabelText(/confirmar nova senha/i);
      const updateButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });

      await user.type(newPasswordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText(/token inválido/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation Integration', () => {
    it('validates all required fields across all forms', async () => {
      const user = userEvent.setup();

      // Test SignUpForm validation
      render(<SignUpForm />);
      const signUpSubmitButton = screen.getByRole('button', {
        name: /criar conta/i,
      });
      await user.click(signUpSubmitButton);

      await waitFor(() => {
        expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
      });

      // Test SignInForm validation
      render(<SignInForm />);
      const signInSubmitButton = screen.getByRole('button', {
        name: /entrar/i,
      });
      await user.click(signInSubmitButton);

      await waitFor(() => {
        expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
      });

      // Test ResetPasswordForm validation
      render(<ResetPasswordForm />);
      const resetSubmitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });
      await user.click(resetSubmitButton);

      await waitFor(() => {
        expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
      });

      // Test UpdatePasswordForm validation
      render(<UpdatePasswordForm />);
      const updateSubmitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });
      await user.click(updateSubmitButton);

      await waitFor(() => {
        expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
      });
    });

    it('validates password strength requirements consistently', async () => {
      const user = userEvent.setup();

      // Test weak password in SignUpForm
      render(<SignUpForm />);
      const signUpPasswordInput = screen.getByLabelText(/senha/i);
      await user.type(signUpPasswordInput, 'weak');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/senha deve ter pelo menos 8 caracteres/i)
        ).toBeInTheDocument();
      });

      // Test weak password in UpdatePasswordForm
      render(<UpdatePasswordForm />);
      const updatePasswordInput = screen.getByLabelText(/nova senha/i);
      await user.type(updatePasswordInput, 'weak');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/senha deve ter pelo menos 8 caracteres/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('handles network errors consistently across all forms', async () => {
      const user = userEvent.setup();

      // Test network error in SignInForm
      mockAuthContext.signIn.mockResolvedValue({
        data: { user: null },
        error: { message: 'Network error' },
      });

      render(<SignInForm />);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/erro de conexão/i)).toBeInTheDocument();
      });

      // Test network error in SignUpForm
      mockAuthContext.signUp.mockResolvedValue({
        data: { user: null },
        error: { message: 'Network error' },
      });

      render(<SignUpForm />);

      // Fill in all required fields
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
      await user.type(screen.getByLabelText(/email/i), 'joao@example.com');
      await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999');
      await user.type(screen.getByLabelText(/cpf/i), '123.456.789-09');
      await user.type(screen.getByLabelText(/senha/i), 'Password123!');
      await user.type(
        screen.getByLabelText(/confirmar senha/i),
        'Password123!'
      );

      // Fill in shop information
      await user.type(
        screen.getByLabelText(/nome do pet shop/i),
        'Pet Shop Silva'
      );
      await user.type(
        screen.getByLabelText(/endereço do pet shop/i),
        'Rua das Flores, 123'
      );
      await user.type(
        screen.getByLabelText(/telefone do pet shop/i),
        '(11) 88888-8888'
      );

      const signUpSubmitButton = screen.getByRole('button', {
        name: /criar conta/i,
      });
      await user.click(signUpSubmitButton);

      await waitFor(() => {
        expect(screen.getByText(/erro de conexão/i)).toBeInTheDocument();
      });
    });

    it('handles rate limiting consistently across all forms', async () => {
      const user = userEvent.setup();

      // Test rate limiting in SignInForm
      mockAuthContext.signIn.mockResolvedValue({
        data: { user: null },
        error: { message: 'Too many requests' },
      });

      render(<SignInForm />);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/muitas tentativas/i)).toBeInTheDocument();
      });

      // Test rate limiting in ResetPasswordForm
      mockAuthContext.resetPassword.mockResolvedValue({
        data: {},
        error: { message: 'Too many requests' },
      });

      render(<ResetPasswordForm />);
      const resetEmailInput = screen.getByLabelText(/email/i);
      const resetSubmitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });

      await user.type(resetEmailInput, 'test@example.com');
      await user.click(resetSubmitButton);

      await waitFor(() => {
        expect(screen.getByText(/muitas tentativas/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Experience Integration', () => {
    it('provides consistent loading states across all forms', async () => {
      const user = userEvent.setup();

      // Test loading state in SignInForm
      let resolveSignIn: (value: any) => void;
      mockAuthContext.signIn.mockImplementation(
        () =>
          new Promise(resolve => {
            resolveSignIn = resolve;
          })
      );

      render(<SignInForm />);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
      await waitFor(() => {
        expect(screen.getByText(/entrando/i)).toBeInTheDocument();
      });

      resolveSignIn!({ data: { user: { id: '123' } }, error: null });

      // Test loading state in SignUpForm
      let resolveSignUp: (value: any) => void;
      mockAuthContext.signUp.mockImplementation(
        () =>
          new Promise(resolve => {
            resolveSignUp = resolve;
          })
      );

      render(<SignUpForm />);

      // Fill in all required fields
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
      await user.type(screen.getByLabelText(/email/i), 'joao@example.com');
      await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999');
      await user.type(screen.getByLabelText(/cpf/i), '123.456.789-09');
      await user.type(screen.getByLabelText(/senha/i), 'Password123!');
      await user.type(
        screen.getByLabelText(/confirmar senha/i),
        'Password123!'
      );

      // Fill in shop information
      await user.type(
        screen.getByLabelText(/nome do pet shop/i),
        'Pet Shop Silva'
      );
      await user.type(
        screen.getByLabelText(/endereço do pet shop/i),
        'Rua das Flores, 123'
      );
      await user.type(
        screen.getByLabelText(/telefone do pet shop/i),
        '(11) 88888-8888'
      );

      const signUpSubmitButton = screen.getByRole('button', {
        name: /criar conta/i,
      });
      await user.click(signUpSubmitButton);

      await waitFor(() => {
        expect(signUpSubmitButton).toBeDisabled();
      });
      await waitFor(() => {
        expect(screen.getByText(/criando conta/i)).toBeInTheDocument();
      });

      resolveSignUp!({ data: { user: { id: '123' } }, error: null });
    });

    it('provides consistent success feedback across all forms', async () => {
      const user = userEvent.setup();

      // Test success feedback in SignInForm
      mockAuthContext.signIn.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      });

      render(<SignInForm />);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthContext.signIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      // Test success feedback in ResetPasswordForm
      mockAuthContext.resetPassword.mockResolvedValue({
        data: {},
        error: null,
      });

      render(<ResetPasswordForm />);
      const resetEmailInput = screen.getByLabelText(/email/i);
      const resetSubmitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });

      await user.type(resetEmailInput, 'test@example.com');
      await user.click(resetSubmitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/email enviado com sucesso/i)
        ).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(
          screen.getByText(/verifique sua caixa de entrada/i)
        ).toBeInTheDocument();
      });
    });
  });
});
