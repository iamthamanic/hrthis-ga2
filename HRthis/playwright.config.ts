import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright E2E Test Configuration for HRthis
 * Supports both demo mode and real backend testing
 */

// Use environment variables to determine test mode
const USE_REAL_BACKEND = process.env.API_URL ? true : false;
const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';
const API_URL = process.env.API_URL || 'http://localhost:8003';

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  
  // Fail fast in CI, continue locally
  fullyParallel: !process.env.CI,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
    process.env.CI ? ['github'] : ['line'],
  ],
  
  // Global test configuration
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // Extra HTTP headers for API calls
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },

  // Test projects for different browsers
  projects: [
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      dependencies: USE_REAL_BACKEND ? ['setup'] : [],
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
      dependencies: USE_REAL_BACKEND ? ['setup'] : [],
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
      dependencies: USE_REAL_BACKEND ? ['setup'] : [],
    },
    // Mobile testing
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: USE_REAL_BACKEND ? ['setup'] : [],
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
      dependencies: USE_REAL_BACKEND ? ['setup'] : [],
    },
  ],

  // Web server configuration (only for local/demo mode)
  webServer: USE_REAL_BACKEND ? undefined : {
    command: 'npm start',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  
  // Global setup and teardown
  globalSetup: USE_REAL_BACKEND ? './e2e/global.setup.ts' : undefined,
  globalTeardown: USE_REAL_BACKEND ? './e2e/global.teardown.ts' : undefined,
});

// Export test configuration for use in tests
export const testConfig = {
  USE_REAL_BACKEND,
  BASE_URL,
  API_URL,
  
  // Test users from seed data
  testUsers: {
    admin: {
      email: 'admin@test.com',
      password: 'admin123',
    },
    manager: {
      email: 'manager@test.com',
      password: 'manager123',
    },
    employee: {
      email: 'employee@test.com',
      password: 'employee123',
    },
    parttime: {
      email: 'parttime@test.com',
      password: 'employee123',
    },
    // Demo mode users
    demo: {
      email: 'test@hrthis.de',
      password: 'demo',
    },
  },
};