import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,          // a forgotten test.only fails the CI run
  retries: process.env.CI ? 1 : 0,       // one retry on CI only, so flaky tests still get noticed
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: env.baseURL,
    extraHTTPHeaders: { Accept: 'application/json' },
    trace: 'retain-on-failure',
  },
  projects: [
    // API tests need no browser, so they start fast.
    { name: 'api', testDir: './tests/api' },
    // UI and mixed API + UI tests run in Chromium.
    { name: 'ui', testMatch: /tests\/(ui|mixed)\/.*\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
  ],
  // Start the practice API before the tests (only for the local environment).
  webServer: env.name === 'local' && !process.env.BASE_URL ? {
    command: 'node practice-api/server.js',
    url: 'http://localhost:3000/health',
    reuseExistingServer: !process.env.CI,
  } : undefined,
});
