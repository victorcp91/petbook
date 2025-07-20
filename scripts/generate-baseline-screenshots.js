#!/usr/bin/env node

/**
 * Script to generate baseline screenshots for visual regression testing
 *
 * This script runs Cypress tests in baseline mode to capture initial screenshots
 * that will be used as the reference for future visual regression tests.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(
  '🎨 Generating baseline screenshots for visual regression testing...'
);

// Ensure the visual regression directories exist
const directories = [
  'cypress/visual-regression/baseline',
  'cypress/visual-regression/diff',
  'cypress/visual-regression/screenshots',
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Set environment variable for baseline mode
process.env.VISUAL_REGRESSION_TYPE = 'baseline';

try {
  // Run Cypress in baseline mode
  console.log('📸 Running Cypress in baseline mode...');

  const command =
    'npx cypress run --spec "cypress/e2e/visual-regression.cy.ts" --env visualRegressionType=baseline';

  execSync(command, {
    stdio: 'inherit',
    env: { ...process.env, VISUAL_REGRESSION_TYPE: 'baseline' },
  });

  console.log('✅ Baseline screenshots generated successfully!');
  console.log('📁 Screenshots saved to: cypress/visual-regression/baseline/');
} catch (error) {
  console.error('❌ Error generating baseline screenshots:', error.message);
  process.exit(1);
}

console.log('\n🎯 Next steps:');
console.log('1. Review the generated baseline screenshots');
console.log('2. Commit the baseline screenshots to version control');
console.log('3. Run visual regression tests to compare against baselines');
console.log('4. Update baselines when intentional UI changes are made');
