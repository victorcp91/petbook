/**
 * Security hook for PetBook
 *
 * This hook provides security utilities that can be used in forms
 * without modifying the existing working forms.
 */

import { useState, useCallback } from 'react';
import {
  isRateLimited,
  recordAttempt,
  resetRateLimit,
  getRemainingAttempts,
  getRateLimitResetTime,
  validateEmail,
  validatePassword,
  validateBrazilianPhone,
  validateBrazilianCPF,
  sanitizeHtml,
  logSecurityEvent,
  SECURITY_EVENTS,
} from '@/lib/security';

interface SecurityState {
  isRateLimited: boolean;
  remainingAttempts: number;
  resetTime: number | null;
  lastAttempt: number | null;
}

export function useSecurity(identifier: string) {
  const [securityState, setSecurityState] = useState<SecurityState>({
    isRateLimited: false,
    remainingAttempts: 5,
    resetTime: null,
    lastAttempt: null,
  });

  // Check rate limiting status
  const checkRateLimit = useCallback(() => {
    const isLimited = isRateLimited(identifier);
    const remaining = getRemainingAttempts(identifier);
    const resetTime = getRateLimitResetTime(identifier);

    setSecurityState({
      isRateLimited: isLimited,
      remainingAttempts: remaining,
      resetTime,
      lastAttempt: Date.now(),
    });

    return { isLimited, remaining, resetTime };
  }, [identifier]);

  // Record an attempt
  const recordSecurityAttempt = useCallback(() => {
    recordAttempt(identifier);
    checkRateLimit();
  }, [identifier, checkRateLimit]);

  // Reset rate limiting (used after successful authentication)
  const resetSecurityLimit = useCallback(() => {
    resetRateLimit(identifier);
    setSecurityState({
      isRateLimited: false,
      remainingAttempts: 5,
      resetTime: null,
      lastAttempt: Date.now(),
    });
  }, [identifier]);

  // Validate email with security checks
  const validateEmailSecurity = useCallback(
    (email: string) => {
      const result = validateEmail(email);

      if (!result.isValid) {
        logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
          identifier,
          event: 'invalid_email_attempt',
          email,
          reason: result.error,
        });
      }

      return result;
    },
    [identifier]
  );

  // Validate password with security checks
  const validatePasswordSecurity = useCallback(
    (password: string) => {
      const result = validatePassword(password);

      if (!result.isValid) {
        logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
          identifier,
          event: 'weak_password_attempt',
          reason: result.error,
        });
      }

      return result;
    },
    [identifier]
  );

  // Validate Brazilian phone with security checks
  const validatePhoneSecurity = useCallback(
    (phone: string) => {
      const result = validateBrazilianPhone(phone);

      if (!result.isValid) {
        logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
          identifier,
          event: 'invalid_phone_attempt',
          phone,
          reason: result.error,
        });
      }

      return result;
    },
    [identifier]
  );

  // Validate Brazilian CPF with security checks
  const validateCPFSecurity = useCallback(
    (cpf: string) => {
      const result = validateBrazilianCPF(cpf);

      if (!result.isValid) {
        logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
          identifier,
          event: 'invalid_cpf_attempt',
          cpf,
          reason: result.error,
        });
      }

      return result;
    },
    [identifier]
  );

  // Sanitize input
  const sanitizeInput = useCallback((input: string) => {
    return sanitizeHtml(input);
  }, []);

  // Log security event
  const logSecurityEventWithContext = useCallback(
    (event: string, details: Record<string, any> = {}) => {
      logSecurityEvent(event, {
        identifier,
        ...details,
      });
    },
    [identifier]
  );

  // Get formatted reset time
  const getFormattedResetTime = useCallback(() => {
    if (!securityState.resetTime) return null;

    const minutes = Math.ceil(securityState.resetTime / (1000 * 60));
    return `${minutes} minutos`;
  }, [securityState.resetTime]);

  // Check if form should be disabled due to rate limiting
  const isFormDisabled = useCallback(() => {
    return securityState.isRateLimited;
  }, [securityState.isRateLimited]);

  // Get rate limit message
  const getRateLimitMessage = useCallback(() => {
    if (!securityState.isRateLimited) return null;

    const resetTime = getFormattedResetTime();
    return `Muitas tentativas. Tente novamente em ${resetTime}.`;
  }, [securityState.isRateLimited, getFormattedResetTime]);

  return {
    // State
    securityState,

    // Rate limiting
    checkRateLimit,
    recordSecurityAttempt,
    resetSecurityLimit,
    isFormDisabled,
    getRateLimitMessage,
    getFormattedResetTime,

    // Validation
    validateEmailSecurity,
    validatePasswordSecurity,
    validatePhoneSecurity,
    validateCPFSecurity,
    sanitizeInput,

    // Logging
    logSecurityEventWithContext,

    // Utility
    remainingAttempts: securityState.remainingAttempts,
    isRateLimited: securityState.isRateLimited,
  };
}

/**
 * Hook for authentication security
 */
export function useAuthSecurity(email: string) {
  const identifier = `auth-${email}`;
  const security = useSecurity(identifier);

  // Log authentication attempt
  const logAuthAttempt = useCallback(
    (success: boolean, error?: string) => {
      const event = success
        ? SECURITY_EVENTS.LOGIN_SUCCESS
        : SECURITY_EVENTS.LOGIN_FAILURE;

      security.logSecurityEventWithContext(event, {
        email,
        success,
        error,
      });

      if (success) {
        security.resetSecurityLimit();
      } else {
        security.recordSecurityAttempt();
      }
    },
    [email, security]
  );

  return {
    ...security,
    logAuthAttempt,
  };
}

/**
 * Hook for signup security
 */
export function useSignupSecurity(email: string) {
  const identifier = `signup-${email}`;
  const security = useSecurity(identifier);

  // Log signup attempt
  const logSignupAttempt = useCallback(
    (success: boolean, error?: string) => {
      const event = success
        ? SECURITY_EVENTS.SIGNUP_SUCCESS
        : SECURITY_EVENTS.SIGNUP_FAILURE;

      security.logSecurityEventWithContext(event, {
        email,
        success,
        error,
      });

      if (success) {
        security.resetSecurityLimit();
      } else {
        security.recordSecurityAttempt();
      }
    },
    [email, security]
  );

  return {
    ...security,
    logSignupAttempt,
  };
}
