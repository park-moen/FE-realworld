import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development' && !process.env.CI) {
  const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
  dotenv.config({ path: envFile });
  console.log(`📋 Loading .env file: ${envFile}`);
}

const BASE_URL = process.env.BASE_URL || process.env.PLAYWRIGHT_API_URL || 'https://localhost:5173';
const IS_HTTPS = BASE_URL.startsWith('https');

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',

  testMatch: ['**/flows/**/*.spec.ts', '**/pages/**/*.spec.ts', '**/smoke/**/*.spec.ts'],

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI ? 'html' : 'list',

  use: {
    baseURL: 'https://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: IS_HTTPS,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    timeout: IS_HTTPS ? 120_000 : 60_000,
    reuseExistingServer: !process.env.CI,
    ignoreHTTPSErrors: true,
  },
});
