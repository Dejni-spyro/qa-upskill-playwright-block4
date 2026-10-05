import { test, expect } from '../fixtures/test.fixture';
import { buildTestUser, UsersApi } from '../helpers/api.helper';

const testUser = buildTestUser();
let testUserId: number | undefined;

test.describe('Login to the workspace', () => {
  test.beforeAll(async ({ request }) => {
    const usersApi = new UsersApi(request);
    await usersApi.authenticateAsAdmin();
    testUserId = await usersApi.create(testUser);
  });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(testUser.email, testUser.password);
  });

  test('user sees the dashboard after a successful login', {
    tag: '@smoke',
  }, async ({ page }) => {
    await test.step('Assert: user identity is displayed', async () => {
      await expect(
        page.getByRole('heading', { name: testUser.fullName }),
      ).toBeVisible();
    });

    await test.step('Assert: authenticated controls are available', async () => {
      await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Statistics' })).toBeVisible();
    });
  });

  test.afterAll(async ({ request }) => {
    if (testUserId !== undefined) {
      const cleanupApi = new UsersApi(request);
      await cleanupApi.authenticateAsAdmin();
      await cleanupApi.remove(testUserId);
    }
  });
});
