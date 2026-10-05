import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const authFile = 'playwright/.auth/admin.json';

const adminEmail =
  process.env.QA_UPSKILL_ADMIN_EMAIL ?? 'admin@qaupskill.local';

const adminPassword =
  process.env.QA_UPSKILL_ADMIN_PASSWORD;

if (!adminPassword) {
  throw new Error(
    'QA_UPSKILL_ADMIN_PASSWORD environment variable is required',
  );
}

setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(adminEmail, adminPassword);

  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'QA Admin',
    }),
  ).toBeVisible();

  await mkdir(path.dirname(authFile), { recursive: true });

  await page.context().storageState({
    path: authFile,
  });
});
