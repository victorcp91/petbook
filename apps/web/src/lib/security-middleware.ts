/**
 * Security middleware for PetBook
 *
 * This middleware adds security measures to API routes and pages
 * without modifying existing forms.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  isRateLimited,
  recordAttempt,
  getSecurityHeaders,
  logSecurityEvent,
  SECURITY_EVENTS,
  detectSuspiciousActivity,
} from './security';

/**
 * Security middleware for API routes
 */
export function securityMiddleware(req: NextRequest): NextResponse | null {
  const response = NextResponse.next();

  // Add security headers
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Get client IP
  const clientIP =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';

  // Check rate limiting for auth endpoints
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    const identifier = `${clientIP}-${req.nextUrl.pathname}`;

    if (isRateLimited(identifier)) {
      // Log rate limit exceeded
      logSecurityEvent(SECURITY_EVENTS.RATE_LIMIT_EXCEEDED, {
        ip: clientIP,
        path: req.nextUrl.pathname,
        userAgent: req.headers.get('user-agent'),
      });

      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded. Please try again later.',
          remainingTime: '30 minutes',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Record attempt
    recordAttempt(identifier);
  }

  // Detect suspicious activity
  const userAgent = req.headers.get('user-agent') || '';
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /php/i,
    /java/i,
  ];

  const isSuspicious = suspiciousPatterns.some(pattern =>
    pattern.test(userAgent)
  );

  if (isSuspicious) {
    logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
      ip: clientIP,
      userAgent,
      path: req.nextUrl.pathname,
      reason: 'Suspicious user agent detected',
    });
  }

  return response;
}

/**
 * Enhanced security middleware with additional checks
 */
export function enhancedSecurityMiddleware(
  req: NextRequest
): NextResponse | null {
  const response = NextResponse.next();

  // Add security headers
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Get client IP
  const clientIP =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';

  // Additional security checks
  const path = req.nextUrl.pathname;
  const method = req.method;
  const userAgent = req.headers.get('user-agent') || '';

  // Block suspicious requests
  if (shouldBlockRequest(path, method, userAgent, clientIP)) {
    logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
      ip: clientIP,
      userAgent,
      path,
      method,
      reason: 'Request blocked by security rules',
    });

    return new NextResponse(
      JSON.stringify({ error: 'Request blocked for security reasons' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Rate limiting for sensitive endpoints
  if (isSensitiveEndpoint(path)) {
    const identifier = `${clientIP}-${path}`;

    if (isRateLimited(identifier)) {
      logSecurityEvent(SECURITY_EVENTS.RATE_LIMIT_EXCEEDED, {
        ip: clientIP,
        path,
        userAgent,
      });

      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests. Please try again later.',
          remainingTime: '15 minutes',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    recordAttempt(identifier);
  }

  return response;
}

/**
 * Check if request should be blocked
 */
function shouldBlockRequest(
  path: string,
  method: string,
  userAgent: string,
  clientIP: string
): boolean {
  // Block requests with suspicious user agents
  const suspiciousUserAgents = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /php/i,
    /java/i,
    /perl/i,
    /ruby/i,
    /go-http-client/i,
    /httpclient/i,
    /okhttp/i,
    /requests/i,
    /urllib/i,
  ];

  if (suspiciousUserAgents.some(pattern => pattern.test(userAgent))) {
    return true;
  }

  // Block requests to sensitive paths with suspicious methods
  const sensitivePaths = ['/api/auth', '/api/admin', '/api/users'];
  const suspiciousMethods = ['PUT', 'DELETE', 'PATCH'];

  if (
    sensitivePaths.some(sensitivePath => path.startsWith(sensitivePath)) &&
    suspiciousMethods.includes(method)
  ) {
    return true;
  }

  // Block requests with suspicious headers
  const suspiciousHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-forwarded-proto',
    'x-forwarded-host',
  ];

  // Additional checks can be added here
  return false;
}

/**
 * Check if endpoint is sensitive and needs rate limiting
 */
function isSensitiveEndpoint(path: string): boolean {
  const sensitiveEndpoints = [
    '/api/auth/signin',
    '/api/auth/signup',
    '/api/auth/reset-password',
    '/api/auth/update-password',
    '/api/admin',
    '/api/users',
  ];

  return sensitiveEndpoints.some(endpoint => path.startsWith(endpoint));
}

/**
 * Security middleware for authentication endpoints
 */
export function authSecurityMiddleware(req: NextRequest): NextResponse | null {
  const response = NextResponse.next();

  // Add security headers
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Get client IP
  const clientIP =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const path = req.nextUrl.pathname;
  const userAgent = req.headers.get('user-agent') || '';

  // Rate limiting for auth endpoints
  if (path.startsWith('/api/auth')) {
    const identifier = `${clientIP}-${path}`;

    if (isRateLimited(identifier)) {
      logSecurityEvent(SECURITY_EVENTS.RATE_LIMIT_EXCEEDED, {
        ip: clientIP,
        path,
        userAgent,
      });

      return new NextResponse(
        JSON.stringify({
          error: 'Too many authentication attempts. Please try again later.',
          remainingTime: '15 minutes',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    recordAttempt(identifier);
  }

  // Log authentication attempts
  if (path.includes('/signin') || path.includes('/signup')) {
    logSecurityEvent(SECURITY_EVENTS.LOGIN_ATTEMPT, {
      ip: clientIP,
      path,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  return response;
}

/**
 * Security middleware for admin endpoints
 */
export function adminSecurityMiddleware(req: NextRequest): NextResponse | null {
  const response = NextResponse.next();

  // Add security headers
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Get client IP
  const clientIP =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const path = req.nextUrl.pathname;
  const userAgent = req.headers.get('user-agent') || '';

  // Log admin access attempts
  if (path.startsWith('/api/admin')) {
    logSecurityEvent('admin_access_attempt', {
      ip: clientIP,
      path,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  return response;
}
