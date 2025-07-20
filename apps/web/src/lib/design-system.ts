/**
 * PetBook Design System Configuration
 *
 * This file contains all design tokens, color palettes, typography scales,
 * spacing guidelines, and component specifications for the PetBook application.
 *
 * Colors extracted from styleguide.json Figma design file.
 */

// Color Palette
export const colors = {
  // Brand Colors (from styleguide.json)
  brand: {
    primary: '#00897B', // Main brand color (teal)
    primaryDark: '#00695C', // Darker variant
    primaryLight: '#4DB6AC', // Lighter variant
  },

  // Text Colors
  text: {
    primary: '#111827', // Dark blue-gray
    secondary: '#4B5563', // Medium gray
    muted: '#6B7280', // Light gray
    white: '#FFFFFF', // White text
  },

  // Background Colors
  background: {
    primary: '#FAFBFC', // Very light gray
    secondary: '#FFFFFF', // White
    card: '#FFFFFF', // Card background
  },

  // Border Colors
  border: '#E5E7EB', // Light gray border

  // Status Colors
  status: {
    queued: {
      light: '#F59E0B', // Amber
      dark: '#D97706',
      foreground: '#92400E',
    },
    inProgress: {
      light: '#00897B', // PetBook brand color
      dark: '#00695C',
      foreground: '#FFFFFF',
    },
    completed: {
      light: '#10B981', // Emerald
      dark: '#059669',
      foreground: '#064E3B',
    },
    cancelled: {
      light: '#EF4444', // Red
      dark: '#DC2626',
      foreground: '#7F1D1D',
    },
  },
};

// Typography Scale
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: ['12px', { lineHeight: '16px' }],
    sm: ['14px', { lineHeight: '20px' }],
    base: ['16px', { lineHeight: '24px' }],
    lg: ['18px', { lineHeight: '28px' }],
    xl: ['20px', { lineHeight: '28px' }],
    '2xl': ['24px', { lineHeight: '32px' }],
    '3xl': ['30px', { lineHeight: '36px' }],
    '4xl': ['36px', { lineHeight: '40px' }],
    '5xl': ['48px', { lineHeight: '48px' }],
    '6xl': ['60px', { lineHeight: '60px' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Spacing Scale (8px grid system)
export const spacing = {
  '0.5': '4px',
  '1': '8px',
  '1.5': '12px',
  '2': '16px',
  '2.5': '20px',
  '3': '24px',
  '3.5': '28px',
  '4': '32px',
  '5': '40px',
  '6': '48px',
  '7': '56px',
  '8': '64px',
  '9': '72px',
  '10': '80px',
  '11': '88px',
  '12': '96px',
  '14': '112px',
  '16': '128px',
  '20': '160px',
  '24': '192px',
  '28': '224px',
  '32': '256px',
  '36': '288px',
  '40': '320px',
  '44': '352px',
  '48': '384px',
  '52': '416px',
  '56': '448px',
  '60': '480px',
  '64': '512px',
  '72': '576px',
  '80': '640px',
  '96': '768px',
};

// Border Radius
export const borderRadius = {
  none: '0px',
  sm: '2px',
  DEFAULT: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

// Component Specifications
export const components = {
  // Button Specifications
  button: {
    sizes: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    },
    variants: {
      primary: 'bg-petbook-primary text-white hover:bg-petbook-primary-dark',
      secondary:
        'bg-petbook-background-secondary text-petbook-text-primary border-petbook-border',
      outline:
        'border-petbook-border text-petbook-text-primary hover:bg-petbook-background-primary',
      ghost: 'text-petbook-text-primary hover:bg-petbook-background-primary',
    },
  },

  // Card Specifications
  card: {
    base: 'bg-petbook-background-secondary border border-petbook-border rounded-lg shadow-sm',
    header: 'px-6 py-4 border-b border-petbook-border',
    content: 'px-6 py-4',
    footer: 'px-6 py-4 border-t border-petbook-border',
  },

  // Input Specifications
  input: {
    base: 'flex h-10 w-full rounded-md border border-petbook-border bg-petbook-background-secondary px-3 py-2 text-sm',
    focus: 'ring-2 ring-petbook-primary ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
  },

  // Badge Specifications
  badge: {
    base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
    status: {
      queued: 'bg-status-queued text-status-queued-foreground',
      'in-progress': 'bg-status-inProgress text-status-inProgress-foreground',
      completed: 'bg-status-completed text-status-completed-foreground',
      cancelled: 'bg-status-cancelled text-status-cancelled-foreground',
    },
  },
};

// Design Tokens for CSS Variables
export const designTokens = {
  colors: {
    // PetBook Brand Colors
    'petbook-primary': '#00897B',
    'petbook-primary-dark': '#00695C',
    'petbook-primary-light': '#4DB6AC',
    'petbook-text-primary': '#111827',
    'petbook-text-secondary': '#4B5563',
    'petbook-text-muted': '#6B7280',
    'petbook-background-primary': '#FAFBFC',
    'petbook-background-secondary': '#FFFFFF',
    'petbook-border': '#E5E7EB',

    // Status Colors
    'status-queued': '#F59E0B',
    'status-queued-foreground': '#92400E',
    'status-in-progress': '#00897B',
    'status-in-progress-foreground': '#FFFFFF',
    'status-completed': '#10B981',
    'status-completed-foreground': '#064E3B',
    'status-cancelled': '#EF4444',
    'status-cancelled-foreground': '#7F1D1D',
  },
};

// Usage Guidelines
export const guidelines = {
  // Color Usage
  colorUsage: {
    primary: 'Use for primary actions, brand elements, and key UI elements',
    secondary: 'Use for secondary actions and supporting UI elements',
    status: 'Use for indicating state and progress',
    text: 'Use for typography hierarchy and readability',
  },

  // Spacing Guidelines
  spacing: {
    component: 'Use 8px grid system for consistent spacing',
    touch: 'Minimum 48px (6 units) for touch targets',
    content: 'Use 16px (2 units) for content spacing',
    section: 'Use 32px (4 units) for section spacing',
  },

  // Typography Guidelines
  typography: {
    hierarchy: 'Use font size and weight to establish visual hierarchy',
    readability: 'Ensure sufficient contrast for accessibility',
    consistency: 'Use consistent font families throughout the application',
  },

  // Component Guidelines
  components: {
    consistency: 'Use consistent styling patterns across similar components',
    accessibility: 'Ensure all components meet WCAG guidelines',
    responsive: 'Design components to work across different screen sizes',
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  designTokens,
  guidelines,
};
