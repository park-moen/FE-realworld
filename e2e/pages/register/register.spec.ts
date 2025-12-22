import { test, expect } from '@playwright/test';
import { createUserByApi } from '../../utils/api-helper';

test.describe('Register Page', { tag: '@preview' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display the registration form', async ({ page }) => {
    await expect(page.getByPlaceholder(/your name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
  });

  test('should not submit the form with empty fields', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sign up/i })).toBeDisabled();
  });

  test('should successfully register a new user', async ({ page }) => {
    const user = {
      username: `testuser_${Date.now()}}`,
      email: `test${Date.now()}@example.com`,
      password: 'password123',
    };

    await page.getByPlaceholder(/your name/i).fill(user.username);
    await page.getByPlaceholder(/email/i).fill(user.email);
    await page.getByPlaceholder(/password/i).fill(user.password);
    await page.getByRole('button', { name: /sign up/i }).click();

    await expect(page.getByRole('heading', { name: user.username })).toBeVisible();
  });

  test('should show an error for already registered email', async ({ page }) => {
    const user = await createUserByApi();

    await page.getByPlaceholder(/your name/i).fill(user.username);
    await page.getByPlaceholder(/email/i).fill(user.email);
    await page.getByPlaceholder(/password/i).fill(user.password);
    await page.getByRole('button', { name: /sign up/i }).click();

    await expect(page.getByRole('list').filter({ hasText: /409/ })).toBeVisible();
  });
});
