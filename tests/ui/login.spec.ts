import { test, expect } from '../../src/fixtures/test';
import { env } from '../../config/env';

test.describe('Shop UI: log in', () => {
  test('a valid user lands on My Orders @smoke', async ({ page, loginPage, ordersPage }) => {
    await loginPage.open();
    await loginPage.login(env.user.username, env.user.password);

    await expect(page).toHaveURL(/\/shop\/orders$/);
    await expect(ordersPage.heading).toBeVisible();
    await expect(ordersPage.signedInAs).toHaveText('Signed in as Test User');
  });

  test('a wrong password shows the API error message', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(env.user.username, 'wrong-password');

    await expect(loginPage.error).toHaveText('Username or password is wrong.');
  });
});
