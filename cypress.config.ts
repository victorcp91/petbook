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
    retries: { runMode: 2, openMode: 0 },
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
      // Visual regression testing configuration
      visualRegressionType: 'regression',
      visualRegressionBaseDirectory: 'cypress/visual-regression/baseline',
      visualRegressionDiffDirectory: 'cypress/visual-regression/diff',
      visualRegressionScreenshotsDirectory:
        'cypress/visual-regression/screenshots',
      visualRegressionThreshold: 0.1, // 10% threshold for differences
      visualRegressionFailOnError: true,
      visualRegressionCompareAppCommand: 'npm run dev',
      visualRegressionGenerateDiff: 'always',
    },
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        },
      });
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push(
            '--disable-gpu',
            '--no-sandbox',
            '--disable-dev-shm-usage'
          );
        }
        return launchOptions;
      });
      const isCI = process.env.CI === 'true';
      if (isCI) {
        config.video = false;
        config.screenshotOnRunFailure = true;
        config.defaultCommandTimeout = 20000;
      }
      return config;
    },
  },
  component: {
    devServer: { framework: 'next', bundler: 'webpack' },
    supportFile: 'cypress/support/component.ts',
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
  watchForFileChanges: false,
  chromeWebSecurity: false,
  experimentalModifyObstructiveThirdPartyCode: true,
  numTestsKeptInMemory: 50,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'spec, mocha-junit-reporter',
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/results/results-[hash].xml',
      toConsole: true,
    },
  },
});
