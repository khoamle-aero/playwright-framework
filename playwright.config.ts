import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const baseURL = process.env.BASE_URL || 'https://example.com';
const apiBaseURL = process.env.RESTFUL_BOOKER_URL || 'https://restful-booker.herokuapp.com';
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './src/tests',
  timeout: 45 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 1,
  workers: isCI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
  ],
  use: {
    baseURL,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api',
      testMatch: '**/api/**',
      use: {
        baseURL: apiBaseURL,
      },
    },
  ],
  outputDir: path.join(__dirname, 'reports', 'test-results'),
  /* Uncomment and configure if you need to start a local app before tests. */
  // webServer: {
  //   command: 'npm run start',
  //   url: baseURL,
  //   reuseExistingServer: !isCI,
  // },
});