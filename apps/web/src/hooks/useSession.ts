import { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { authRedirectUrls } from '@/lib/auth-config';

interface SessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  session: any;
  error: string | null;
}

export function useSession() {
  const { user, session, loading, error } = useAuthContext();
  const [sessionState, setSessionState] = useState<SessionState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    session: null,
    error: null,
  });

  // Update session state when auth context changes
  useEffect(() => {
    setSessionState({
      isAuthenticated: !!user,
      isLoading: loading,
      user,
      session,
      error: error?.message || null,
    });
  }, [user, session, loading, error]);

  // Check if session is valid
  const isSessionValid = useCallback(() => {
    if (!session) return false;

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = session.expires_at;

    return expiresAt && expiresAt > now;
  }, [session]);

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }, []);

  // Sign out and redirect
  const signOut = useCallback(async (redirectTo?: string) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Redirect to specified URL or default sign-in page
      const redirectUrl = redirectTo || authRedirectUrls.signIn;
      window.location.href = redirectUrl;

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, []);

  // Get user permissions
  const getUserPermissions = useCallback(() => {
    return user?.permissions || [];
  }, [user]);

  // Check if user has specific permission
  const hasPermission = useCallback(
    (permission: string) => {
      const permissions = getUserPermissions();
      return permissions.includes(permission);
    },
    [getUserPermissions]
  );

  // Check if user has any of the specified permissions
  const hasAnyPermission = useCallback(
    (permissions: string[]) => {
      const userPermissions = getUserPermissions();
      return permissions.some(permission =>
        userPermissions.includes(permission)
      );
    },
    [getUserPermissions]
  );

  // Check if user has all of the specified permissions
  const hasAllPermissions = useCallback(
    (permissions: string[]) => {
      const userPermissions = getUserPermissions();
      return permissions.every(permission =>
        userPermissions.includes(permission)
      );
    },
    [getUserPermissions]
  );

  // Get user role
  const getUserRole = useCallback(() => {
    return user?.role || null;
  }, [user]);

  // Check if user has specific role
  const hasRole = useCallback(
    (role: string) => {
      return user?.role === role;
    },
    [user]
  );

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback(
    (roles: string[]) => {
      return user?.role && roles.includes(user.role);
    },
    [user]
  );

  return {
    ...sessionState,
    isSessionValid,
    refreshSession,
    signOut,
    getUserPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserRole,
    hasRole,
    hasAnyRole,
  };
}
