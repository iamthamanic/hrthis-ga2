import { test, expect, Page } from '@playwright/test';
import { testConfig } from '../playwright.config';

/**
 * Full User Journey E2E Test
 * Tests complete workflows from login to complex operations
 */

test.describe('Full User Journey - Employee Management', () => {
  // Use real backend users if available
  const adminUser = testConfig.USE_REAL_BACKEND 
    ? testConfig.testUsers.admin 
    : testConfig.testUsers.demo;

  test('Complete employee lifecycle: Create → Edit → Delete', async ({ page }) => {
    // Step 1: Login as admin
    await page.goto('/login');
    await page.locator('input[type="email"], input[type="text"]').first().fill(adminUser.email);
    await page.locator('input[type="password"]').fill(adminUser.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/', { timeout: 10000 });
    
    // Step 2: Navigate to employees page
    await page.locator('a:has-text("Mitarbeiter"), button:has-text("Mitarbeiter")').first().click();
    await page.waitForURL(/\/employees/);
    
    // Step 3: Create new employee
    const newEmployeeData = {
      email: `test.employee.${Date.now()}@test.com`,
      firstName: 'Test',
      lastName: 'Employee',
      employeeNumber: `PN-${Date.now()}`,
      position: 'Test Position',
      department: 'Test Department',
    };
    
    // Click add employee button
    await page.locator('button:has-text("Mitarbeiter hinzufügen"), a:has-text("Mitarbeiter hinzufügen")').click();
    
    // Fill employee form
    await page.locator('input[name="email"]').fill(newEmployeeData.email);
    await page.locator('input[name="firstName"]').fill(newEmployeeData.firstName);
    await page.locator('input[name="lastName"]').fill(newEmployeeData.lastName);
    await page.locator('input[name="employeeNumber"]').fill(newEmployeeData.employeeNumber);
    await page.locator('input[name="position"]').fill(newEmployeeData.position);
    await page.locator('input[name="department"], select[name="department"]').first().fill(newEmployeeData.department);
    
    // Submit form
    await page.locator('button[type="submit"]:has-text("Speichern"), button[type="submit"]:has-text("Erstellen")').click();
    
    // Wait for success message or redirect
    await page.waitForURL(/\/employees/, { timeout: 10000 });
    
    // Step 4: Verify employee was created
    await expect(page.locator(`text=${newEmployeeData.email}`)).toBeVisible({ timeout: 10000 });
    
    // Step 5: Edit the employee
    await page.locator(`tr:has-text("${newEmployeeData.email}") button:has-text("Bearbeiten"), tr:has-text("${newEmployeeData.email}") a:has-text("Bearbeiten")`).click();
    
    // Update position
    const updatedPosition = 'Senior Test Position';
    await page.locator('input[name="position"]').fill(updatedPosition);
    await page.locator('button[type="submit"]:has-text("Speichern"), button[type="submit"]:has-text("Aktualisieren")').click();
    
    // Verify update
    await page.waitForURL(/\/employees/);
    await expect(page.locator(`text=${updatedPosition}`)).toBeVisible({ timeout: 10000 });
    
    // Step 6: Delete the employee (if admin)
    if (testConfig.USE_REAL_BACKEND) {
      await page.locator(`tr:has-text("${newEmployeeData.email}") button:has-text("Löschen")`).click();
      
      // Confirm deletion
      await page.locator('button:has-text("Bestätigen"), button:has-text("Ja")').click();
      
      // Verify deletion
      await expect(page.locator(`text=${newEmployeeData.email}`)).not.toBeVisible({ timeout: 10000 });
    }
    
    // Step 7: Logout
    await page.locator('button:has-text("Logout"), a:has-text("Logout")').click();
    await page.waitForURL('/login');
  });

  test('Employee self-service journey', async ({ page }) => {
    const employeeUser = testConfig.USE_REAL_BACKEND 
      ? testConfig.testUsers.employee 
      : testConfig.testUsers.demo;
    
    // Step 1: Login as employee
    await page.goto('/login');
    await page.locator('input[type="email"], input[type="text"]').first().fill(employeeUser.email);
    await page.locator('input[type="password"]').fill(employeeUser.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/', { timeout: 10000 });
    
    // Step 2: View dashboard
    await expect(page.locator('text=/Dashboard/i')).toBeVisible();
    
    // Step 3: Navigate to profile/settings
    await page.locator('a:has-text("Profil"), a:has-text("Einstellungen"), button:has-text("Profil")').first().click();
    
    // Step 4: Update personal information
    const updatedPhone = '+49 30 98765432';
    const phoneInput = page.locator('input[name="phone"], input[type="tel"]').first();
    
    if (await phoneInput.isVisible()) {
      await phoneInput.fill(updatedPhone);
      await page.locator('button:has-text("Speichern")').click();
      
      // Verify update was saved
      await expect(page.locator('text=/Erfolgreich gespeichert|Successfully saved/i')).toBeVisible({ timeout: 5000 });
    }
    
    // Step 5: Check vacation balance
    await page.locator('a:has-text("Urlaub"), a:has-text("Abwesenheit")').first().click();
    await expect(page.locator('text=/Urlaubstage|Vacation days/i')).toBeVisible();
    
    // Step 6: Logout
    await page.locator('button:has-text("Logout"), a:has-text("Logout")').click();
    await page.waitForURL('/login');
  });

  test('Manager approval workflow', async ({ page }) => {
    if (!testConfig.USE_REAL_BACKEND) {
      test.skip();
      return;
    }
    
    const managerUser = testConfig.testUsers.manager;
    
    // Step 1: Login as manager
    await page.goto('/login');
    await page.locator('input[type="email"], input[type="text"]').first().fill(managerUser.email);
    await page.locator('input[type="password"]').fill(managerUser.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/', { timeout: 10000 });
    
    // Step 2: Navigate to team overview
    await page.locator('a:has-text("Team"), a:has-text("Mitarbeiter")').first().click();
    
    // Step 3: Check for pending approvals
    const pendingApprovals = page.locator('text=/Ausstehend|Pending/i');
    
    if (await pendingApprovals.isVisible()) {
      // Step 4: Open first pending request
      await pendingApprovals.first().click();
      
      // Step 5: Approve or reject
      await page.locator('button:has-text("Genehmigen"), button:has-text("Approve")').click();
      
      // Verify action was processed
      await expect(page.locator('text=/Genehmigt|Approved/i')).toBeVisible({ timeout: 5000 });
    }
    
    // Step 6: View team statistics
    await page.locator('a:has-text("Statistiken"), a:has-text("Reports")').first().click();
    await expect(page.locator('text=/Team|Department/i')).toBeVisible();
    
    // Step 7: Logout
    await page.locator('button:has-text("Logout"), a:has-text("Logout")').click();
    await page.waitForURL('/login');
  });

  test('Search and filter employees', async ({ page }) => {
    const user = testConfig.USE_REAL_BACKEND 
      ? testConfig.testUsers.admin 
      : testConfig.testUsers.demo;
    
    // Login
    await page.goto('/login');
    await page.locator('input[type="email"], input[type="text"]').first().fill(user.email);
    await page.locator('input[type="password"]').fill(user.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/', { timeout: 10000 });
    
    // Navigate to employees
    await page.locator('a:has-text("Mitarbeiter"), button:has-text("Mitarbeiter")').first().click();
    await page.waitForURL(/\/employees/);
    
    // Test search functionality
    const searchInput = page.locator('input[placeholder*="Suche"], input[type="search"]').first();
    
    if (await searchInput.isVisible()) {
      // Search by name
      await searchInput.fill('John');
      await page.keyboard.press('Enter');
      
      // Wait for filtered results
      await page.waitForTimeout(1000);
      
      // Clear search
      await searchInput.clear();
      await page.keyboard.press('Enter');
    }
    
    // Test department filter
    const departmentFilter = page.locator('select[name="department"], [data-testid="department-filter"]').first();
    
    if (await departmentFilter.isVisible()) {
      await departmentFilter.selectOption('IT');
      await page.waitForTimeout(1000);
      
      // Verify filtered results
      const results = page.locator('tbody tr, [data-testid="employee-card"]');
      const count = await results.count();
      expect(count).toBeGreaterThan(0);
    }
    
    // Test status filter
    const statusFilter = page.locator('select[name="status"], [data-testid="status-filter"]').first();
    
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('ACTIVE');
      await page.waitForTimeout(1000);
      
      // Verify only active employees are shown
      await expect(page.locator('text=/ACTIVE|Aktiv/i')).toBeVisible();
    }
    
    // Logout
    await page.locator('button:has-text("Logout"), a:has-text("Logout")').click();
    await page.waitForURL('/login');
  });

  test('Mobile responsive journey', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const user = testConfig.USE_REAL_BACKEND 
      ? testConfig.testUsers.employee 
      : testConfig.testUsers.demo;
    
    // Login on mobile
    await page.goto('/login');
    await page.locator('input[type="email"], input[type="text"]').first().fill(user.email);
    await page.locator('input[type="password"]').fill(user.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/', { timeout: 10000 });
    
    // Check mobile menu
    const hamburgerMenu = page.locator('[aria-label="Menu"], button:has-text("☰")').first();
    
    if (await hamburgerMenu.isVisible()) {
      // Open mobile menu
      await hamburgerMenu.click();
      
      // Navigate using mobile menu
      await page.locator('a:has-text("Mitarbeiter")').click();
      await page.waitForURL(/\/employees/);
      
      // Verify mobile layout
      await expect(page.locator('main, [role="main"]')).toBeVisible();
    }
    
    // Test scrolling and touch interactions
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    
    // Logout on mobile
    if (await hamburgerMenu.isVisible()) {
      await hamburgerMenu.click();
    }
    await page.locator('button:has-text("Logout"), a:has-text("Logout")').click();
    await page.waitForURL('/login');
  });
});

test.describe('Performance and Error Handling', () => {
  test('should handle network errors gracefully', async ({ page, context }) => {
    const user = testConfig.USE_REAL_BACKEND 
      ? testConfig.testUsers.employee 
      : testConfig.testUsers.demo;
    
    // Login first
    await page.goto('/login');
    await page.locator('input[type="email"], input[type="text"]').first().fill(user.email);
    await page.locator('input[type="password"]').fill(user.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/', { timeout: 10000 });
    
    // Simulate network failure
    await context.setOffline(true);
    
    // Try to navigate
    await page.locator('a:has-text("Mitarbeiter")').first().click();
    
    // Should show error message
    await expect(page.locator('text=/Offline|Keine Verbindung|Connection error/i')).toBeVisible({ timeout: 10000 });
    
    // Restore network
    await context.setOffline(false);
    
    // Should recover
    await page.reload();
    await expect(page.locator('text=/Dashboard/i')).toBeVisible({ timeout: 10000 });
  });

  test('should handle large data sets efficiently', async ({ page }) => {
    if (!testConfig.USE_REAL_BACKEND) {
      test.skip();
      return;
    }
    
    const adminUser = testConfig.testUsers.admin;
    
    // Login as admin
    await page.goto('/login');
    await page.locator('input[type="email"], input[type="text"]').first().fill(adminUser.email);
    await page.locator('input[type="password"]').fill(adminUser.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/', { timeout: 10000 });
    
    // Navigate to employees page
    await page.locator('a:has-text("Mitarbeiter")').first().click();
    await page.waitForURL(/\/employees/);
    
    // Measure load time
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
    
    // Check pagination or virtual scrolling
    const pagination = page.locator('[aria-label="pagination"], .pagination');
    const virtualScroll = page.locator('[data-testid="virtual-scroll"]');
    
    // Should have either pagination or virtual scrolling for large datasets
    const hasPagination = await pagination.isVisible();
    const hasVirtualScroll = await virtualScroll.isVisible();
    
    expect(hasPagination || hasVirtualScroll).toBeTruthy();
  });
});