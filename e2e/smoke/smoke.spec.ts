import { test, expect } from '@playwright/test';

test.describe(
  'Smoke Tests',
  {
    tag: '@preview',
  },
  () => {
    test('application loads successfully', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/realworld/i);
    });

    test('can navigate to login page', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: /sign in/i }).click();
      await expect(page).toHaveURL(/login/);
    });
  },
);
