import { test, expect } from '@playwright/test';

test('authenticated admin sees dashboard @storage-state', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'QA Admin',
    }),
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Logout' }),
  ).toBeVisible();
});
