'use client';

import { useEffect, useRef } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface SessionProviderProps {
  children: React.ReactNode;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export function SessionProvider({
  children,
  autoRefresh = true,
  refreshInterval = 5 * 60 * 1000, // 5 minutes
}: SessionProviderProps) {
  const { session, refreshSession } = useAuthContext();
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Set up automatic session refresh
  useEffect(() => {
    if (!autoRefresh || !session) {
      return;
    }

    const setupRefreshTimer = () => {
      // Clear existing timer
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      // Calculate time until session expires
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at;

      if (!expiresAt) {
        return;
      }

      const timeUntilExpiry = (expiresAt - now) * 1000; // Convert to milliseconds
      const refreshTime = Math.max(timeUntilExpiry - refreshInterval, 0);

      // Set timer to refresh session before it expires
      refreshTimerRef.current = setTimeout(async () => {
        try {
          await refreshSession();
        } catch (error) {
          console.error('Failed to refresh session:', error);
        }
      }, refreshTime);
    };

    setupRefreshTimer();

    // Cleanup timer on unmount or session change
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [session, autoRefresh, refreshInterval, refreshSession]);

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      // Handle specific auth events
      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in');
          break;
        case 'SIGNED_OUT':
          console.log('User signed out');
          break;
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed');
          break;
        case 'USER_UPDATED':
          console.log('User updated');
          break;
        default:
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
