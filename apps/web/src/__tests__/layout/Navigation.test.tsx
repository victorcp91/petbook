import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navigation } from '@/components/layout/Navigation';

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

jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: jest.fn(),
}));

import { useAuthContext } from '@/contexts/AuthContext';

const createMockUser = (role: string) => ({
  id: '1',
  email: 'test@example.com',
  role,
  permissions: [],
});

const renderWithAuth = (user: any = null) => {
  (useAuthContext as jest.Mock).mockReturnValue({
    user,
    signOut: mockSignOut,
    signIn: mockSignIn,
    signUp: mockSignUp,
    loading: false,
    session: user ? { user } : null,
    error: null,
  });

  return render(<Navigation />);
};

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when user is not authenticated', () => {
    renderWithAuth(null);

    expect(screen.queryByText('PetBook')).not.toBeInTheDocument();
  });

  it('should render logo and basic navigation for authenticated user', () => {
    const user = createMockUser('owner');
    renderWithAuth(user);

    expect(screen.getByText('PetBook')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render owner navigation items', () => {
    const user = createMockUser('owner');
    renderWithAuth(user);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Agendamentos')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Pets')).toBeInTheDocument();
    expect(screen.getByText('Serviços')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
    expect(screen.getByText('Administração')).toBeInTheDocument();
  });

  it('should render admin navigation items', () => {
    const user = createMockUser('admin');
    renderWithAuth(user);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Agendamentos')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Pets')).toBeInTheDocument();
    expect(screen.getByText('Serviços')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
    expect(screen.getByText('Administração')).toBeInTheDocument();
  });

  it('should render groomer navigation items', () => {
    const user = createMockUser('groomer');
    renderWithAuth(user);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Agendamentos')).toBeInTheDocument();
    expect(screen.getByText('Pets')).toBeInTheDocument();

    // Groomer should not see these items
    expect(screen.queryByText('Clientes')).not.toBeInTheDocument();
    expect(screen.queryByText('Serviços')).not.toBeInTheDocument();
    expect(screen.queryByText('Relatórios')).not.toBeInTheDocument();
    expect(screen.queryByText('Administração')).not.toBeInTheDocument();
  });

  it('should render attendant navigation items', () => {
    const user = createMockUser('attendant');
    renderWithAuth(user);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Agendamentos')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Pets')).toBeInTheDocument();

    // Attendant should not see these items
    expect(screen.queryByText('Serviços')).not.toBeInTheDocument();
    expect(screen.queryByText('Relatórios')).not.toBeInTheDocument();
    expect(screen.queryByText('Administração')).not.toBeInTheDocument();
  });

  it('should handle sign out when user clicks sign out', async () => {
    const user = createMockUser('owner');
    const userEventInstance = userEvent.setup();
    renderWithAuth(user);

    // Find and click the user menu trigger
    const userMenuTrigger = screen.getByRole('button', { name: /user menu/i });
    await userEventInstance.click(userMenuTrigger);

    // Find and click the sign out option
    const signOutButton = screen.getByText('Sair');
    await userEventInstance.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/auth/signin');
  });

  it('should display user email in the menu', async () => {
    const user = createMockUser('owner');
    const userEventInstance = userEvent.setup();
    renderWithAuth(user);

    // Open user menu
    const userMenuTrigger = screen.getByRole('button', { name: /user menu/i });
    await userEventInstance.click(userMenuTrigger);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should have proper navigation links', () => {
    const user = createMockUser('owner');
    renderWithAuth(user);

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    const appointmentsLink = screen.getByRole('link', {
      name: /agendamentos/i,
    });
    const clientsLink = screen.getByRole('link', { name: /clientes/i });

    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    expect(appointmentsLink).toHaveAttribute('href', '/appointments');
    expect(clientsLink).toHaveAttribute('href', '/clients');
  });

  it('should render with proper styling classes', () => {
    const user = createMockUser('owner');
    renderWithAuth(user);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-white', 'shadow-sm', 'border-b');
  });

  it('should handle mobile menu toggle', async () => {
    const user = createMockUser('owner');
    const userEventInstance = userEvent.setup();
    renderWithAuth(user);

    // Find mobile menu button (hamburger)
    const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
    await userEventInstance.click(mobileMenuButton);

    // Mobile menu should be visible
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render navigation items with icons', () => {
    const user = createMockUser('owner');
    renderWithAuth(user);

    // Check that navigation items are rendered with icons
    const dashboardItem = screen.getByText('Dashboard');
    expect(dashboardItem).toBeInTheDocument();

    // The icon should be present (lucide-react icons are rendered as SVGs)
    const dashboardLink = dashboardItem.closest('a');
    expect(dashboardLink).toHaveClass('inline-flex', 'items-center');
  });

  it('should handle error during sign out', async () => {
    const user = createMockUser('owner');
    const userEventInstance = userEvent.setup();

    // Mock signOut to throw an error
    const mockSignOutWithError = jest
      .fn()
      .mockRejectedValue(new Error('Sign out failed'));

    (useAuthContext as jest.Mock).mockReturnValue({
      user,
      signOut: mockSignOutWithError,
      signIn: jest.fn(),
      signUp: jest.fn(),
      loading: false,
      session: { user },
      error: null,
    });

    render(<Navigation />);

    // Open user menu and click sign out
    const userMenuTrigger = screen.getByRole('button', { name: /user menu/i });
    await userEventInstance.click(userMenuTrigger);

    const signOutButton = screen.getByText('Sair');
    await userEventInstance.click(signOutButton);

    expect(mockSignOutWithError).toHaveBeenCalledTimes(1);
  });

  it('should render user menu with proper options', async () => {
    const user = createMockUser('owner');
    const userEventInstance = userEvent.setup();
    renderWithAuth(user);

    // Open user menu
    const userMenuTrigger = screen.getByRole('button', { name: /user menu/i });
    await userEventInstance.click(userMenuTrigger);

    // Check for menu options
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('should handle unknown user role gracefully', () => {
    const user = createMockUser('unknown');
    renderWithAuth(user);

    // Should only show basic navigation
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Agendamentos')).not.toBeInTheDocument();
  });
});
