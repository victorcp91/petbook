'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermissions = [],
  fallback,
}: ProtectedRouteProps) {
  const { user, loading, session } = useAuthContext();
  const router = useRouter();

  console.log('ProtectedRoute - State:', {
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    userRole: user?.role,
    loading,
    hasSession: !!session,
    requiredRole,
    requiredPermissions,
  });

  useEffect(() => {
    console.log('ProtectedRoute - useEffect triggered:', {
      loading,
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      hasSession: !!session,
    });

    // Wait for auth to be fully initialized (not loading and session checked)
    if (loading) {
      console.log('ProtectedRoute - Still loading, waiting...');
      return;
    }

    // If no session and not loading, redirect to signin
    if (!session && !user) {
      console.log('ProtectedRoute - No session or user, redirecting to signin');
      router.push('/auth/signin');
      return;
    }

    // If user exists but role doesn't match required role
    if (user && requiredRole && user.role !== requiredRole) {
      console.log('ProtectedRoute - Wrong role, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }

    // If user exists but doesn't have required permissions
    if (user && requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.some(permission =>
        user.permissions?.includes(permission)
      );

      if (!hasPermission) {
        console.log('ProtectedRoute - No permission, redirecting to dashboard');
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, session, requiredRole, requiredPermissions, router]);

  // Show loading state while checking authentication
  if (loading) {
    console.log('ProtectedRoute - Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show fallback or redirect if not authenticated
  if (!user && !session) {
    console.log('ProtectedRoute - No user or session, showing fallback');
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Redirecionando...</p>
          </div>
        </div>
      )
    );
  }

  // Check role requirements
  if (requiredRole && user && user.role !== requiredRole) {
    console.log('ProtectedRoute - Wrong role, showing fallback');
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Verificando permissões...</p>
          </div>
        </div>
      )
    );
  }

  // Check permission requirements
  if (user && requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.some(permission =>
      user.permissions?.includes(permission)
    );

    if (!hasPermission) {
      console.log('ProtectedRoute - No permission, showing fallback');
      return (
        fallback || (
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Verificando permissões...</p>
            </div>
          </div>
        )
      );
    }
  }

  // User is authenticated and has required permissions
  console.log('ProtectedRoute - Rendering children');
  return <>{children}</>;
}
