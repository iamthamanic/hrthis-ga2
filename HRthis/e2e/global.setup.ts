import { chromium, FullConfig } from '@playwright/test';
import { testConfig } from '../playwright.config';

/**
 * Global setup for E2E tests with real backend
 * This runs once before all tests
 */

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global E2E test setup...');
  
  // Check if backend is available
  const maxRetries = 30;
  let retries = 0;
  let backendReady = false;
  
  console.log(`⏳ Waiting for backend at ${testConfig.API_URL}...`);
  
  while (retries < maxRetries && !backendReady) {
    try {
      const response = await fetch(`${testConfig.API_URL}/health`);
      if (response.ok) {
        backendReady = true;
        console.log('✅ Backend is ready!');
      }
    } catch (error) {
      // Backend not ready yet
    }
    
    if (!backendReady) {
      retries++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  if (!backendReady) {
    throw new Error(`Backend at ${testConfig.API_URL} is not available after ${maxRetries * 2} seconds`);
  }
  
  // Create admin session for test data setup if needed
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Login as admin to ensure test data is ready
    console.log('🔐 Verifying admin access...');
    
    const loginResponse = await page.request.post(`${testConfig.API_URL}/api/auth/login`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: `username=${testConfig.testUsers.admin.email}&password=${testConfig.testUsers.admin.password}`,
    });
    
    if (loginResponse.ok()) {
      const data = await loginResponse.json();
      console.log('✅ Admin authentication successful');
      
      // Store auth state for potential reuse
      await context.storageState({ path: 'e2e/.auth/admin.json' });
    } else {
      console.warn('⚠️  Admin authentication failed - tests may fail');
    }
    
  } catch (error) {
    console.error('❌ Setup error:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
  
  console.log('✅ Global setup completed successfully');
}

export default globalSetup;