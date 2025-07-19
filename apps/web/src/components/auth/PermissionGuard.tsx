'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/auth-config';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  fallback,
}: PermissionGuardProps) {
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

  // Check if user has required permission
  if (!user || !user.role || !hasPermission(user.role, permission)) {
    return (
      fallback || (
        <div className="flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Você não tem permissão para acessar esta funcionalidade.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

// Convenience components for specific permissions
export function ManageShopOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="manage_shop" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ManageUsersOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="manage_users" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ViewReportsOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="view_reports" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ManageAppointmentsOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="manage_appointments" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ManageClientsOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="manage_clients" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ManagePetsOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="manage_pets" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ManageGroomingsOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="manage_groomings" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ManageServicesOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="manage_services" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ManageProductsOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="manage_products" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ViewAuditLogsOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="view_audit_logs" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ManageSettingsOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="manage_settings" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}
