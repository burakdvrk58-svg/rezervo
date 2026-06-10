import { test, expect } from '@playwright/test';

test.describe('Rezervo E2E Authentication Tests', () => {
  test('should login successfully as student', async ({ page }) => {
    // 1. Go to login page
    await page.goto('/login');

    // 2. Fill credentials
    await page.fill('#login-email', 'customer@rezervo.com');
    await page.fill('#login-password', 'customer123');

    // 3. Submit form
    await page.click('#login-submit');

    // 4. Verify redirected to customer dashboard
    await page.waitForURL('**/customer');
    await expect(page).toHaveURL(/.*customer/);

    // 5. Verify local storage has correct session variables
    const loggedIn = await page.evaluate(() => localStorage.getItem('rezervo_logged_in'));
    const userRole = await page.evaluate(() => localStorage.getItem('rezervo_user_role'));
    
    expect(loggedIn).toBe('true');
    expect(userRole).toBe('customer');
  });

  test('should login successfully as academician', async ({ page }) => {
    // 1. Go to login page
    await page.goto('/login');

    // 2. Fill credentials
    await page.fill('#login-email', 'business@rezervo.com');
    await page.fill('#login-password', 'business123');

    // 3. Submit form
    await page.click('#login-submit');

    // 4. Verify redirected to business dashboard
    await page.waitForURL('**/business');
    await expect(page).toHaveURL(/.*business/);

    // 5. Verify local storage has correct session variables
    const loggedIn = await page.evaluate(() => localStorage.getItem('rezervo_logged_in'));
    const userRole = await page.evaluate(() => localStorage.getItem('rezervo_user_role'));
    
    expect(loggedIn).toBe('true');
    expect(userRole).toBe('business');
  });
});
