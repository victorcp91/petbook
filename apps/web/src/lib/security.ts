/**
 * Security utilities for PetBook
 *
 * This file contains security-related utilities including:
 * - Rate limiting
 * - Input sanitization
 * - Audit logging
 * - Security validation
 */

import { supabase } from './supabase';

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowSize: 15 * 60 * 1000, // 15 minutes in milliseconds
  blockDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
};

/**
 * Check if an IP or email is rate limited
 */
export function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record) {
    return false;
  }

  // Check if the window has expired
  if (now > record.resetTime) {
    rateLimitStore.delete(identifier);
    return false;
  }

  // Check if blocked
  if (record.count >= RATE_LIMIT_CONFIG.maxAttempts) {
    return true;
  }

  return false;
}

/**
 * Record an attempt for rate limiting
 */
export function recordAttempt(identifier: string): void {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowSize,
    });
    return;
  }

  // Check if window has expired
  if (now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowSize,
    });
    return;
  }

  // Increment count
  record.count++;
  rateLimitStore.set(identifier, record);
}

/**
 * Reset rate limiting for an identifier (used after successful login)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Get remaining attempts for an identifier
 */
export function getRemainingAttempts(identifier: string): number {
  const record = rateLimitStore.get(identifier);

  if (!record) {
    return RATE_LIMIT_CONFIG.maxAttempts;
  }

  const now = Date.now();
  if (now > record.resetTime) {
    return RATE_LIMIT_CONFIG.maxAttempts;
  }

  return Math.max(0, RATE_LIMIT_CONFIG.maxAttempts - record.count);
}

/**
 * Get time until rate limit resets
 */
export function getRateLimitResetTime(identifier: string): number | null {
  const record = rateLimitStore.get(identifier);

  if (!record) {
    return null;
  }

  const now = Date.now();
  if (now > record.resetTime) {
    return null;
  }

  return record.resetTime - now;
}

/**
 * Sanitize HTML input to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate email format and block temporary email domains
 */
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }

  // Block temporary email domains
  const tempEmailDomains = [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'tempmail.org',
    'throwaway.email',
    'temp-mail.org',
    'sharklasers.com',
    'getairmail.com',
    'mailnesia.com',
    'yopmail.com',
    'dispostable.com',
    'maildrop.cc',
    'tempmailaddress.com',
    'fakeinbox.com',
    'mailmetrash.com',
    'spam4.me',
    'bccto.me',
    'chacuo.net',
    'dispostable.com',
    'mailnesia.com',
    'mailnull.com',
    'spammotel.com',
    'spamspot.com',
    'spam.la',
    'tempinbox.com',
    'tmpeml.com',
    'trashmail.net',
    'guerrillamailblock.com',
    'pokemail.net',
    'spam4.me',
    'bccto.me',
    'chacuo.net',
    'dispostable.com',
    'mailnesia.com',
    'mailnull.com',
    'spammotel.com',
    'spamspot.com',
    'spam.la',
    'tempinbox.com',
    'tmpeml.com',
    'trashmail.net',
    'guerrillamailblock.com',
    'pokemail.net',
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && tempEmailDomains.includes(domain)) {
    return {
      isValid: false,
      error: 'Domínios de email temporário não são permitidos',
    };
  }

  return { isValid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (password.length < 8) {
    return { isValid: false, error: 'Senha deve ter pelo menos 8 caracteres' };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Senha deve conter pelo menos uma letra maiúscula',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Senha deve conter pelo menos uma letra minúscula',
    };
  }

  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Senha deve conter pelo menos um número' };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Senha deve conter pelo menos um caractere especial',
    };
  }

  return { isValid: true };
}

/**
 * Log security events for audit
 */
export async function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  userId?: string
): Promise<void> {
  try {
    const logData = {
      event,
      details,
      user_id: userId,
      ip_address: 'client-ip', // Will be set by middleware
      user_agent:
        typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      timestamp: new Date().toISOString(),
    };

    // Log to Supabase audit_logs table
    const { error } = await supabase.from('audit_logs').insert([logData]);

    if (error) {
      console.error('Failed to log security event:', error);
    }
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}

/**
 * Security event types
 */
export const SECURITY_EVENTS = {
  LOGIN_ATTEMPT: 'login_attempt',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  SIGNUP_ATTEMPT: 'signup_attempt',
  SIGNUP_SUCCESS: 'signup_success',
  SIGNUP_FAILURE: 'signup_failure',
  PASSWORD_RESET_REQUEST: 'password_reset_request',
  PASSWORD_RESET_SUCCESS: 'password_reset_success',
  PASSWORD_RESET_FAILURE: 'password_reset_failure',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  ACCOUNT_LOCKED: 'account_locked',
  SESSION_EXPIRED: 'session_expired',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
} as const;

/**
 * Check for suspicious activity patterns
 */
export function detectSuspiciousActivity(
  identifier: string,
  event: string,
  details: Record<string, any>
): boolean {
  // Multiple failed login attempts
  if (event === SECURITY_EVENTS.LOGIN_FAILURE) {
    const record = rateLimitStore.get(identifier);
    if (record && record.count >= 3) {
      return true;
    }
  }

  // Rapid successive attempts
  const now = Date.now();
  const recentAttempts = Array.from(rateLimitStore.entries()).filter(
    ([key, value]) => key.includes(identifier) && now - value.resetTime < 60000
  ).length;

  if (recentAttempts > 10) {
    return true;
  }

  return false;
}

/**
 * Generate security headers for responses
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none';",
  };
}

/**
 * Validate Brazilian phone number
 */
export function validateBrazilianPhone(phone: string): {
  isValid: boolean;
  error?: string;
} {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  // Brazilian phone numbers should have 10-11 digits (with or without area code)
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return { isValid: false, error: 'Número de telefone inválido' };
  }

  // Check if it starts with a valid area code (11-99)
  const areaCode = cleanPhone.substring(0, 2);
  if (parseInt(areaCode) < 11 || parseInt(areaCode) > 99) {
    return { isValid: false, error: 'Código de área inválido' };
  }

  return { isValid: true };
}

/**
 * Validate Brazilian CPF
 */
export function validateBrazilianCPF(cpf: string): {
  isValid: boolean;
  error?: string;
} {
  // Remove all non-digit characters
  const cleanCPF = cpf.replace(/\D/g, '');

  // CPF must have exactly 11 digits
  if (cleanCPF.length !== 11) {
    return { isValid: false, error: 'CPF deve ter 11 dígitos' };
  }

  // Check for known invalid CPFs
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return { isValid: false, error: 'CPF inválido' };
  }

  // Validate CPF algorithm
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) {
    return { isValid: false, error: 'CPF inválido' };
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) {
    return { isValid: false, error: 'CPF inválido' };
  }

  return { isValid: true };
}
