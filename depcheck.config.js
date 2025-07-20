module.exports = {
  ignore: [
    // Radix UI components
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-dialog',
    '@radix-ui/react-select',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    '@radix-ui/react-toast',
    '@radix-ui/react-tooltip',

    // Next.js and related
    'next',
    'next-pwa',
    '@supabase/auth-helpers-nextjs',

    // Testing libraries
    '@testing-library/react',
    '@testing-library/user-event',
    '@testing-library/jest-dom',
    '@types/jest',
    '@types/node',

    // ESLint and TypeScript
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-config-next',
    'eslint-config-prettier',
    'eslint-plugin-testing-library',

    // Cypress
    '@cypress/code-coverage',
    '@cypress/vite-dev-server',
    'cypress-multi-reporters',

    // Other tools
    'lighthouse',
    'mocha-junit-reporter',
    'wait-on',
    'dotenv',
    'react',
  ],
  specials: ['bin', 'eslint', 'jest', 'prettier', 'webpack'],
  parsers: {
    '*.js': 'es6',
    '*.jsx': 'es6',
    '*.ts': 'typescript',
    '*.tsx': 'typescript',
  },
  detectors: [
    'importDeclaration',
    'requireCallExpression',
    'requireResolveCallExpression',
  ],
  reporters: ['console'],
};
