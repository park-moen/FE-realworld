import { test, expect } from '@playwright/test';

test.describe('Auth Flow', { tag: '@preview' }, () => {
  const username = `test_${Date.now()}`;
  const email = `test${Date.now()}@example.com`;
  const password = 'password123';

  test('should complete the full auth flow: register => logout => login', async ({ page }) => {
    await page.goto('/register');
    await page.getByPlaceholder(/your name/i).fill(username);
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill(password);
    await page.getByRole('button', { name: /sign up/i }).click();

    await expect(page.getByRole('heading', { name: username })).toBeVisible();

    await page.goto('/settings');
    await page.getByRole('button', { name: /logout/i }).click();

    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill(password);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByRole('heading', { name: username })).toBeVisible();
  });
});
