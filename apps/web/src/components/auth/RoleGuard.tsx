'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { userRoles, type UserRole } from '@/lib/auth-config';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const { user, loading } = useAuthContext();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <div className="flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Você não tem permissão para acessar esta página.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function OwnerOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={[userRoles.OWNER]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AdminOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard
      allowedRoles={[userRoles.OWNER, userRoles.ADMIN]}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}

export function GroomerOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard
      allowedRoles={[userRoles.OWNER, userRoles.ADMIN, userRoles.GROOMER]}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}

export function AttendantOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard
      allowedRoles={[userRoles.OWNER, userRoles.ADMIN, userRoles.ATTENDANT]}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}
