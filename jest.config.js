module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases for the monorepo
    '^@/(.*)$': '<rootDir>/apps/web/src/$1',
    '^@petbook/(.*)$': '<rootDir>/packages/$1/src',
    // Ensure React is resolved from the correct location
    '^react$': '<rootDir>/apps/web/node_modules/react',
    '^react-dom$': '<rootDir>/apps/web/node_modules/react-dom',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'apps/web/src/**/*.{js,jsx,ts,tsx}',
    'packages/*/src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '<rootDir>/apps/web/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/apps/web/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/packages/*/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/packages/*/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@supabase|isows|@supabase/realtime-js|@supabase/supabase-js)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  // Add this to ensure React is properly resolved
  moduleDirectories: ['node_modules', '<rootDir>'],
  // Ensure React is available globally
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/apps/web/tsconfig.json',
    },
  },
  // Add module resolution to prioritize apps/web/node_modules
  modulePaths: ['<rootDir>/apps/web/node_modules', '<rootDir>/node_modules'],
};
