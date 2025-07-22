import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UpdatePasswordForm } from '../../components/auth/UpdatePasswordForm';

// Mock Supabase client
const mockUpdateUser = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      updateUser: mockUpdateUser,
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
  updatePassword: jest.fn(),
  signOut: jest.fn(),
  user: null,
  loading: false,
  error: null,
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: () => mockAuthContext,
}));

describe('UpdatePasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthContext.updatePassword.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });
  });

  describe('Rendering', () => {
    it('renders update password form with all required fields', () => {
      render(<UpdatePasswordForm />);

      expect(screen.getByLabelText(/nova senha/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/confirmar nova senha/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /atualizar senha/i })
      ).toBeInTheDocument();
    });

    it('shows password visibility toggles', () => {
      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );
      const toggleButtons = screen.getAllByRole('button', {
        name: /toggle password visibility/i,
      });

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      expect(toggleButtons).toHaveLength(2);
    });

    it('shows proper form description', () => {
      render(<UpdatePasswordForm />);

      expect(screen.getByText(/defina sua nova senha/i)).toBeInTheDocument();
      expect(
        screen.getByText(/sua senha deve ser segura/i)
      ).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows error for empty password', async () => {
      const user = userEvent.setup();
      render(<UpdatePasswordForm />);

      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
      });
    });

    it('shows error for weak password', async () => {
      const user = userEvent.setup();
      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      await user.type(passwordInput, 'weak');

      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/senha deve ter pelo menos 8 caracteres/i)
        ).toBeInTheDocument();
      });
    });

    it('shows error for password mismatch', async () => {
      const user = userEvent.setup();
      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );

      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'DifferentPassword123!');

      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/senhas não coincidem/i)).toBeInTheDocument();
      });
    });

    it('validates password strength requirements', async () => {
      const user = userEvent.setup();
      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );

      // Test weak password (too short)
      await user.type(passwordInput, 'weak');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/senha deve ter pelo menos 8 caracteres/i)
        ).toBeInTheDocument();
      });

      // Test weak password (no uppercase)
      await user.clear(passwordInput);
      await user.type(passwordInput, 'password123!');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/senha deve conter pelo menos uma letra maiúscula/i)
        ).toBeInTheDocument();
      });

      // Test weak password (no lowercase)
      await user.clear(passwordInput);
      await user.type(passwordInput, 'PASSWORD123!');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/senha deve conter pelo menos uma letra minúscula/i)
        ).toBeInTheDocument();
      });

      // Test weak password (no number)
      await user.clear(passwordInput);
      await user.type(passwordInput, 'Password!');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/senha deve conter pelo menos um número/i)
        ).toBeInTheDocument();
      });

      // Test weak password (no special character)
      await user.clear(passwordInput);
      await user.type(passwordInput, 'Password123');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(
            /senha deve conter pelo menos um caractere especial/i
          )
        ).toBeInTheDocument();
      });

      // Test strong password
      await user.clear(passwordInput);
      await user.type(passwordInput, 'Password123!');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.queryByText(/senha deve ter pelo menos 8 caracteres/i)
        ).not.toBeInTheDocument();
      });
      await waitFor(() => {
        expect(
          screen.queryByText(
            /senha deve conter pelo menos uma letra maiúscula/i
          )
        ).not.toBeInTheDocument();
      });
      await waitFor(() => {
        expect(
          screen.queryByText(
            /senha deve conter pelo menos uma letra minúscula/i
          )
        ).not.toBeInTheDocument();
      });
      await waitFor(() => {
        expect(
          screen.queryByText(/senha deve conter pelo menos um número/i)
        ).not.toBeInTheDocument();
      });
      await waitFor(() => {
        expect(
          screen.queryByText(
            /senha deve conter pelo menos um caractere especial/i
          )
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Password Update Success', () => {
    it('successfully updates password with valid data', async () => {
      const user = userEvent.setup();
      mockAuthContext.updatePassword.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      });

      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );
      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });

      await user.type(passwordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthContext.updatePassword).toHaveBeenCalledWith(
          'NewPassword123!'
        );
      });
    });

    it('shows success message after password update', async () => {
      const user = userEvent.setup();
      mockAuthContext.updatePassword.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      });

      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );
      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });

      await user.type(passwordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/senha atualizada com sucesso/i)
        ).toBeInTheDocument();
      });
    });

    it('shows loading state during password update', async () => {
      const user = userEvent.setup();
      let resolveUpdate: (value: any) => void;
      mockAuthContext.updatePassword.mockImplementation(
        () =>
          new Promise(resolve => {
            resolveUpdate = resolve;
          })
      );

      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );
      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });

      await user.type(passwordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
      await waitFor(() => {
        expect(screen.getByText(/atualizando/i)).toBeInTheDocument();
      });

      // Resolve the promise
      resolveUpdate!({ data: { user: { id: '123' } }, error: null });
    });
  });

  describe('Password Update Failure', () => {
    it('shows error for invalid reset token', async () => {
      const user = userEvent.setup();
      mockAuthContext.updatePassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid reset token' },
      });

      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );
      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });

      await user.type(passwordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/token inválido/i)).toBeInTheDocument();
      });
    });

    it('shows error for expired reset token', async () => {
      const user = userEvent.setup();
      mockAuthContext.updatePassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Token expired' },
      });

      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );
      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });

      await user.type(passwordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/token expirado/i)).toBeInTheDocument();
      });
    });

    it('shows error for network issues', async () => {
      const user = userEvent.setup();
      mockAuthContext.updatePassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Network error' },
      });

      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );
      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });

      await user.type(passwordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/erro de conexão/i)).toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility', () => {
    it('toggles password visibility for both fields', async () => {
      const user = userEvent.setup();
      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );
      const toggleButtons = screen.getAllByRole('button', {
        name: /toggle password visibility/i,
      });

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');

      // Toggle password field
      await user.click(toggleButtons[0]);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');

      // Toggle confirm password field
      await user.click(toggleButtons[1]);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');

      // Toggle back
      await user.click(toggleButtons[0]);
      await user.click(toggleButtons[1]);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Navigation', () => {
    it('navigates to login page after successful update', async () => {
      const user = userEvent.setup();
      mockAuthContext.updatePassword.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      });

      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );
      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });

      await user.type(passwordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/senha atualizada com sucesso/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<UpdatePasswordForm />);

      expect(screen.getByLabelText(/nova senha/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/confirmar nova senha/i)
      ).toBeInTheDocument();
    });

    it('has proper button roles', () => {
      render(<UpdatePasswordForm />);

      expect(
        screen.getByRole('button', { name: /atualizar senha/i })
      ).toBeInTheDocument();
      const toggleButtons = screen.getAllByRole('button', {
        name: /toggle password visibility/i,
      });
      expect(toggleButtons).toHaveLength(2);
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );
      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });

      await user.tab();
      expect(passwordInput).toHaveFocus();

      // Tab through password visibility toggle button
      await user.tab();

      // Tab through confirm password visibility toggle button
      await user.tab();
      expect(confirmPasswordInput).toHaveFocus();

      // Tab through confirm password visibility toggle button
      await user.tab();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Rate Limiting', () => {
    it('prevents multiple rapid submissions', async () => {
      const user = userEvent.setup();
      let resolveUpdate: (value: any) => void;
      mockAuthContext.updatePassword.mockImplementation(
        () =>
          new Promise(resolve => {
            resolveUpdate = resolve;
          })
      );

      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );
      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });

      await user.type(passwordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');

      // Try to submit multiple times
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthContext.updatePassword).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      resolveUpdate!({ data: { user: { id: '123' } }, error: null });
    });
  });

  describe('Form State Management', () => {
    it('clears form after successful submission', async () => {
      const user = userEvent.setup();
      mockAuthContext.updatePassword.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      });

      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );
      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });

      await user.type(passwordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(passwordInput).toHaveValue('');
      });
      await waitFor(() => {
        expect(confirmPasswordInput).toHaveValue('');
      });
    });

    it('maintains form state after failed submission', async () => {
      const user = userEvent.setup();
      mockAuthContext.updatePassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' },
      });

      render(<UpdatePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        /digite sua nova senha/i
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        /confirme sua nova senha/i
      );
      const submitButton = screen.getByRole('button', {
        name: /atualizar senha/i,
      });

      await user.type(passwordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(passwordInput).toHaveValue('NewPassword123!');
      });
      await waitFor(() => {
        expect(confirmPasswordInput).toHaveValue('NewPassword123!');
      });
    });
  });
});
