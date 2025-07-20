/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        /* PetBook Brand Colors (from styleguide.json) */
        petbook: {
          primary: '#00897B', // Main brand color (teal)
          primaryDark: '#00695C', // Darker variant
          primaryLight: '#4DB6AC', // Lighter variant
          text: {
            primary: '#111827', // Dark blue-gray
            secondary: '#4B5563', // Medium gray
            muted: '#6B7280', // Light gray
          },
          background: {
            primary: '#FAFBFC', // Very light gray
            secondary: '#FFFFFF', // White
            card: '#FFFFFF', // Card background
          },
          border: '#E5E7EB', // Light gray border
        },

        /* Status Colors for PetBook */
        status: {
          queued: {
            DEFAULT: '#F59E0B', // Amber
            light: '#FCD34D',
            dark: '#D97706',
            foreground: '#92400E',
          },
          inProgress: {
            DEFAULT: '#00897B', // PetBook brand color
            light: '#4DB6AC',
            dark: '#00695C',
            foreground: '#FFFFFF',
          },
          completed: {
            DEFAULT: '#10B981', // Emerald
            light: '#34D399',
            dark: '#059669',
            foreground: '#064E3B',
          },
          cancelled: {
            DEFAULT: '#EF4444', // Red
            light: '#F87171',
            dark: '#DC2626',
            foreground: '#7F1D1D',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // PetBook 8px grid system
        0.5: '4px',
        1: '8px',
        1.5: '12px',
        2: '16px',
        2.5: '20px',
        3: '24px',
        3.5: '28px',
        4: '32px',
        5: '40px',
        6: '48px',
        7: '56px',
        8: '64px',
        9: '72px',
        10: '80px',
        11: '88px',
        12: '96px',
        14: '112px',
        16: '128px',
        20: '160px',
        24: '192px',
        28: '224px',
        32: '256px',
        36: '288px',
        40: '320px',
        44: '352px',
        48: '384px',
        52: '416px',
        56: '448px',
        60: '480px',
        64: '512px',
        72: '576px',
        80: '640px',
        96: '768px',
      },
      fontSize: {
        // PetBook typography scale
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
      boxShadow: {
        // PetBook shadow system
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT:
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        none: 'none',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
