# Testing Setup Documentation

## Overview

PetBook has a comprehensive testing infrastructure already configured with Jest and React Testing Library. This document outlines the current setup, configuration, and usage patterns.

## Current Testing Stack

### Core Dependencies

- **Jest** (v29) - Test runner and framework
- **React Testing Library** (v14) - Component testing utilities
- **@testing-library/jest-dom** (v6) - Custom Jest matchers for DOM testing
- **@testing-library/user-event** (v14) - User interaction simulation
- **jest-environment-jsdom** (v29) - DOM environment for tests

### Configuration Files

- `jest.config.js` - Main Jest configuration
- `jest.setup.js` - Global test setup and mocks
- `babel.config.js` - Babel configuration for test transpilation

## Jest Configuration

### Monorepo Setup

The Jest configuration is optimized for the monorepo structure:

```javascript
// jest.config.js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/apps/web/src/$1',
  '^@petbook/(.*)$': '<rootDir>/packages/$1/src',
  '^react$': '<rootDir>/apps/web/node_modules/react',
  '^react-dom$': '<rootDir>/apps/web/node_modules/react-dom',
}
```

### Test Patterns

- `**/__tests__/**/*.{js,jsx,ts,tsx}` - Tests in **tests** directories
- `**/*.{test,spec}.{js,jsx,ts,tsx}` - Tests with .test or .spec suffix

### Coverage Configuration

```javascript
collectCoverageFrom: [
  'apps/web/src/**/*.{js,jsx,ts,tsx}',
  'packages/*/src/**/*.{js,jsx,ts,tsx}',
  '!**/*.d.ts',
  '!**/node_modules/**',
];
```

## Global Test Setup

### jest.setup.js

The setup file includes:

1. **React Testing Library DOM matchers**

   ```javascript
   import '@testing-library/jest-dom';
   ```

2. **Next.js Router Mocks**
   - `next/router` mock for useRouter hook
   - `next/navigation` mock for App Router
   - Search params and pathname utilities

3. **Browser API Mocks**
   - `window.matchMedia`
   - `IntersectionObserver`
   - `ResizeObserver`

## Available Test Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI environment
npm run test:ci

# Full CI check (type-check + lint + test)
npm run ci:check
```

## Current Test Coverage

### Auth Components (6 test files)

- `AuthenticationFlow.test.tsx` (647 lines)
- `ProtectedRoute.test.tsx` (415 lines)
- `SignUpForm.test.tsx` (382 lines)
- `UpdatePasswordForm.test.tsx` (598 lines)
- `ResetPasswordForm.test.tsx` (397 lines)
- `SignInForm.test.tsx` (387 lines)

### Test Patterns Established

1. **Component Testing** - Using React Testing Library
2. **User Interaction Testing** - Using @testing-library/user-event
3. **Form Testing** - Comprehensive form validation and submission tests
4. **Protected Route Testing** - Authentication and authorization testing
5. **Error Handling** - Testing error states and user feedback

## Writing Tests

### Basic Component Test Structure

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

### Testing with Supabase

For components that use Supabase, mock the client:

```typescript
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    })),
  })),
}));
```

## Coverage Goals

### Current Status

- Auth components have comprehensive test coverage
- Basic test infrastructure is established
- CI/CD integration ready

### Target Areas for Expansion

1. **UI Components** - All shadcn/ui components
2. **Layout Components** - Navigation, layouts
3. **Dashboard Components** - Owner, Admin, Groomer dashboards
4. **Form Components** - All form implementations
5. **Utility Functions** - Helper functions and utilities

## Next Steps

1. **Document existing patterns** ✅ (This document)
2. **Expand to other components** - Start with UI components
3. **Set up Cypress** - For end-to-end testing
4. **Create test factories** - For consistent test data
5. **Implement CI/CD** - Automated test running
6. **Add visual regression** - UI change detection

## Best Practices

### Test Organization

- Group related tests in `__tests__` directories
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Mocking Strategy

- Mock external dependencies (Supabase, APIs)
- Use real components for integration tests
- Mock browser APIs consistently

### Coverage Strategy

- Aim for 80% overall coverage
- Focus on critical user paths
- Test error states and edge cases
- Prioritize user-facing functionality

## Troubleshooting

### Common Issues

1. **Module resolution errors** - Check jest.config.js moduleNameMapper
2. **React version conflicts** - Ensure consistent React versions
3. **Async test failures** - Use proper async/await patterns
4. **Mock setup issues** - Verify jest.setup.js is loaded

### Debugging Tests

```bash
# Run specific test file
npm test -- ComponentName.test.tsx

# Run tests with verbose output
npm test -- --verbose

# Run tests with coverage for specific file
npm run test:coverage -- --collectCoverageFrom="src/components/ComponentName.tsx"
```
