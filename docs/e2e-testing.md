# End-to-End Testing Guide - PetBook

This document describes the comprehensive end-to-end (E2E) testing setup for PetBook using Cypress.

## 📋 Table of Contents

- [Overview](#overview)
- [Setup and Configuration](#setup-and-configuration)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Categories](#test-categories)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The E2E testing suite provides comprehensive coverage of the PetBook application, testing real user scenarios from registration to appointment booking. The tests simulate actual user interactions and verify that all components work together correctly.

### Key Features

- **Complete User Journeys**: Tests full workflows from start to finish
- **Performance Testing**: Measures load times and responsiveness
- **Error Handling**: Tests error scenarios and recovery
- **Accessibility**: Ensures the application is accessible
- **Responsive Design**: Tests on different screen sizes
- **API Integration**: Tests frontend-backend communication

## ⚙️ Setup and Configuration

### Prerequisites

```bash
# Install dependencies
npm install

# Install Cypress and related packages
npm install --save-dev cypress cypress-multi-reporters mocha-junit-reporter @cypress/code-coverage
```

### Configuration Files

#### `cypress.config.ts`

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      coverage: false,
      codeCoverage: {
        exclude: [
          'cypress/**/*',
          'packages/**/*',
          '**/*.d.ts',
          '**/*.config.*',
          '**/*.setup.*',
        ],
      },
    },
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

### Directory Structure

```
cypress/
├── e2e/                    # End-to-end tests
│   ├── auth-integration.cy.ts
│   ├── dashboard-integration.cy.ts
│   ├── api-integration.cy.ts
│   ├── user-journey.cy.ts
│   └── performance.cy.ts
├── component/              # Component tests
│   └── Button.cy.tsx
├── fixtures/              # Test data
│   └── test-data.json
├── support/               # Support files
│   ├── e2e.ts
│   ├── component.ts
│   └── commands.ts
└── results/              # Test results (auto-generated)
```

## 🧪 Test Structure

### Test Categories

#### 1. Authentication Integration Tests (`auth-integration.cy.ts`)

Tests the complete authentication flow:

- **User Registration**: Complete signup process with shop information
- **Form Validation**: Field validation and error messages
- **User Login**: Login flow and session management
- **Password Reset**: Password recovery process
- **Session Management**: Session persistence and expiration
- **Protected Routes**: Access control for authenticated users

#### 2. Dashboard Integration Tests (`dashboard-integration.cy.ts`)

Tests dashboard functionality and data management:

- **Data Loading**: KPI cards and dashboard stats
- **Loading States**: Spinner and loading indicators
- **Date Filtering**: Date range selection and filtering
- **Role-Based Access**: Different features for different user roles
- **Navigation**: Menu navigation and routing
- **Real-time Updates**: Data refresh and updates
- **Export Functionality**: PDF generation and export

#### 3. API Integration Tests (`api-integration.cy.ts`)

Tests API endpoints and data operations:

- **CRUD Operations**: Create, read, update, delete operations
- **Error Handling**: Network errors and API failures
- **Data Validation**: Input validation and error responses
- **Search and Filtering**: Data search and filtering
- **Queue Management**: Grooming queue operations
- **Reports and Analytics**: Data reporting and analytics

#### 4. User Journey Tests (`user-journey.cy.ts`)

Tests complete user workflows:

- **Full User Journey**: Registration → Dashboard → Pet Management → Appointment Booking
- **Error Scenarios**: Network failures and error recovery
- **Responsive Design**: Testing on different screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

#### 5. Performance Tests (`performance.cy.ts`)

Tests application performance:

- **Page Load Performance**: Load time measurements
- **Large Dataset Handling**: Performance with large data sets
- **Concurrent Users**: Multiple simultaneous requests
- **Memory Usage**: Memory leak detection
- **Network Resilience**: Slow network and retry mechanisms
- **Browser Compatibility**: Cross-browser performance

### Custom Commands

The test suite includes custom Cypress commands for common operations:

```typescript
// Authentication
cy.login(email, password);
cy.logout();
cy.mockAuthenticatedSession(userData);
cy.mockUnauthenticatedSession();

// Data Management
cy.createTestPet(petData);
cy.createTestAppointment(appointmentData);
cy.mockDashboardStats(stats);

// Error Testing
cy.mockApiError(endpoint, statusCode, errorMessage);
cy.mockNetworkError(endpoint);
cy.mockRateLimit(endpoint, retryAfter);

// Utilities
cy.waitForPageLoad();
cy.clearTestData();
cy.waitForApiRequest(alias, expectedStatus);
cy.verifyApiRequest(alias, expectedData);
```

## 🚀 Running Tests

### Available Scripts

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests in open mode (interactive)
npm run test:e2e:open

# Run component tests
npm run test:component

# Run component tests in open mode
npm run test:component:open

# Run all tests (unit + E2E)
npm run test:all

# Run specific test file
npx cypress run --spec "cypress/e2e/auth-integration.cy.ts"

# Run tests with specific browser
npx cypress run --browser chrome

# Run tests in headless mode
npx cypress run --headless
```

### Environment Variables

```bash
# Development
CYPRESS_BASE_URL=http://localhost:3000

# Staging
CYPRESS_BASE_URL=https://staging.petbook.com

# Production
CYPRESS_BASE_URL=https://petbook.com
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Run E2E Tests
  run: |
    npm run build
    npm run test:e2e
  env:
    CI: true
    CYPRESS_BASE_URL: ${{ secrets.CYPRESS_BASE_URL }}
```

## 📊 Test Categories

### 1. Functional Testing

Tests that verify the application works as expected:

- **User Registration and Login**
- **Dashboard Functionality**
- **Pet Management**
- **Appointment Scheduling**
- **Client Management**
- **Queue Operations**
- **Reporting and Analytics**

### 2. Performance Testing

Tests that measure application performance:

- **Page Load Times**: < 3 seconds for initial load
- **API Response Times**: < 1 second for API calls
- **Large Dataset Handling**: Efficient pagination and filtering
- **Memory Usage**: No memory leaks during extended sessions
- **Concurrent Users**: Handle multiple simultaneous requests

### 3. Error Handling Testing

Tests that verify error scenarios:

- **Network Failures**: Graceful handling of network errors
- **API Errors**: Proper error messages and retry mechanisms
- **Authentication Failures**: Session expiration and re-authentication
- **Rate Limiting**: Handle API rate limits gracefully

### 4. Accessibility Testing

Tests that ensure accessibility compliance:

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and roles
- **Focus Management**: Proper focus indicators
- **Color Contrast**: Sufficient color contrast ratios

### 5. Responsive Design Testing

Tests that verify responsive behavior:

- **Mobile Viewport**: 375x667
- **Tablet Viewport**: 768x1024
- **Desktop Viewport**: 1280x720
- **Large Desktop**: 1920x1080

## 🎯 Best Practices

### Test Organization

1. **Group Related Tests**: Use `describe` blocks to group related tests
2. **Clear Test Names**: Use descriptive test names that explain the scenario
3. **Independent Tests**: Each test should be independent and not rely on others
4. **Clean Setup**: Use `beforeEach` to set up test data and `afterEach` to clean up

### Data Management

1. **Use Fixtures**: Store test data in `cypress/fixtures/`
2. **Mock APIs**: Use `cy.intercept()` to mock API responses
3. **Clean State**: Clear cookies and localStorage between tests
4. **Test Data**: Use realistic but anonymized test data

### Performance Considerations

1. **Optimize Selectors**: Use `data-testid` attributes for reliable selectors
2. **Minimize Waits**: Use `cy.wait()` only when necessary
3. **Parallel Execution**: Structure tests to run in parallel when possible
4. **Resource Management**: Clean up resources after tests

### Error Handling

1. **Graceful Degradation**: Test how the app handles errors
2. **User Feedback**: Verify error messages are user-friendly
3. **Retry Mechanisms**: Test automatic retry functionality
4. **Fallback Options**: Test alternative flows when primary flows fail

## 🔧 Troubleshooting

### Common Issues

#### 1. Tests Failing Intermittently

**Cause**: Race conditions or timing issues
**Solution**:

- Add explicit waits for async operations
- Use `cy.wait()` for API calls
- Increase timeout values if needed

#### 2. Selector Issues

**Cause**: Elements not found or changed
**Solution**:

- Use `data-testid` attributes for reliable selectors
- Avoid CSS selectors that might change
- Use `cy.get()` with proper assertions

#### 3. Network Issues

**Cause**: API calls failing or timing out
**Solution**:

- Mock API responses using `cy.intercept()`
- Handle network errors gracefully
- Test offline scenarios

#### 4. Performance Issues

**Cause**: Tests running slowly
**Solution**:

- Optimize test data and fixtures
- Use headless mode for faster execution
- Parallelize tests when possible

### Debugging Tips

1. **Use Cypress Debugger**:

   ```javascript
   cy.debug(); // Pause execution
   cy.pause(); // Pause and show step-by-step
   ```

2. **Screenshots and Videos**:
   - Screenshots are automatically taken on failure
   - Videos are recorded for failed tests
   - Check `cypress/screenshots/` and `cypress/videos/`

3. **Console Logs**:

   ```javascript
   cy.log('Debug message');
   cy.task('log', 'Custom log message');
   ```

4. **Network Monitoring**:
   ```javascript
   cy.intercept('GET', '/api/**').as('apiCall');
   cy.wait('@apiCall');
   ```

## 📈 Reporting

### Test Reports

The test suite generates comprehensive reports:

- **Console Output**: Real-time test progress
- **JUnit Reports**: XML reports for CI/CD integration
- **Screenshots**: Visual evidence of failures
- **Videos**: Recorded test sessions

### Coverage Reports

Code coverage is tracked for:

- **Line Coverage**: Percentage of lines executed
- **Branch Coverage**: Percentage of branches taken
- **Function Coverage**: Percentage of functions called

### Performance Metrics

Performance tests track:

- **Page Load Times**: Initial page load performance
- **API Response Times**: Backend performance
- **Memory Usage**: Memory consumption patterns
- **Concurrent User Capacity**: Scalability metrics

## 🔄 Continuous Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test:e2e
        env:
          CI: true
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots/
```

This comprehensive E2E testing setup ensures that PetBook provides a reliable, performant, and accessible user experience across all scenarios and edge cases.
