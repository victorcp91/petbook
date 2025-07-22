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
    // Use getAllByText for Dashboard since it appears in both desktop and mobile nav
    expect(screen.getAllByText('Dashboard')).toHaveLength(2);
  });

  it('should render owner navigation items', () => {
    const user = createMockUser('owner');
    renderWithAuth(user);

    // Use getAllByText for items that appear in both desktop and mobile nav
    expect(screen.getAllByText('Dashboard')).toHaveLength(2);
    expect(screen.getAllByText('Agendamentos')).toHaveLength(2);
    expect(screen.getAllByText('Clientes')).toHaveLength(2);
    expect(screen.getAllByText('Pets')).toHaveLength(2);
    expect(screen.getAllByText('Serviços')).toHaveLength(2);
    expect(screen.getAllByText('Relatórios')).toHaveLength(2);
    expect(screen.getAllByText('Administração')).toHaveLength(2);
  });

  it('should render admin navigation items', () => {
    const user = createMockUser('admin');
    renderWithAuth(user);

    expect(screen.getAllByText('Dashboard')).toHaveLength(2);
    expect(screen.getAllByText('Agendamentos')).toHaveLength(2);
    expect(screen.getAllByText('Clientes')).toHaveLength(2);
    expect(screen.getAllByText('Pets')).toHaveLength(2);
    expect(screen.getAllByText('Serviços')).toHaveLength(2);
    expect(screen.getAllByText('Relatórios')).toHaveLength(2);
    expect(screen.getAllByText('Administração')).toHaveLength(2);
  });

  it('should render groomer navigation items', () => {
    const user = createMockUser('groomer');
    renderWithAuth(user);

    expect(screen.getAllByText('Dashboard')).toHaveLength(2);
    expect(screen.getAllByText('Agendamentos')).toHaveLength(2);
    expect(screen.getAllByText('Pets')).toHaveLength(2);

    // Groomer should not see these items
    expect(screen.queryByText('Clientes')).not.toBeInTheDocument();
    expect(screen.queryByText('Serviços')).not.toBeInTheDocument();
    expect(screen.queryByText('Relatórios')).not.toBeInTheDocument();
    expect(screen.queryByText('Administração')).not.toBeInTheDocument();
  });

  it('should render attendant navigation items', () => {
    const user = createMockUser('attendant');
    renderWithAuth(user);

    expect(screen.getAllByText('Dashboard')).toHaveLength(2);
    expect(screen.getAllByText('Agendamentos')).toHaveLength(2);
    expect(screen.getAllByText('Clientes')).toHaveLength(2);
    expect(screen.getAllByText('Pets')).toHaveLength(2);

    // Attendant should not see these items
    expect(screen.queryByText('Serviços')).not.toBeInTheDocument();
    expect(screen.queryByText('Relatórios')).not.toBeInTheDocument();
    expect(screen.queryByText('Administração')).not.toBeInTheDocument();
  });

  it('should handle sign out when user clicks sign out', async () => {
    const user = createMockUser('owner');
    const userEventInstance = userEvent.setup();
    renderWithAuth(user);

    // Find and click the user menu trigger (the button with User icon)
    const userMenuTrigger = screen.getByRole('button');
    await userEventInstance.click(userMenuTrigger);

    // Find and click the sign out option
    const signOutButton = screen.getByText('Sair');
    await userEventInstance.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/auth/signin');
  }, 10000); // Increase timeout to 10 seconds

  it('should display user email in the menu', async () => {
    const user = createMockUser('owner');
    const userEventInstance = userEvent.setup();
    renderWithAuth(user);

    // Open user menu
    const userMenuTrigger = screen.getByRole('button');
    await userEventInstance.click(userMenuTrigger);

    // Email appears twice in the dropdown (main text and subtitle)
    expect(screen.getAllByText('test@example.com')).toHaveLength(2);
  });

  it('should have proper navigation links', () => {
    const user = createMockUser('owner');
    renderWithAuth(user);

    const dashboardLinks = screen.getAllByRole('link', { name: /dashboard/i });
    const appointmentsLinks = screen.getAllByRole('link', {
      name: /agendamentos/i,
    });
    const clientsLinks = screen.getAllByRole('link', { name: /clientes/i });

    expect(dashboardLinks[0]).toHaveAttribute('href', '/dashboard');
    expect(appointmentsLinks[0]).toHaveAttribute('href', '/appointments');
    expect(clientsLinks[0]).toHaveAttribute('href', '/clients');
  });

  it('should render with proper styling classes', () => {
    const user = createMockUser('owner');
    renderWithAuth(user);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-white', 'shadow-sm', 'border-b');
  });

  it('should render navigation items with icons', () => {
    const user = createMockUser('owner');
    renderWithAuth(user);

    // Check that navigation items are rendered with icons
    const dashboardLinks = screen.getAllByText('Dashboard');
    expect(dashboardLinks).toHaveLength(2);

    // The icon should be present (lucide-react icons are rendered as SVGs)
    const dashboardLink = screen.getAllByRole('link', {
      name: /dashboard/i,
    })[0];
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
    const userMenuTrigger = screen.getByRole('button');
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
    const userMenuTrigger = screen.getByRole('button');
    await userEventInstance.click(userMenuTrigger);

    // Check for menu options
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('should handle unknown user role gracefully', () => {
    const user = createMockUser('unknown');
    renderWithAuth(user);

    // Should only show basic navigation (Dashboard appears in both desktop and mobile)
    expect(screen.getAllByText('Dashboard')).toHaveLength(2);
    expect(screen.queryByText('Agendamentos')).not.toBeInTheDocument();
  });
});
