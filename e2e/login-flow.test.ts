import { test, expect } from '@playwright/test';

// Assumes dev server is running on default Vite port
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test('home → login → library flow', async ({ page }) => {
  await page.goto(BASE_URL + '/');

  // Click Continue
  const continueButton = page.locator('#continue-button');
  await expect(continueButton).toBeVisible();
  await continueButton.click();

  // On login page, fill form
  await expect(page).toHaveURL(BASE_URL + '/login');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="code"]', 'secret');
  await page.click('button[type="submit"]');

  // Redirects to library
  await expect(page).toHaveURL(BASE_URL + '/library');
});
