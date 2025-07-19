import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { userRoles, type UserRole } from '@/lib/auth-config';

export interface AuthUser extends User {
  role?: UserRole;
  shop_id?: string;
  permissions?: string[];
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export interface AuthActions {
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user: AuthUser | null; error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    userData: {
      name: string;
      role?: UserRole;
      shop_id?: string;
      shop_data?: any;
    }
  ) => Promise<{ user: AuthUser | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (
    updates: Partial<AuthUser>
  ) => Promise<{ user: AuthUser | null; error: AuthError | null }>;
  refreshSession: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true, // Start with loading true
    error: null,
  });

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('useAuth: Getting initial session...');
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log('useAuth: Initial session result:', {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          error: error?.message,
          sessionExpiresAt: session?.expires_at,
          sessionAccessToken: session?.access_token ? 'PRESENT' : 'MISSING',
        });

        if (error) {
          console.error('useAuth: Error getting session:', error);
          setState(prev => ({ ...prev, error, loading: false }));
          return;
        }

        if (session) {
          console.log('useAuth: Enriching user data...');
          const user = await enrichUserData(session.user);
          console.log('useAuth: User enriched:', {
            id: user.id,
            email: user.email,
            role: user.role,
            shop_id: user.shop_id,
          });
          setState({
            user,
            session,
            loading: false,
            error: null,
          });
        } else {
          console.log('useAuth: No session found');
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('useAuth: Exception getting initial session:', error);
        setState(prev => ({
          ...prev,
          error: error as AuthError,
          loading: false,
        }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('useAuth: Auth state changed:', event, {
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        sessionExpiresAt: session?.expires_at,
        sessionAccessToken: session?.access_token ? 'PRESENT' : 'MISSING',
      });

      setState(prev => ({ ...prev, loading: true }));

      if (session) {
        console.log('useAuth: Enriching user data for auth change...');
        const user = await enrichUserData(session.user);
        console.log('useAuth: User enriched for auth change:', {
          id: user.id,
          email: user.email,
          role: user.role,
          shop_id: user.shop_id,
        });
        setState({
          user,
          session,
          loading: false,
          error: null,
        });
      } else {
        console.log('useAuth: Session cleared');
        setState({
          user: null,
          session: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Enrich user data with role and permissions
  const enrichUserData = useCallback(async (user: User): Promise<AuthUser> => {
    try {
      // Get user profile from database
      const { data: profile, error } = await supabase
        .from('users')
        .select('role, shop_id, permissions')
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn('Error fetching user profile:', error);
        // Return user without enriched data if profile doesn't exist
        // This can happen during signup before the profile is created
        return {
          ...user,
          role: 'attendant' as UserRole, // Default role
          shop_id: undefined,
          permissions: [],
        } as AuthUser;
      }

      return {
        ...user,
        role: (profile?.role as UserRole) || 'attendant',
        shop_id: profile?.shop_id,
        permissions: profile?.permissions || [],
      };
    } catch (error) {
      console.error('Error enriching user data:', error);
      // Return user without enriched data on error
      return {
        ...user,
        role: 'attendant' as UserRole, // Default role
        shop_id: undefined,
        permissions: [],
      } as AuthUser;
    }
  }, []);

  // Sign in with email and password
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setState(prev => ({ ...prev, error, loading: false }));
          return { user: null, error };
        }

        if (data.user) {
          const enrichedUser = await enrichUserData(data.user);
          setState({
            user: enrichedUser,
            session: data.session,
            loading: false,
            error: null,
          });
          return { user: enrichedUser, error: null };
        }

        return { user: null, error: null };
      } catch (error) {
        const authError = error as AuthError;
        setState(prev => ({ ...prev, error: authError, loading: false }));
        return { user: null, error: authError };
      }
    },
    [enrichUserData]
  );

  // Sign up with email and password
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      userData: {
        name: string;
        role?: UserRole;
        shop_id?: string;
        shop_data?: any;
      }
    ) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // If shop_data is provided, save it to a temporary table for later use
        if (userData.shop_data) {
          const { error: tempShopError } = await supabase
            .from('temp_shop_data')
            .insert({
              email: email,
              shop_data: userData.shop_data,
              created_at: new Date().toISOString(),
            });

          if (tempShopError) {
            console.error('Error saving temporary shop data:', tempShopError);
          }
        }

        let data: any = null,
          error: AuthError | null = null;
        try {
          const result = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: userData.name,
                role: userData.role || userRoles.ATTENDANT,
                shop_id: userData.shop_id,
              },
              emailRedirectTo: `${window.location.origin}/auth/confirm`,
            },
          });

          data = result.data;
          error = result.error;
        } catch (signUpError) {
          console.error('Exception during supabase.auth.signUp:', signUpError);
          error = signUpError as AuthError;
          data = null;
        }

        if (error) {
          setState(prev => ({ ...prev, error, loading: false }));
          return { user: null, error };
        }

        // If user needs email confirmation, don't create profile yet
        if (data.user && !data.session) {
          // User needs to confirm email
          setState(prev => ({ ...prev, loading: false }));
          return { user: null, error: null };
        }

        if (data.user && data.session) {
          // User was confirmed immediately (rare case)
          const enrichedUser = await enrichUserData(data.user);
          setState({
            user: enrichedUser,
            session: data.session,
            loading: false,
            error: null,
          });
          return { user: enrichedUser, error: null };
        }

        return { user: null, error: null };
      } catch (error) {
        console.error('Error in signUp:', error);
        const authError = error as AuthError;
        setState(prev => ({ ...prev, error: authError, loading: false }));
        return { user: null, error: authError };
      }
    },
    [enrichUserData]
  );

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      const { error } = await supabase.auth.signOut();

      if (error) {
        setState(prev => ({ ...prev, error, loading: false }));
        return { error };
      }

      setState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      setState(prev => ({ ...prev, error: authError, loading: false }));
      return { error: authError };
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      setState(prev => ({ ...prev, loading: false }));

      if (error) {
        setState(prev => ({ ...prev, error }));
        return { error };
      }

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      setState(prev => ({ ...prev, error: authError, loading: false }));
      return { error: authError };
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.updateUser({
        password,
      });

      setState(prev => ({ ...prev, loading: false }));

      if (error) {
        setState(prev => ({ ...prev, error }));
        return { error };
      }

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      setState(prev => ({ ...prev, error: authError, loading: false }));
      return { error: authError };
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(
    async (updates: Partial<AuthUser>) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Update auth user data
        const { data, error } = await supabase.auth.updateUser({
          data: updates,
        });

        if (error) {
          setState(prev => ({ ...prev, error, loading: false }));
          return { user: null, error };
        }

        if (data.user) {
          // Update user profile in database
          const { error: profileError } = await supabase
            .from('users')
            .update(updates)
            .eq('id', data.user.id);

          if (profileError) {
            console.error('Error updating user profile:', profileError);
          }

          const enrichedUser = await enrichUserData(data.user);
          setState(prev => ({
            ...prev,
            user: enrichedUser,
            loading: false,
          }));
          return { user: enrichedUser, error: null };
        }

        return { user: null, error: null };
      } catch (error) {
        const authError = error as AuthError;
        setState(prev => ({ ...prev, error: authError, loading: false }));
        return { user: null, error: authError };
      }
    },
    [enrichUserData]
  );

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        setState(prev => ({ ...prev, error }));
        return;
      }

      if (data.session) {
        const user = await enrichUserData(data.session.user);
        setState(prev => ({
          ...prev,
          user,
          session: data.session,
          error: null,
        }));
      }
    } catch (error) {
      const authError = error as AuthError;
      setState(prev => ({ ...prev, error: authError }));
    }
  }, [enrichUserData]);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshSession,
  };
}
