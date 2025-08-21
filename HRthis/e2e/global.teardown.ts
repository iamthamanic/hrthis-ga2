import { FullConfig } from '@playwright/test';

/**
 * Global teardown for E2E tests
 * This runs once after all tests complete
 */

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Running global teardown...');
  
  // Any cleanup tasks can go here
  // For example: clearing test data, closing connections, etc.
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;