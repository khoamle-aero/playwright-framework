import { defineConfig, devices } from '@playwright/test';

const parabankURL = process.env.PARABANK_URL || 'https://parabank.parasoft.com/parabank/';
const saucedemoURL = process.env.SAUCEDEMO_URL || 'https://www.saucedemo.com/';
const restfulBookerURL = process.env.RESTFUL_BOOKER_URL || 'https://restful-booker.herokuapp.com';
const openWeatherURL = process.env.OPENWEATHER_URL || 'https://api.openweathermap.org';
const demoQA = process.env.DEMOQA_URL || 'https://demoqa.com';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],

  // No global baseURL here — each project below sets its own, scoped to
  // that site's/API's test folder, so the suites can't collide.
  use: {
    headless: process.env.CI ? true : false,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'demoQA-chromium',
      testDir: './src/tests/demoQA',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: demoQA,
      },
    },
    {
      name: 'parabank-chromium',
      testDir: './src/tests/parabank',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: parabankURL,
      },
    },
    {
      name: 'saucedemo-chromium',
      testDir: './src/tests/saucedemo',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: saucedemoURL,
      },
    },
    {
      name: 'openweather-chromium',
      testDir: './src/tests/api/openWeather',
      testMatch: '**/*.spec.ts', // Ensures it looks for spec files here
      use: {
        ...devices['Desktop Chrome'],
         baseURL: openWeatherURL, // ◄ Update this line
      },
    },
    {
      // Pure API-only specs (no `page` fixture usage) — request fixture only.
      name: 'restful-booker-api',
      testDir: './src/tests/api',
      testMatch: ['auth.spec.ts', 'booking-crud.spec.ts'],
      use: {
        baseURL: restfulBookerURL,
      },
    },
    {
      // Separate project for the hybrid spec since it needs a real browser
      // (`page`) in addition to `request` — the browserless api project above
      // would fail on any `page.*` call.
      name: 'restful-booker-hybrid-chromium',
      testDir: './src/tests/api',
      testMatch: ['hybrid-ui-api.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: restfulBookerURL,
      },
    },
  ],
});