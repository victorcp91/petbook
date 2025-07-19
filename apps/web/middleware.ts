import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSecurityHeaders } from '@/lib/security';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Add security headers to all responses
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.headers.set(key, value);
  });

  // Get the current session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // If there's an error with the session, try to refresh it
  if (error && !session) {
    try {
      const { data: refreshData } = await supabase.auth.refreshSession();
      if (refreshData.session) {
        console.log('Session refreshed in middleware');
      }
    } catch (refreshError) {
      console.error('Failed to refresh session in middleware:', refreshError);
    }
  }

  // Get the current session (after potential refresh)
  const {
    data: { session: currentSession },
  } = await supabase.auth.getSession();

  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/admin',
    '/profile',
    '/settings',
    '/appointments',
    '/clients',
    '/pets',
    '/services',
    '/reports',
  ];

  // Define auth routes (routes that should redirect to dashboard if user is authenticated)
  const authRoutes = [
    '/auth/signin',
    '/auth/signup',
    '/auth/login',
    '/auth/reset-password',
  ];

  const { pathname } = req.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If user is not authenticated and trying to access a protected route
  if (!currentSession && isProtectedRoute) {
    const redirectUrl = new URL('/auth/signin', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated and trying to access an auth route
  if (currentSession && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If user is authenticated and accessing the root path
  if (currentSession && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If user is not authenticated and accessing the root path
  if (!currentSession && pathname === '/') {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
