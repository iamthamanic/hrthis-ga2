import { test, expect, Page } from '@playwright/test';

test.describe('Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginUser(page);
    await page.goto('/employees');
  });

  test('should display employees list', async ({ page }) => {
    // Check page elements
    await expect(page.locator('h1, h2').filter({ hasText: /Mitarbeiter/i })).toBeVisible();
    
    // Check for employee table or cards
    await expect(page.locator('[data-testid="employee-list"], table, .employee-card').first()).toBeVisible();
    
    // Check for search input
    await expect(page.locator('input[placeholder*="Suche"], input[placeholder*="Search"]')).toBeVisible();
  });

  test('should search employees by name', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Suche"], input[placeholder*="Search"]');
    
    // Search for specific employee
    await searchInput.fill('Max');
    await page.waitForTimeout(500); // Wait for debounce
    
    // Check filtered results
    const results = page.locator('[data-testid="employee-item"], tr[data-testid*="employee"], .employee-card');
    const count = await results.count();
    
    // Should have at least one result
    expect(count).toBeGreaterThan(0);
    
    // All results should contain search term
    for (let i = 0; i < count; i++) {
      const text = await results.nth(i).textContent();
      expect(text?.toLowerCase()).toContain('max');
    }
  });

  test('should filter employees by department', async ({ page }) => {
    // Find and click department filter
    const departmentFilter = page.locator('select[name*="department"], [data-testid="department-filter"]');
    
    if (await departmentFilter.isVisible()) {
      await departmentFilter.selectOption('IT');
      await page.waitForTimeout(500);
      
      // Check filtered results
      const results = page.locator('[data-testid="employee-item"], tr[data-testid*="employee"], .employee-card');
      const count = await results.count();
      
      for (let i = 0; i < count; i++) {
        const text = await results.nth(i).textContent();
        expect(text).toContain('IT');
      }
    }
  });

  test('should navigate to add employee form', async ({ page }) => {
    // Click add employee button
    await page.locator('button:has-text("Mitarbeiter hinzufügen"), button:has-text("Add Employee"), button:has-text("Hinzufügen")').click();
    
    // Should navigate to form
    await expect(page).toHaveURL(/\/employees\/(new|add|create)/);
    
    // Check form fields
    await expect(page.locator('input[name="firstName"], input[name="first_name"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"], input[name="last_name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('should create new employee', async ({ page }) => {
    // Navigate to add form
    await page.locator('button:has-text("Mitarbeiter hinzufügen"), button:has-text("Add Employee"), button:has-text("Hinzufügen")').click();
    
    // Fill form
    const timestamp = Date.now();
    const testEmail = `test.employee.${timestamp}@example.com`;
    
    await page.locator('input[name="firstName"], input[name="first_name"]').fill('Test');
    await page.locator('input[name="lastName"], input[name="last_name"]').fill('Employee');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="position"]').fill('QA Engineer');
    await page.locator('select[name="department"]').selectOption('IT');
    
    // Submit form
    await page.locator('button[type="submit"]:has-text("Speichern"), button[type="submit"]:has-text("Save")').click();
    
    // Should redirect back to list
    await page.waitForURL('/employees');
    
    // Search for new employee
    await page.locator('input[placeholder*="Suche"], input[placeholder*="Search"]').fill(testEmail);
    await page.waitForTimeout(500);
    
    // Should find the new employee
    await expect(page.locator(`text=${testEmail}`)).toBeVisible();
  });

  test('should edit employee details', async ({ page }) => {
    // Click edit button on first employee
    await page.locator('button:has-text("Bearbeiten"), button:has-text("Edit")').first().click();
    
    // Should navigate to edit form
    await expect(page).toHaveURL(/\/employees\/[^\/]+\/(edit|bearbeiten)/);
    
    // Update position
    const positionInput = page.locator('input[name="position"]');
    await positionInput.clear();
    await positionInput.fill('Senior Developer');
    
    // Save changes
    await page.locator('button[type="submit"]:has-text("Speichern"), button[type="submit"]:has-text("Save")').click();
    
    // Should redirect back to list
    await page.waitForURL('/employees');
    
    // Verify change
    await expect(page.locator('text=Senior Developer')).toBeVisible();
  });

  test('should delete employee with confirmation', async ({ page }) => {
    // Create a test employee first
    const timestamp = Date.now();
    const testEmail = `delete.test.${timestamp}@example.com`;
    
    // Navigate to add form
    await page.locator('button:has-text("Mitarbeiter hinzufügen"), button:has-text("Add Employee")').click();
    
    // Fill and submit form
    await page.locator('input[name="firstName"], input[name="first_name"]').fill('Delete');
    await page.locator('input[name="lastName"], input[name="last_name"]').fill('Test');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('button[type="submit"]').click();
    
    await page.waitForURL('/employees');
    
    // Search for the employee
    await page.locator('input[placeholder*="Suche"]').fill(testEmail);
    await page.waitForTimeout(500);
    
    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Click delete button
    await page.locator('button:has-text("Löschen"), button:has-text("Delete")').first().click();
    
    // Wait for deletion
    await page.waitForTimeout(1000);
    
    // Employee should be removed
    await expect(page.locator(`text=${testEmail}`)).not.toBeVisible();
  });

  test('should export employees to CSV', async ({ page, context }) => {
    // Set up download promise before clicking
    const downloadPromise = page.waitForEvent('download');
    
    // Click export button
    await page.locator('button:has-text("Export"), button:has-text("Exportieren")').click();
    
    // Wait for download
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toMatch(/employees.*\.csv/i);
  });

  test('should show employee details modal/page', async ({ page }) => {
    // Click on employee name or view button
    await page.locator('button:has-text("Ansehen"), button:has-text("View"), a[href*="/employees/"]').first().click();
    
    // Check for details view
    await expect(page.locator('text=/Mitarbeiterdetails/i, text=/Employee Details/i, h1:has-text("Details")')).toBeVisible();
    
    // Should show employee information
    await expect(page.locator('text=/E-Mail/i')).toBeVisible();
    await expect(page.locator('text=/Position/i')).toBeVisible();
    await expect(page.locator('text=/Abteilung/i, text=/Department/i')).toBeVisible();
  });

  test('should handle pagination', async ({ page }) => {
    // Check if pagination exists
    const pagination = page.locator('[data-testid="pagination"], .pagination, nav[aria-label*="pagination"]');
    
    if (await pagination.isVisible()) {
      // Click next page
      await page.locator('button:has-text("Next"), button:has-text("Weiter"), [aria-label="Next page"]').click();
      
      // Wait for page change
      await page.waitForTimeout(500);
      
      // Should show different employees
      const firstEmployeeBefore = await page.locator('[data-testid="employee-item"]').first().textContent();
      
      // Go back to first page
      await page.locator('button:has-text("Previous"), button:has-text("Zurück"), [aria-label="Previous page"]').click();
      await page.waitForTimeout(500);
      
      const firstEmployeeAfter = await page.locator('[data-testid="employee-item"]').first().textContent();
      
      // Should be different
      expect(firstEmployeeBefore).not.toBe(firstEmployeeAfter);
    }
  });

  test('should validate required fields in employee form', async ({ page }) => {
    // Navigate to add form
    await page.locator('button:has-text("Mitarbeiter hinzufügen")').click();
    
    // Try to submit empty form
    await page.locator('button[type="submit"]').click();
    
    // Should show validation errors
    await expect(page.locator('text=/Vorname ist erforderlich/i, text=/First name is required/i')).toBeVisible();
    await expect(page.locator('text=/Nachname ist erforderlich/i, text=/Last name is required/i')).toBeVisible();
    await expect(page.locator('text=/E-Mail ist erforderlich/i, text=/Email is required/i')).toBeVisible();
  });
});

// Helper function to login
async function loginUser(page: Page) {
  await page.goto('/login');
  await page.locator('input[type="email"], input[type="text"]').first().fill('anna.admin@hrthis.de');
  await page.locator('input[type="password"]').fill('demo');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('/', { timeout: 10000 });
}