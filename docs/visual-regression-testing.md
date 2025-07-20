# Visual Regression Testing

## Overview

This document describes the comprehensive visual regression testing setup for the PetBook application using Cypress and `cypress-visual-regression`. Visual regression testing helps detect unintended UI changes by comparing screenshots against baseline images.

## 🎨 Features

### Core Capabilities

- **Automatic Screenshot Comparison**: Compare current screenshots against baseline images
- **Threshold Configuration**: Configurable sensitivity for detecting visual differences
- **Multiple Viewport Testing**: Test across different screen sizes (mobile, tablet, desktop)
- **Component-Level Testing**: Test individual components and UI elements
- **Error State Testing**: Capture visual states for errors, loading, and validation
- **Responsive Design Testing**: Ensure consistent appearance across devices

### Test Coverage

- **Authentication Pages**: Sign in, sign up, password reset
- **Dashboard Pages**: Owner, admin, and employee dashboards
- **Management Pages**: Pets, clients, appointments, services
- **Forms**: Add, edit, and validation states
- **Components**: Navigation, cards, buttons, forms
- **Error States**: 404, network errors, loading states
- **Modals**: Overlays, dropdowns, tooltips
- **Responsive Design**: Mobile, tablet, desktop viewports

## 🛠️ Setup

### Installation

The visual regression testing is already configured with the following dependencies:

```bash
npm install --save-dev cypress-visual-regression
```

### Configuration

The visual regression testing is configured in `cypress.config.ts`:

```typescript
env: {
  // Visual regression testing configuration
  visualRegressionType: 'regression',
  visualRegressionBaseDirectory: 'cypress/visual-regression/baseline',
  visualRegressionDiffDirectory: 'cypress/visual-regression/diff',
  visualRegressionScreenshotsDirectory: 'cypress/visual-regression/screenshots',
  visualRegressionThreshold: 0.1, // 10% threshold for differences
  visualRegressionFailOnError: true,
  visualRegressionCompareAppCommand: 'npm run dev',
  visualRegressionGenerateDiff: 'always'
}
```

### Directory Structure

```
cypress/
├── visual-regression/
│   ├── baseline/          # Baseline screenshots
│   ├── diff/             # Difference images
│   └── screenshots/      # Current test screenshots
├── e2e/
│   └── visual-regression.cy.ts  # Visual regression tests
└── support/
    └── e2e.ts           # Visual regression commands
```

## 🎯 Usage

### Running Visual Regression Tests

```bash
# Run all visual regression tests
npx cypress run --spec "cypress/e2e/visual-regression.cy.ts"

# Run specific test categories
npx cypress run --spec "cypress/e2e/visual-regression.cy.ts" --grep "Authentication"

# Run in baseline mode to generate new baselines
npx cypress run --spec "cypress/e2e/visual-regression.cy.ts" --env visualRegressionType=baseline
```

### Generating Baseline Screenshots

Use the provided script to generate baseline screenshots:

```bash
# Generate baseline screenshots
node scripts/generate-baseline-screenshots.js

# Or run manually
npx cypress run --spec "cypress/e2e/visual-regression.cy.ts" --env visualRegressionType=baseline
```

### Custom Commands

The visual regression testing includes several custom Cypress commands:

```typescript
// Take a visual snapshot
cy.takeVisualSnapshot('test-name');

// Compare against baseline
cy.compareVisualSnapshot('test-name');

// Prepare page for visual testing
cy.prepareForVisualTest();

// Set viewport for visual testing
cy.setVisualViewport(1280, 720);

// Wait for animations
cy.waitForAnimations();

// Hide dynamic content
cy.hideDynamicContent();
```

## 📊 Test Categories

### Authentication Pages

- Sign in page
- Sign up page
- Password reset page
- Form validation states

### Dashboard Pages

- Owner dashboard
- Admin dashboard
- Employee dashboard
- Different data states

### Management Pages

- **Pet Management**: List, add, edit, details pages
- **Client Management**: List, add, edit, details pages
- **Appointment Management**: List, book, edit, details pages
- **Service Management**: List, add, edit, details pages

### Component-Level Tests

- Navigation components
- Card components
- Button components
- Form components
- Modal overlays
- Dropdown menus
- Tooltips

### Error State Tests

- 404 error pages
- Network error states
- Loading states
- Validation error states

### Responsive Design Tests

- Mobile viewport (375x667)
- Tablet viewport (768x1024)
- Desktop viewport (1280x720)
- Large desktop viewport (1920x1080)

## 🔧 Configuration Options

### Threshold Configuration

```typescript
// Configure sensitivity for visual differences
cy.takeVisualSnapshot('test-name', {
  threshold: 0.1, // 10% difference threshold
  thresholdType: 'percent',
});
```

### Viewport Configuration

```typescript
// Set specific viewport for testing
cy.setVisualViewport(375, 667); // Mobile
cy.setVisualViewport(768, 1024); // Tablet
cy.setVisualViewport(1280, 720); // Desktop
```

### Dynamic Content Handling

```typescript
// Hide dynamic content before taking screenshots
cy.hideDynamicContent();

// Wait for animations to complete
cy.waitForAnimations();
```

## 📈 Best Practices

### 1. Baseline Management

- **Generate baselines**: Create baseline screenshots for all UI states
- **Version control**: Commit baseline screenshots to version control
- **Review changes**: Manually review visual differences before accepting
- **Update baselines**: Update baselines when intentional UI changes are made

### 2. Test Organization

- **Group related tests**: Organize tests by feature or component
- **Descriptive names**: Use clear, descriptive test names
- **Consistent structure**: Follow consistent test structure across all visual tests

### 3. Performance Optimization

- **Parallel execution**: Run tests in parallel when possible
- **Efficient setup**: Minimize setup time for each test
- **Resource management**: Clean up resources after tests

### 4. Maintenance

- **Regular updates**: Update baselines when UI changes are intentional
- **Clean up**: Remove outdated baseline images
- **Documentation**: Keep documentation updated with new test cases

## 🚨 Troubleshooting

### Common Issues

#### 1. False Positives

```typescript
// Increase threshold for less sensitive detection
cy.takeVisualSnapshot('test-name', {
  threshold: 0.2, // 20% threshold
  thresholdType: 'percent',
});
```

#### 2. Dynamic Content Issues

```typescript
// Hide dynamic content before taking screenshots
cy.hideDynamicContent();
cy.waitForAnimations();
cy.takeVisualSnapshot('test-name');
```

#### 3. Timing Issues

```typescript
// Wait for page to be fully loaded
cy.waitForPageLoad();
cy.prepareForVisualTest();
cy.takeVisualSnapshot('test-name');
```

#### 4. Viewport Issues

```typescript
// Ensure consistent viewport
cy.setVisualViewport(1280, 720);
cy.prepareForVisualTest();
cy.takeVisualSnapshot('test-name');
```

### Debugging Visual Differences

1. **Check diff images**: Review generated diff images in `cypress/visual-regression/diff/`
2. **Compare screenshots**: Manually compare current vs baseline screenshots
3. **Check viewport**: Ensure consistent viewport settings
4. **Review dynamic content**: Check for dynamic content that changes between runs
5. **Verify animations**: Ensure animations are complete before taking screenshots

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Visual Regression Tests
on: [push, pull_request]
jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run dev &
      - run: npx cypress run --spec "cypress/e2e/visual-regression.cy.ts"
      - uses: actions/upload-artifact@v3
        with:
          name: visual-regression-screenshots
          path: cypress/visual-regression/
```

### Artifact Management

```bash
# Upload screenshots as artifacts
npx cypress run --spec "cypress/e2e/visual-regression.cy.ts" --record

# Download and review artifacts
# Available in CI/CD platform artifact storage
```

## 📊 Reporting

### Test Results

Visual regression tests provide detailed reporting:

- **Pass/Fail Status**: Clear indication of visual differences
- **Difference Percentage**: Quantified visual differences
- **Diff Images**: Visual representation of differences
- **Baseline Comparison**: Side-by-side comparison

### Metrics

Track visual regression metrics:

- **Test Coverage**: Percentage of UI components tested
- **Pass Rate**: Percentage of tests passing
- **False Positive Rate**: Percentage of false positives
- **Maintenance Overhead**: Time spent updating baselines

## 🚀 Advanced Features

### Custom Comparators

```typescript
// Custom comparison logic
cy.takeVisualSnapshot('test-name', {
  customComparator: (current, baseline) => {
    // Custom comparison logic
    return customComparisonResult;
  },
});
```

### Selective Testing

```typescript
// Test specific regions only
cy.takeVisualSnapshot('test-name', {
  clip: { x: 0, y: 0, width: 800, height: 600 },
});
```

### Multiple Thresholds

```typescript
// Different thresholds for different components
cy.takeVisualSnapshot('critical-component', { threshold: 0.05 });
cy.takeVisualSnapshot('non-critical-component', { threshold: 0.2 });
```

## 📚 Resources

### Documentation

- [Cypress Visual Regression Documentation](https://github.com/cypress-io/cypress-visual-regression)
- [Cypress Screenshot Documentation](https://docs.cypress.io/api/commands/screenshot)

### Tools

- **cypress-visual-regression**: Visual regression testing library
- **ImageMagick**: Image processing for comparisons
- **Resemble.js**: Image comparison library

### Examples

- See `cypress/e2e/visual-regression.cy.ts` for complete examples
- Review baseline images in `cypress/visual-regression/baseline/`

---

**Implementation Date:** 2025-07-20  
**Status:** ✅ Complete and Functional  
**Next Phase:** Integration with CI/CD pipeline
