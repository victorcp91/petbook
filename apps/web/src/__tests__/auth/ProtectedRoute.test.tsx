import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

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
  user: null as any,
  loading: false,
  error: null,
  signIn: jest.fn(),
  signOut: jest.fn(),
  session: null,
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: () => mockAuthContext,
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthContext.user = null;
    mockAuthContext.loading = false;
  });

  describe('Authentication States', () => {
    it('shows loading state when authentication is in progress', () => {
      mockAuthContext.loading = true;

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText(/carregando/i)).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('redirects to login when user is not authenticated', async () => {
      mockAuthContext.user = null;
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/signin');
      });

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('renders children when user is authenticated', () => {
      mockAuthContext.user = { id: '123', email: 'test@example.com' };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Role-Based Access Control', () => {
    it('allows access for users with required role', () => {
      mockAuthContext.user = {
        id: '123',
        email: 'test@example.com',
        role: 'owner',
      };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute requiredRole="owner">
          <div>Owner Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Owner Content')).toBeInTheDocument();
    });

    it('denies access for users without required role', async () => {
      mockAuthContext.user = {
        id: '123',
        email: 'test@example.com',
        role: 'attendant',
      };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute requiredRole="owner">
          <div>Owner Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText(/verificando permissões/i)).toBeInTheDocument();
      });

      expect(screen.queryByText('Owner Content')).not.toBeInTheDocument();
    });

    it('allows access for users with multiple required roles', () => {
      mockAuthContext.user = {
        id: '123',
        email: 'test@example.com',
        role: 'admin',
      };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute requiredRole="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('denies access when user role is not in required roles', async () => {
      mockAuthContext.user = {
        id: '123',
        email: 'test@example.com',
        role: 'attendant',
      };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute requiredRole="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText(/verificando permissões/i)).toBeInTheDocument();
      });

      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });
  });

  describe('Permission-Based Access Control', () => {
    it('allows access for users with required permission', () => {
      mockAuthContext.user = {
        id: '123',
        email: 'test@example.com',
        role: 'owner',
        permissions: ['manage_shop', 'manage_users'],
      };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute requiredPermissions={['manage_shop']}>
          <div>Shop Management Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Shop Management Content')).toBeInTheDocument();
    });

    it('denies access for users without required permission', async () => {
      mockAuthContext.user = {
        id: '123',
        email: 'test@example.com',
        role: 'attendant',
        permissions: ['view_appointments'],
      };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute requiredPermissions={['manage_shop']}>
          <div>Shop Management Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText(/verificando permissões/i)).toBeInTheDocument();
      });

      expect(
        screen.queryByText('Shop Management Content')
      ).not.toBeInTheDocument();
    });

    it('allows access for users with multiple required permissions', () => {
      mockAuthContext.user = {
        id: '123',
        email: 'test@example.com',
        role: 'admin',
        permissions: ['manage_shop', 'manage_users', 'view_reports'],
      };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute requiredPermissions={['manage_shop', 'manage_users']}>
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('denies access when user lacks any required permission', async () => {
      mockAuthContext.user = {
        id: '123',
        email: 'test@example.com',
        role: 'attendant',
        permissions: ['view_appointments'],
      };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute requiredPermissions={['manage_shop', 'manage_users']}>
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText(/verificando permissões/i)).toBeInTheDocument();
      });

      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });
  });

  describe('Fallback UI', () => {
    it('shows custom fallback when access is denied', async () => {
      mockAuthContext.user = {
        id: '123',
        email: 'test@example.com',
        role: 'attendant',
      };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute
          requiredRole="owner"
          fallback={<div>Custom Access Denied Message</div>}
        >
          <div>Owner Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(
          screen.getByText('Custom Access Denied Message')
        ).toBeInTheDocument();
      });

      expect(screen.queryByText('Owner Content')).not.toBeInTheDocument();
    });

    it('shows default fallback when no custom fallback is provided', async () => {
      mockAuthContext.user = {
        id: '123',
        email: 'test@example.com',
        role: 'attendant',
      };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute requiredRole="owner">
          <div>Owner Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText(/verificando permissões/i)).toBeInTheDocument();
      });
    });
  });

  describe('Redirect Behavior', () => {
    it('redirects to default login path when user is not authenticated', async () => {
      mockAuthContext.user = null;
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/signin');
      });
    });

    it('redirects to default login path when no custom path provided', async () => {
      mockAuthContext.user = null;
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/signin');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles user without role gracefully', async () => {
      mockAuthContext.user = {
        id: '123',
        email: 'test@example.com',
      };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute requiredRole="owner">
          <div>Owner Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText(/verificando permissões/i)).toBeInTheDocument();
      });
    });

    it('handles user with empty permissions array', async () => {
      mockAuthContext.user = {
        id: '123',
        email: 'test@example.com',
        role: 'attendant',
        permissions: [],
      };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute requiredPermissions={['manage_shop']}>
          <div>Shop Management Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText(/verificando permissões/i)).toBeInTheDocument();
      });
    });

    it('handles user with null permissions', async () => {
      mockAuthContext.user = {
        id: '123',
        email: 'test@example.com',
        role: 'attendant',
        permissions: null,
      };
      mockAuthContext.loading = false;

      render(
        <ProtectedRoute requiredPermissions={['manage_shop']}>
          <div>Shop Management Content</div>
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText(/verificando permissões/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner during authentication check', () => {
      mockAuthContext.loading = true;

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText(/carregando/i)).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('shows loading spinner during authentication check', () => {
      mockAuthContext.loading = true;

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText(/carregando/i)).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });
});
