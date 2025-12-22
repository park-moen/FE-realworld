import { test, expect } from '@playwright/test';
import { createUserByApi } from '../../utils/api-helper';

test.describe('Login Page', { tag: '@preview' }, () => {
  let user: { username: string; email: string; password: string };

  test.beforeAll(async () => {
    user = await createUserByApi();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display the login form', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should not allow submission with empty fields', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });

  test('should show an error for invalid credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: /email/i }).fill('wrong@meail.com');
    await page.getByRole('textbox', { name: /password/i }).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByRole('list').filter({ hasText: /401/i })).toBeVisible();
  });

  test('should log in successfully with valid credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: /email/i }).fill(user.email);
    await page.getByRole('textbox', { name: /password/i }).fill(user.password);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByRole('heading', { name: user.username })).toBeVisible();
  });
});
