module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases for the monorepo
    '^@/(.*)$': '<rootDir>/apps/web/src/$1',
    '^@petbook/(.*)$': '<rootDir>/packages/$1/src',
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
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
};
