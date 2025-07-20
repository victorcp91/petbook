# Integration Testing Setup - PetBook

This document outlines the integration testing setup for PetBook using Cypress for end-to-end and component testing.

## Overview

PetBook uses Cypress for integration testing, providing both end-to-end (E2E) testing and component testing capabilities. This setup complements the existing Jest unit tests and provides comprehensive test coverage.

## Testing Stack

### Core Dependencies

- **Cypress** (v14.5.2) - End-to-end and component testing framework
- **@cypress/vite-dev-server** - Development server for component testing
- **TypeScript** - Type safety for test files

### Configuration Files

- `cypress.config.ts` - Main Cypress configuration
- `cypress/support/e2e.ts` - E2E test support and custom commands
- `cypress/support/component.ts` - Component test support
- `cypress/support/commands.ts` - Shared custom commands

## Cypress Configuration

### Main Configuration (`cypress.config.ts`)

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    supportFile: 'cypress/support/component.ts',
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
});
```

### Key Configuration Options

- **baseUrl**: Points to local development server
- **viewportWidth/Height**: Standard desktop resolution
- **video**: Disabled to reduce CI artifacts
- **screenshotOnRunFailure**: Automatic screenshots on test failures
- **timeouts**: Extended timeouts for complex interactions

## Test Structure

### Directory Structure

```
cypress/
├── e2e/                    # End-to-end tests
│   ├── auth.cy.ts         # Authentication flow tests
│   └── dashboard.cy.ts    # Dashboard functionality tests
├── component/              # Component tests
│   └── Button.cy.tsx      # Button component tests
├── fixtures/               # Test data fixtures
├── support/                # Support files
│   ├── e2e.ts            # E2E test support
│   ├── component.ts       # Component test support
│   └── commands.ts        # Shared commands
└── downloads/             # Downloaded files (if any)
```

### Test File Naming Convention

- E2E tests: `*.cy.ts` (e.g., `auth.cy.ts`)
- Component tests: `*.cy.tsx` (e.g., `Button.cy.tsx`)

## Available Test Scripts

```bash
# E2E Testing
npm run test:e2e          # Run all E2E tests
npm run test:e2e:open     # Open Cypress E2E test runner

# Component Testing
npm run test:component     # Run all component tests
npm run test:component:open # Open Cypress component test runner

# Combined Testing
npm run test:all          # Run unit tests + E2E tests
```

## Custom Commands

### E2E Custom Commands

```typescript
// Login command
cy.login(email: string, password: string)

// Logout command
cy.logout()

// Wait for page load
cy.waitForPageLoad()

// Clear test data
cy.clearTestData()
```

### Component Custom Commands

```typescript
// Mock Next.js router
cy.mockRouter();
```

## Test Examples

### E2E Test Example

```typescript
describe('Authentication Flow', () => {
  it('should navigate to sign in page', () => {
    cy.visit('/auth/signin');
    cy.get('h1').should('contain', 'Entrar');
    cy.get('[data-testid="email-input"]').should('be.visible');
  });

  it('should show validation errors for empty form', () => {
    cy.visit('/auth/signin');
    cy.get('[data-testid="signin-button"]').click();
    cy.get('[data-testid="email-error"]').should('be.visible');
  });
});
```

### Component Test Example

```typescript
import React from 'react';
import { Button } from '../../apps/web/src/components/ui/button';

describe('Button Component', () => {
  it('renders with default props', () => {
    cy.mount(<Button>Click me</Button>);
    cy.get('button').should('contain.text', 'Click me');
  });

  it('handles click events', () => {
    const onClickSpy = cy.spy().as('onClickSpy');
    cy.mount(<Button onClick={onClickSpy}>Click me</Button>);
    cy.get('button').click();
    cy.get('@onClickSpy').should('have.been.calledOnce');
  });
});
```

## API Mocking

### Intercept API Calls

```typescript
// Mock successful API response
cy.intercept('GET', '/api/dashboard/stats', {
  statusCode: 200,
  body: {
    totalPets: 150,
    totalAppointments: 45,
    totalRevenue: 12500,
    monthlyGrowth: 12.5,
  },
}).as('getDashboardStats');

// Mock error response
cy.intercept('GET', '/api/dashboard/stats', {
  statusCode: 500,
  body: { error: 'Internal server error' },
}).as('getDashboardStatsError');
```

### Wait for API Calls

```typescript
cy.visit('/dashboard');
cy.wait('@getDashboardStats');
cy.get('[data-testid="total-pets-card"]').should('contain', '150');
```

## Test Data Management

### Fixtures

Create test data in `cypress/fixtures/`:

```json
// cypress/fixtures/users.json
{
  "testUser": {
    "id": "test-user-id",
    "email": "test@example.com",
    "role": "owner"
  }
}
```

### Using Fixtures

```typescript
cy.fixture('users').then(users => {
  cy.intercept('GET', '/api/auth/user', {
    statusCode: 200,
    body: { user: users.testUser },
  });
});
```

## Best Practices

### Test Organization

1. **Group related tests** in describe blocks
2. **Use descriptive test names** that explain the behavior
3. **Keep tests independent** - each test should be able to run alone
4. **Use data-testid attributes** for reliable element selection

### Element Selection

```typescript
// ✅ Good - Use data-testid for reliable selection
cy.get('[data-testid="email-input"]').type('test@example.com');

// ❌ Avoid - Fragile selectors
cy.get('input[type="email"]').type('test@example.com');
```

### Assertions

```typescript
// ✅ Good - Specific assertions
cy.get('[data-testid="error-message"]').should('contain', 'Invalid email');

// ❌ Avoid - Vague assertions
cy.get('[data-testid="error-message"]').should('be.visible');
```

### Test Data

```typescript
// ✅ Good - Use test-specific data
const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
};

// ❌ Avoid - Hard-coded data
cy.get('[data-testid="email-input"]').type('admin@petbook.com');
```

## CI/CD Integration

### GitHub Actions Integration

Add to your CI workflow:

```yaml
- name: Run E2E tests
  run: npm run test:e2e
  env:
    CYPRESS_baseUrl: http://localhost:3000
```

### Parallel Execution

For faster CI execution, consider:

1. **Parallel test execution** using Cypress parallelization
2. **Test sharding** by feature or component
3. **Selective test running** based on changed files

## Debugging

### Debugging Failed Tests

1. **Check screenshots** in `cypress/screenshots/`
2. **Review video recordings** (if enabled)
3. **Use `cy.debug()`** in test code
4. **Add `cy.pause()`** for step-by-step debugging

### Common Issues

1. **Timing issues**: Use `cy.wait()` for API calls
2. **Element not found**: Check data-testid attributes
3. **Stale elements**: Use `cy.reload()` if needed
4. **Network errors**: Mock API calls appropriately

## Coverage Goals

### Current Coverage Areas

- ✅ Authentication flow (sign in, sign up, validation)
- ✅ Dashboard functionality (KPI cards, navigation)
- ✅ Component testing (Button component)
- ✅ API mocking and error handling

### Target Coverage Areas

1. **User Management** - User profile, settings
2. **Pet Management** - Add, edit, delete pets
3. **Appointment Scheduling** - Create, modify appointments
4. **Admin Functions** - User management, reports
5. **Responsive Design** - Mobile and tablet testing

## Performance Considerations

### Test Optimization

1. **Use `cy.intercept()`** instead of real API calls
2. **Minimize page loads** with efficient test structure
3. **Use `cy.visit()`** sparingly, prefer component testing
4. **Clean up test data** between tests

### CI Performance

1. **Parallel execution** for faster CI runs
2. **Selective testing** based on changes
3. **Caching** for dependencies and build artifacts
4. **Optimized screenshots** and video settings

## Troubleshooting

### Common Errors

1. **"Element not found"**: Check data-testid attributes
2. **"Timed out"**: Increase timeouts or add waits
3. **"Network error"**: Mock API calls properly
4. **"TypeScript errors"**: Check type declarations

### Debug Commands

```bash
# Run specific test file
npm run test:e2e -- --spec "cypress/e2e/auth.cy.ts"

# Run with debug logging
DEBUG=cypress:* npm run test:e2e

# Open Cypress with specific config
npx cypress open --config-file cypress.config.ts
```

## Next Steps

1. **Add more E2E tests** for critical user flows
2. **Implement component tests** for all UI components
3. **Set up visual regression testing**
4. **Add performance testing** with Cypress
5. **Integrate with monitoring** for test metrics

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Component Testing](https://docs.cypress.io/guides/component-testing/introduction)
- [Cypress API Mocking](https://docs.cypress.io/guides/network-requests)
