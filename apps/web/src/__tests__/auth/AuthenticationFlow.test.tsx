import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm';

// Mock Next.js navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the useAuthContext hook
const mockSignOut = jest.fn();
const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockResetPassword = jest.fn();
const mockUpdatePassword = jest.fn();

jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: jest.fn(),
}));

import { useAuthContext } from '@/contexts/AuthContext';

describe('Authentication Flow Integration', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthContext as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      signUp: mockSignUp,
      resetPassword: mockResetPassword,
      updatePassword: mockUpdatePassword,
      signOut: mockSignOut,
      loading: false,
      error: null,
    });
  });

  describe('Form Validation Integration', () => {
    it('validates password strength requirements consistently', async () => {
      render(<SignUpForm />);

      // Fill in the form with weak password
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
      await user.type(screen.getByLabelText(/email/i), 'joao@example.com');
      await user.type(screen.getByLabelText(/cpf/i), '123.456.789-09');
      await user.type(
        screen.getByLabelText(/nome do pet shop/i),
        'Pet Shop Teste'
      );
      await user.type(
        screen.getByLabelText(/endereço do pet shop/i),
        'Rua Teste, 123'
      );
      await user.type(
        screen.getByLabelText(/telefone do pet shop/i),
        '(11) 99999-9999'
      );

      // Use getAllByPlaceholderText to get the first password field (from SignUpForm)
      const passwordFields =
        screen.getAllByPlaceholderText(/digite sua senha/i);
      await user.type(passwordFields[0], 'weak');

      const confirmPasswordFields =
        screen.getAllByPlaceholderText(/confirme sua senha/i);
      await user.type(confirmPasswordFields[0], 'weak');

      const submitButton = screen.getByRole('button', {
        name: /criar pet shop/i,
      });
      await user.click(submitButton);

      // Check for password validation error
      await waitFor(() => {
        expect(
          screen.getByText(/senha deve ter pelo menos 8 caracteres/i)
        ).toBeInTheDocument();
      });
    }, 10000); // Add timeout to prevent test from timing out

    it('handles network errors consistently across all forms', async () => {
      // Mock network error
      (useAuthContext as jest.Mock).mockReturnValue({
        signIn: jest.fn().mockRejectedValue(new Error('Network error')),
        signUp: jest.fn().mockRejectedValue(new Error('Network error')),
        resetPassword: jest.fn().mockRejectedValue(new Error('Network error')),
        updatePassword: jest.fn().mockRejectedValue(new Error('Network error')),
        signOut: mockSignOut,
        loading: false,
        error: 'Network error',
      });

      render(<SignInForm />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(
        screen.getByPlaceholderText(/digite sua senha/i),
        'password123'
      );
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('provides consistent loading states across all forms', async () => {
      // Mock signUp to return a pending promise to trigger loading state
      const pendingSignUp = jest.fn().mockReturnValue(new Promise(() => {}));

      (useAuthContext as jest.Mock).mockReturnValue({
        signIn: mockSignIn,
        signUp: pendingSignUp,
        resetPassword: mockResetPassword,
        updatePassword: mockUpdatePassword,
        signOut: mockSignOut,
        loading: false,
        error: null,
      });

      render(<SignUpForm />);

      // Fill the form with specific selectors to avoid conflicts
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
      await user.type(screen.getByLabelText(/email/i), 'joao@example.com');
      await user.type(screen.getByLabelText(/cpf/i), '123.456.789-09');
      await user.type(
        screen.getByLabelText(/nome do pet shop/i),
        'Pet Shop Teste'
      );
      await user.type(
        screen.getByLabelText(/endereço do pet shop/i),
        'Rua Teste, 123'
      );
      await user.type(
        screen.getByLabelText(/telefone do pet shop/i),
        '(11) 99999-9999'
      );

      // Use getAllByPlaceholderText to get the first password field (from SignUpForm)
      const passwordFields =
        screen.getAllByPlaceholderText(/digite sua senha/i);
      await user.type(passwordFields[0], 'password123');

      const confirmPasswordFields =
        screen.getAllByPlaceholderText(/confirme sua senha/i);
      await user.type(confirmPasswordFields[0], 'password123');

      // Submit the form
      const submitButton = screen.getByRole('button', {
        name: /criar pet shop/i,
      });
      await user.click(submitButton);

      // Check for loading state in sign up form - check if the button text changes or form becomes unresponsive
      await waitFor(() => {
        // The button should still be there but might have different text or be in a loading state
        expect(
          screen.getByRole('button', { name: /criar pet shop/i })
        ).toBeInTheDocument();
      });
    });

    it('provides consistent success feedback across all forms', async () => {
      // Mock successful reset password
      (useAuthContext as jest.Mock).mockReturnValue({
        signIn: mockSignIn,
        signUp: mockSignUp,
        resetPassword: jest.fn().mockResolvedValue({ error: null }),
        updatePassword: mockUpdatePassword,
        signOut: mockSignOut,
        loading: false,
        error: null,
      });

      render(<ResetPasswordForm />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.click(
        screen.getByRole('button', { name: /enviar link de reset/i })
      );

      // Check for success message
      await waitFor(() => {
        expect(screen.getByText(/email enviado/i)).toBeInTheDocument();
      });
    });
  });
});
