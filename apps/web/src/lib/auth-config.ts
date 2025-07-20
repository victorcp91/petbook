import type { SupabaseClientOptions } from '@supabase/supabase-js';

/**
 * Authentication Configuration for PetBook
 *
 * This file contains all authentication-related configuration including:
 * - Provider settings
 * - Security policies
 * - Brazilian-specific configurations
 * - MFA settings
 */

export interface PetBookAuthConfig {
  // Email/Password Authentication
  email: {
    enableSignup: boolean;
    enableConfirmations: boolean;
    doubleConfirmChanges: boolean;
    enableReconfirmations: boolean;
  };

  // Phone Authentication
  phone: {
    enableSignup: boolean;
    enableConfirmations: boolean;
    messageTemplate: string;
  };

  // Social Login Providers
  providers: {
    google: {
      enabled: boolean;
      clientId: string;
      clientSecret: string;
      redirectUrl: string;
    };
    facebook: {
      enabled: boolean;
      clientId: string;
      clientSecret: string;
      redirectUrl: string;
    };
    apple: {
      enabled: boolean;
      clientId: string;
      clientSecret: string;
      redirectUrl: string;
    };
  };

  // Security Settings
  security: {
    mfa: {
      enabled: boolean;
      factors: string[];
    };
    session: {
      lifetime: number; // in seconds
      refreshThreshold: number; // in seconds
    };
    rateLimit: {
      maxAttempts: number;
      windowSize: number; // in seconds
    };
  };

  // Brazilian-Specific Settings
  brazilian: {
    phoneFormat: string;
    cpfValidation: boolean;
    whatsappIntegration: boolean;
  };
}

/**
 * Default authentication configuration for PetBook
 */
export const defaultAuthConfig: PetBookAuthConfig = {
  email: {
    enableSignup: true,
    enableConfirmations: true,
    doubleConfirmChanges: true,
    enableReconfirmations: true,
  },

  phone: {
    enableSignup: false, // Disabled by default, can be enabled later
    enableConfirmations: true,
    messageTemplate: 'Seu código de verificação PetBook é: {{ .Code }}',
  },

  providers: {
    google: {
      enabled: false, // Can be enabled when OAuth credentials are set up
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
    facebook: {
      enabled: false,
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
    apple: {
      enabled: false,
      clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '',
      clientSecret: process.env.APPLE_CLIENT_SECRET || '',
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  },

  security: {
    mfa: {
      enabled: true,
      factors: ['totp'], // Time-based one-time password
    },
    session: {
      lifetime: 24 * 60 * 60, // 24 hours
      refreshThreshold: 60 * 60, // 1 hour
    },
    rateLimit: {
      maxAttempts: 5,
      windowSize: 15 * 60, // 15 minutes
    },
  },

  brazilian: {
    phoneFormat: '+55',
    cpfValidation: true,
    whatsappIntegration: true,
  },
};

/**
 * Supabase Auth configuration
 */
export const supabaseAuthConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' as const,
    debug: process.env.NODE_ENV === 'development',
  },
};

/**
 * Authentication redirect URLs
 */
export const authRedirectUrls = {
  signIn: '/auth/signin',
  signUp: '/auth/signup',
  signOut: '/auth/signout',
  callback: '/auth/callback',
  resetPassword: '/auth/reset-password',
  updatePassword: '/auth/update-password',
  verifyEmail: '/auth/verify-email',
  magicLink: '/auth/magic-link',
};

/**
 * User roles for PetBook
 */
export const userRoles = {
  OWNER: 'owner',
  ADMIN: 'admin',
  GROOMER: 'groomer',
  ATTENDANT: 'attendant',
} as const;

export type UserRole = (typeof userRoles)[keyof typeof userRoles];

/**
 * Role permissions mapping
 */
export const rolePermissions = {
  [userRoles.OWNER]: [
    'manage_shop',
    'manage_users',
    'view_reports',
    'manage_services',
    'manage_appointments',
    'manage_clients',
    'manage_pets',
    'manage_groomings',
    'manage_products',
    'view_audit_logs',
    'manage_settings',
  ],
  [userRoles.ADMIN]: [
    'manage_users',
    'view_reports',
    'manage_services',
    'manage_appointments',
    'manage_clients',
    'manage_pets',
    'manage_groomings',
    'manage_products',
    'view_audit_logs',
    'manage_settings',
  ],
  [userRoles.GROOMER]: [
    'view_appointments',
    'manage_groomings',
    'view_clients',
    'view_pets',
    'view_services',
    'view_products',
  ],
  [userRoles.ATTENDANT]: [
    'view_appointments',
    'manage_appointments',
    'view_clients',
    'manage_clients',
    'view_pets',
    'manage_pets',
    'view_services',
    'view_products',
  ],
} as const;

/**
 * Check if user has permission
 */
export function hasPermission(userRole: UserRole, permission: string): boolean {
  const permissions = rolePermissions[userRole] || [];
  return (permissions as readonly string[]).includes(permission);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): readonly string[] {
  return rolePermissions[role] || [];
}

/**
 * Brazilian phone number validation
 */
export function validateBrazilianPhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  // Brazilian phone numbers should be 10-11 digits (with or without country code)
  if (cleanPhone.length === 11 && cleanPhone.startsWith('55')) {
    // With country code: +55 11 99999-9999
    return true;
  } else if (cleanPhone.length === 10) {
    // Without country code: 11 99999-9999
    return true;
  } else if (cleanPhone.length === 11 && !cleanPhone.startsWith('55')) {
    // Mobile with 9: 11 99999-9999
    return true;
  }

  return false;
}

/**
 * Format Brazilian phone number
 */
export function formatBrazilianPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length === 11 && cleanPhone.startsWith('55')) {
    // +55 11 99999-9999
    return `+${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 4)} ${cleanPhone.slice(4, 9)}-${cleanPhone.slice(9)}`;
  } else if (cleanPhone.length === 10) {
    // 11 99999-9999
    return `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
  } else if (cleanPhone.length === 11 && !cleanPhone.startsWith('55')) {
    // 11 99999-9999
    return `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
  }

  return phone;
}

/**
 * CPF validation for Brazilian tax ID
 */
export function validateCPF(cpf: string): boolean {
  // Remove all non-digit characters
  const cleanCPF = cpf.replace(/\D/g, '');

  // CPF must have 11 digits
  if (cleanCPF.length !== 11) {
    return false;
  }

  // Check if all digits are the same (invalid CPF)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  // Validate first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF[9])) {
    return false;
  }

  // Validate second digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF[10])) {
    return false;
  }

  return true;
}

/**
 * Format CPF for display
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
