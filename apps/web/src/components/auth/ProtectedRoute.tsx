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
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (!loading && user && requiredRole && user.role !== requiredRole) {
      router.push('/dashboard');
      return;
    }

    if (!loading && user && requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.some(permission =>
        user.permissions?.includes(permission)
      );

      if (!hasPermission) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, requiredRole, requiredPermissions, router]);

  // Show loading state while checking authentication
  if (loading) {
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
  if (!user) {
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
  if (requiredRole && user.role !== requiredRole) {
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
  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.some(permission =>
      user.permissions?.includes(permission)
    );

    if (!hasPermission) {
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
  return <>{children}</>;
}
