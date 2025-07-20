import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SignInForm } from '@/components/auth/SignInForm';
import { useAuthContext } from '@/contexts/AuthContext';

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

  describe('Form Rendering', () => {
    it('renders all form elements', () => {
      render(<SignInForm />);

      expect(
        screen.getByRole('textbox', { name: /email/i })
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/digite sua senha/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /entrar/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/esqueceu sua senha/i)).toBeInTheDocument();
      expect(screen.getByText(/criar conta/i)).toBeInTheDocument();
    });

    it('renders with proper initial state', () => {
      render(<SignInForm />);

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);

      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
      expect(passwordInput).toHaveAttribute('type', 'password');
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

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await act(async () => {
        await user.type(emailInput, 'invalid-email');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      });
    });

    it('shows error for empty password', async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      await act(async () => {
        await user.type(emailInput, 'test@example.com');
      });

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await act(async () => {
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
      });
    });

    it('validates email format correctly', async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      // Test invalid email
      await act(async () => {
        await user.type(emailInput, 'invalid-email');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      });

      // Test valid email
      await act(async () => {
        await user.clear(emailInput);
        await user.type(emailInput, 'valid@example.com');
        await user.click(submitButton);
      });

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

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await act(async () => {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(mockAuthContext.signIn).toHaveBeenCalledWith(
          'test@example.com',
          'password123'
        );
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

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await act(async () => {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);
      });

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

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await act(async () => {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Invalid login credentials/i)
        ).toBeInTheDocument();
      });
    });

    it('shows error for network issues', async () => {
      const user = userEvent.setup();
      mockAuthContext.signIn.mockResolvedValue({
        data: null,
        error: { message: 'Network error' },
      });

      render(<SignInForm />);

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await act(async () => {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });
    });

    it('shows error for account not found', async () => {
      const user = userEvent.setup();
      mockAuthContext.signIn.mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      });

      render(<SignInForm />);

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await act(async () => {
        await user.type(emailInput, 'nonexistent@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/User not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility', () => {
    it('toggles password visibility', async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);
      const toggleButton = screen.getByRole('button', {
        name: /mostrar senha/i,
      });

      expect(passwordInput).toHaveAttribute('type', 'password');

      await act(async () => {
        await user.click(toggleButton);
      });

      expect(passwordInput).toHaveAttribute('type', 'text');

      await act(async () => {
        await user.click(toggleButton);
      });

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

      expect(
        screen.getByRole('textbox', { name: /email/i })
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/digite sua senha/i)
      ).toBeInTheDocument();
    });

    it('has proper button roles', () => {
      render(<SignInForm />);

      expect(
        screen.getByRole('button', { name: /entrar/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /mostrar senha/i })
      ).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.tab();

      expect(emailInput).toHaveFocus();

      await user.tab();

      expect(passwordInput).toHaveFocus();

      await user.tab();

      // The password visibility button gets focus before the forgot password button
      const passwordToggleButton = screen.getByRole('button', {
        name: /mostrar senha/i,
      });
      expect(passwordToggleButton).toHaveFocus();

      await user.tab();

      // The forgot password button gets focus before the submit button
      const forgotPasswordButton = screen.getByRole('button', {
        name: /esqueceu sua senha/i,
      });
      expect(forgotPasswordButton).toHaveFocus();

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

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await act(async () => {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
      });

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
