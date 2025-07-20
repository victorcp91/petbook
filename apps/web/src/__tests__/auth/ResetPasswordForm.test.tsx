import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm';

// Mock Supabase client
const mockResetPasswordForEmail = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: mockResetPasswordForEmail,
    },
  },
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
}));

// Mock auth context
const mockAuthContext = {
  resetPassword: jest.fn(),
  signOut: jest.fn(),
  user: null,
  loading: false,
  error: null,
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: () => mockAuthContext,
}));

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthContext.resetPassword.mockResolvedValue({ data: {}, error: null });
  });

  describe('Rendering', () => {
    it('renders reset password form with email field', () => {
      render(<ResetPasswordForm />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /enviar link de redefinição/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/voltar ao login/i)).toBeInTheDocument();
    });

    it('shows proper form description', () => {
      render(<ResetPasswordForm />);

      expect(screen.getByText(/esqueceu sua senha/i)).toBeInTheDocument();
      expect(screen.getByText(/digite seu email/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows error for empty email', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm />);

      const submitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
      });
    });

    it('shows error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      });
    });

    it('validates email format correctly', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm />);

      const emailInput = screen.getByLabelText(/email/i);

      // Test invalid email
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      });

      // Test valid email
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@example.com');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/email inválido/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Password Reset Success', () => {
    it('successfully sends reset email', async () => {
      const user = userEvent.setup();
      mockAuthContext.resetPassword.mockResolvedValue({
        data: {},
        error: null,
      });

      render(<ResetPasswordForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthContext.resetPassword).toHaveBeenCalledWith(
          'test@example.com'
        );
      });
    });

    it('shows success message after sending reset email', async () => {
      const user = userEvent.setup();
      mockAuthContext.resetPassword.mockResolvedValue({
        data: {},
        error: null,
      });

      render(<ResetPasswordForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

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

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();
      let resolveReset: (value: any) => void;
      mockAuthContext.resetPassword.mockImplementation(
        () =>
          new Promise(resolve => {
            resolveReset = resolve;
          })
      );

      render(<ResetPasswordForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
      await waitFor(() => {
        expect(screen.getByText(/enviando/i)).toBeInTheDocument();
      });

      // Resolve the promise
      resolveReset!({ data: {}, error: null });
    });
  });

  describe('Password Reset Failure', () => {
    it('shows error for email not found', async () => {
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

    it('shows error for network issues', async () => {
      const user = userEvent.setup();
      mockAuthContext.resetPassword.mockResolvedValue({
        data: {},
        error: { message: 'Network error' },
      });

      render(<ResetPasswordForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/erro de conexão/i)).toBeInTheDocument();
      });
    });

    it('shows error for rate limiting', async () => {
      const user = userEvent.setup();
      mockAuthContext.resetPassword.mockResolvedValue({
        data: {},
        error: { message: 'Too many requests' },
      });

      render(<ResetPasswordForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/muitas tentativas/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('navigates back to login page', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm />);

      const backLink = screen.getByText(/voltar ao login/i);
      await user.click(backLink);

      expect(backLink).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<ResetPasswordForm />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('has proper button roles', () => {
      render(<ResetPasswordForm />);

      expect(
        screen.getByRole('button', { name: /enviar link de redefinição/i })
      ).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ResetPasswordForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });

      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Rate Limiting', () => {
    it('prevents multiple rapid submissions', async () => {
      const user = userEvent.setup();
      let resolveReset: (value: any) => void;
      mockAuthContext.resetPassword.mockImplementation(
        () =>
          new Promise(resolve => {
            resolveReset = resolve;
          })
      );

      render(<ResetPasswordForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });

      await user.type(emailInput, 'test@example.com');

      // Try to submit multiple times
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthContext.resetPassword).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      resolveReset!({ data: {}, error: null });
    });
  });

  describe('Form State Management', () => {
    it('clears form after successful submission', async () => {
      const user = userEvent.setup();
      mockAuthContext.resetPassword.mockResolvedValue({
        data: {},
        error: null,
      });

      render(<ResetPasswordForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /enviar link de redefinição/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toHaveValue('');
      });
    });

    it('maintains form state after failed submission', async () => {
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

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toHaveValue('test@example.com');
      });
    });
  });
});
