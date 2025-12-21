import { test, expect } from '@playwright/test';
import { createUserByApi } from '../utils/api-helper';

test(
  'should logIn successfully - preview',
  {
    tag: '@preview',
  },
  async ({ page }) => {
    const user = await createUserByApi();

    await page.goto('/login');

    await page.getByPlaceholder('Email').fill(user.email);
    await page.getByPlaceholder('Password').fill(user.password);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(new RegExp(`/profile/${user.username}`));
    await expect(page.getByRole('heading', { name: user.username })).toBeVisible();
  },
);

test('should logIn successfully', async ({ page }) => {
  const user = await createUserByApi();

  await page.goto('/login');

  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder('Password').fill(user.password);
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL(new RegExp(`/profile/${user.username}`));
  await expect(page.getByRole('heading', { name: user.username })).toBeVisible();
});
