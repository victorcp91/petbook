'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import {
  useAuth,
  type AuthUser,
  type AuthState,
  type AuthActions,
} from '@/hooks/useAuth';

interface AuthContextType extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}

// Convenience hooks for specific auth states
export function useUser(): AuthUser | null {
  const { user } = useAuthContext();
  return user;
}

export function useSession() {
  const { session } = useAuthContext();
  return session;
}

export function useAuthLoading(): boolean {
  const { loading } = useAuthContext();
  return loading;
}

export function useAuthError() {
  const { error } = useAuthContext();
  return error;
}

export function useIsAuthenticated(): boolean {
  const { user } = useAuthContext();
  return user !== null;
}

export function useIsLoading(): boolean {
  const { loading } = useAuthContext();
  return loading;
}
