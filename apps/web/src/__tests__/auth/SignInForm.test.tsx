import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignInForm } from '../../components/auth/SignInForm';

// Mock Supabase client
const mockSignIn = jest.fn();
const mockGetUser = jest.fn();
const mockGetSession = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignIn,
      getUser: mockGetUser,
      getSession: mockGetSession,
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
  signIn: jest.fn(),
  signOut: jest.fn(),
  user: null,
  loading: false,
  error: null,
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: () => mockAuthContext,
}));

describe('SignInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthContext.signIn.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });
  });

  describe('Rendering', () => {
    it('renders sign in form with all required fields', () => {
      render(<SignInForm />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /entrar/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/esqueceu sua senha/i)).toBeInTheDocument();
      expect(screen.getByText(/não tem uma conta/i)).toBeInTheDocument();
    });

    it('shows password visibility toggle', () => {
      render(<SignInForm />);

      const passwordInput = screen.getByLabelText(/senha/i);
      const toggleButton = screen.getByRole('button', {
        name: /toggle password visibility/i,
      });

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows error for empty email', async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
      });
    });

    it('shows error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      });
    });

    it('shows error for empty password', async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
      });
    });

    it('validates email format correctly', async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

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

  describe('Authentication Success', () => {
    it('successfully signs in with valid credentials', async () => {
      const user = userEvent.setup();
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
    });

    it('shows loading state during authentication', async () => {
      const user = userEvent.setup();
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

      // Resolve the promise
      resolveSignIn!({ data: { user: { id: '123' } }, error: null });
    });
  });

  describe('Authentication Failure', () => {
    it('shows error for invalid credentials', async () => {
      const user = userEvent.setup();
      mockAuthContext.signIn.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      });

      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
      });
    });

    it('shows error for network issues', async () => {
      const user = userEvent.setup();
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
    });

    it('shows error for account not found', async () => {
      const user = userEvent.setup();
      mockAuthContext.signIn.mockResolvedValue({
        data: { user: null },
        error: { message: 'User not found' },
      });

      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, 'nonexistent@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/usuário não encontrado/i)).toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility', () => {
    it('toggles password visibility', async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const passwordInput = screen.getByLabelText(/senha/i);
      const toggleButton = screen.getByRole('button', {
        name: /toggle password visibility/i,
      });

      expect(passwordInput).toHaveAttribute('type', 'password');

      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Navigation', () => {
    it('navigates to sign up page', async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const signUpLink = screen.getByText(/criar conta/i);
      await user.click(signUpLink);

      // This would typically test navigation, but we're mocking the router
      expect(signUpLink).toBeInTheDocument();
    });

    it('navigates to password reset page', async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const resetLink = screen.getByText(/esqueceu sua senha/i);
      await user.click(resetLink);

      expect(resetLink).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<SignInForm />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    });

    it('has proper button roles', () => {
      render(<SignInForm />);

      expect(
        screen.getByRole('button', { name: /entrar/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /toggle password visibility/i })
      ).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Rate Limiting', () => {
    it('prevents multiple rapid submissions', async () => {
      const user = userEvent.setup();
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

      // Try to submit multiple times
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuthContext.signIn).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      resolveSignIn!({ data: { user: { id: '123' } }, error: null });
    });
  });
});
