import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useAuthContext } from '@/contexts/AuthContext';

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
    },
  },
}));

// Mock the auth context
jest.mock('@/contexts/AuthContext');
const mockUseAuthContext = useAuthContext as jest.MockedFunction<
  typeof useAuthContext
>;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ ...props }: any) => <input {...props} />,
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}));

jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AlertDescription: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Loader2: () => <span>Loader2</span>,
  Eye: () => <span>Eye</span>,
  EyeOff: () => <span>EyeOff</span>,
  CheckCircle: () => <span>CheckCircle</span>,
  XCircle: () => <span>XCircle</span>,
  Building2: () => <span>Building2</span>,
  Mail: () => <span>Mail</span>,
}));

// Mock auth utilities
jest.mock('@/lib/auth-config', () => ({
  userRoles: {
    OWNER: 'owner',
  },
  validateCPF: jest.fn(() => true),
  formatCPF: jest.fn(cpf => cpf),
  validateBrazilianPhone: jest.fn(() => true),
  formatBrazilianPhone: jest.fn(phone => phone),
}));

describe('SignUpForm', () => {
  const mockSignUp = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({
      signUp: mockSignUp,
      loading: false,
      error: null,
      user: null,
      session: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
      updateProfile: jest.fn(),
      refreshSession: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign up form', () => {
    render(<SignUpForm />);

    expect(
      screen.getByRole('button', { name: /criar pet shop/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nome Completo *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha *')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Senha *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome do Pet Shop *')).toBeInTheDocument();
    expect(screen.getByLabelText('Endereço do Pet Shop *')).toBeInTheDocument();
    expect(screen.getByLabelText('Telefone do Pet Shop *')).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    const submitButton = screen.getByRole('button', {
      name: /criar pet shop/i,
    });

    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
      expect(
        screen.getByText(/senha deve ter pelo menos 8 caracteres/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText('Nome do pet shop é obrigatório')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Endereço do pet shop é obrigatório')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Telefone do pet shop é obrigatório')
      ).toBeInTheDocument();
    });
  });

  it('calls signUp with correct data when form is valid', async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue({ user: { id: '1' }, error: null });

    render(<SignUpForm onSuccess={mockOnSuccess} />);

    // Fill in all required fields
    await act(async () => {
      await user.type(screen.getByLabelText('Nome Completo *'), 'John Doe');
      await user.type(screen.getByLabelText('Email *'), 'john@example.com');
      await user.type(screen.getByLabelText('Senha *'), 'Password123!');
      await user.type(
        screen.getByLabelText('Confirmar Senha *'),
        'Password123!'
      );
      await user.type(
        screen.getByLabelText('Nome do Pet Shop *'),
        'Pet Shop Test'
      );
      await user.type(
        screen.getByLabelText('Endereço do Pet Shop *'),
        'Rua Teste, 123'
      );
      await user.type(
        screen.getByLabelText('Telefone do Pet Shop *'),
        '11999999999'
      );
    });

    const submitButton = screen.getByRole('button', {
      name: /criar pet shop/i,
    });

    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        'john@example.com',
        'Password123!',
        {
          name: 'John Doe',
          role: 'owner',
          shop_data: {
            name: 'Pet Shop Test',
            address: 'Rua Teste, 123',
            phone: '11999999999',
            owner_email: 'john@example.com',
          },
        }
      );
    });
  });

  it('shows error message when signUp fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Email already exists';
    mockSignUp.mockResolvedValue({
      user: null,
      error: { message: errorMessage },
    });

    render(<SignUpForm onError={mockOnError} />);

    // Fill in all required fields
    await act(async () => {
      await user.type(screen.getByLabelText('Nome Completo *'), 'John Doe');
      await user.type(screen.getByLabelText('Email *'), 'john@example.com');
      await user.type(screen.getByLabelText('Senha *'), 'Password123!');
      await user.type(
        screen.getByLabelText('Confirmar Senha *'),
        'Password123!'
      );
      await user.type(
        screen.getByLabelText('Nome do Pet Shop *'),
        'Pet Shop Test'
      );
      await user.type(
        screen.getByLabelText('Endereço do Pet Shop *'),
        'Rua Teste, 123'
      );
      await user.type(
        screen.getByLabelText('Telefone do Pet Shop *'),
        '11999999999'
      );
    });

    const submitButton = screen.getByRole('button', {
      name: /criar pet shop/i,
    });

    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('validates password strength', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    // Fill in all fields except password
    await act(async () => {
      await user.type(screen.getByLabelText('Nome Completo *'), 'John Doe');
      await user.type(screen.getByLabelText('Email *'), 'john@example.com');
      await user.type(screen.getByLabelText('Confirmar Senha *'), 'weak');
      await user.type(
        screen.getByLabelText('Nome do Pet Shop *'),
        'Pet Shop Test'
      );
      await user.type(
        screen.getByLabelText('Endereço do Pet Shop *'),
        'Rua Teste, 123'
      );
      await user.type(
        screen.getByLabelText('Telefone do Pet Shop *'),
        '11999999999'
      );
    });

    const submitButton = screen.getByRole('button', {
      name: /criar pet shop/i,
    });

    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/senha deve ter pelo menos 8 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  it('validates password confirmation match', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    // Fill in all fields with mismatched passwords
    await act(async () => {
      await user.type(screen.getByLabelText('Nome Completo *'), 'John Doe');
      await user.type(screen.getByLabelText('Email *'), 'john@example.com');
      await user.type(screen.getByLabelText('Senha *'), 'Password123!');
      await user.type(
        screen.getByLabelText('Confirmar Senha *'),
        'DifferentPassword123!'
      );
      await user.type(
        screen.getByLabelText('Nome do Pet Shop *'),
        'Pet Shop Test'
      );
      await user.type(
        screen.getByLabelText('Endereço do Pet Shop *'),
        'Rua Teste, 123'
      );
      await user.type(
        screen.getByLabelText('Telefone do Pet Shop *'),
        '11999999999'
      );
    });

    const submitButton = screen.getByRole('button', {
      name: /criar pet shop/i,
    });

    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Senhas não coincidem')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    const mockOnError = jest.fn();

    render(<SignUpForm onError={mockOnError} />);

    // Fill in all fields with invalid email
    await act(async () => {
      await user.type(screen.getByLabelText('Nome Completo *'), 'John Doe');
      await user.type(screen.getByLabelText('Email *'), 'invalid-email');
      await user.type(screen.getByLabelText('Senha *'), 'Password123!');
      await user.type(
        screen.getByLabelText('Confirmar Senha *'),
        'Password123!'
      );
      await user.type(
        screen.getByLabelText('Nome do Pet Shop *'),
        'Pet Shop Test'
      );
      await user.type(
        screen.getByLabelText('Endereço do Pet Shop *'),
        'Rua Teste, 123'
      );
      await user.type(
        screen.getByLabelText('Telefone do Pet Shop *'),
        '11999999999'
      );
    });

    const submitButton = screen.getByRole('button', {
      name: /criar pet shop/i,
    });

    // Check if the button is actually clickable
    expect(submitButton).toBeEnabled();

    await act(async () => {
      await user.click(submitButton);
    });

    // Verify that the form submission was prevented (signUp should not be called)
    expect(mockSignUp).not.toHaveBeenCalled();
  });
});
