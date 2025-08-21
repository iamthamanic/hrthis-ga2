import { test, expect, Page } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page', async ({ page }) => {
    // Check page title and main elements
    await expect(page).toHaveTitle(/HRthis/);
    await expect(page.locator('h1')).toContainText('Willkommen bei HRthis');
    
    // Check form elements
    await expect(page.locator('input[type="email"], input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click submit without filling fields
    await page.locator('button[type="submit"]').click();
    
    // Check for validation messages
    await expect(page.locator('text=/Bitte geben Sie Ihre E-Mail/i')).toBeVisible();
    await expect(page.locator('text=/Bitte geben Sie Ihr Passwort/i')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill login form
    await page.locator('input[type="email"], input[type="text"]').first().fill('test@hrthis.de');
    await page.locator('input[type="password"]').fill('demo');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for navigation
    await page.waitForURL('/', { timeout: 10000 });
    
    // Check dashboard is loaded
    await expect(page.locator('text=/Dashboard/i')).toBeVisible();
    await expect(page.locator('text=/Mitarbeiter/i')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill login form with invalid credentials
    await page.locator('input[type="email"], input[type="text"]').first().fill('invalid@example.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Check for error message
    await expect(page.locator('text=/Ungültige Anmeldedaten/i')).toBeVisible({ timeout: 5000 });
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const toggleButton = page.locator('button[aria-label*="Passwort"]');
    
    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle button
    await toggleButton.click();
    
    // Password should be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click again to hide
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await loginUser(page);
    
    // Find and click logout button
    await page.locator('button:has-text("Logout"), a:has-text("Logout")').click();
    
    // Should redirect to login page
    await page.waitForURL('/login');
    await expect(page.locator('h1')).toContainText('Willkommen bei HRthis');
  });

  test('should handle session persistence', async ({ page, context }) => {
    // Login
    await loginUser(page);
    
    // Open new tab
    const newPage = await context.newPage();
    await newPage.goto('/');
    
    // Should still be logged in
    await expect(newPage.locator('text=/Dashboard/i')).toBeVisible();
    
    // Close new tab
    await newPage.close();
  });

  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Clear any existing auth
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    
    // Try to access protected route
    await page.goto('/employees');
    
    // Should redirect to login
    await page.waitForURL('/login');
    await expect(page.locator('h1')).toContainText('Willkommen bei HRthis');
  });
});

// Helper function to login
async function loginUser(page: Page) {
  await page.goto('/login');
  await page.locator('input[type="email"], input[type="text"]').first().fill('test@hrthis.de');
  await page.locator('input[type="password"]').fill('demo');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('/', { timeout: 10000 });
}