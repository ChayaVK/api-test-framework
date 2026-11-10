import { test, expect } from '../../src/fixtures/test';
import { env } from '../../config/env';
import { Order } from '../../src/models/types';

// Create the data with the API (fast and reliable), then check what the user sees in the browser.
test.describe('API + UI', () => {
  test('an order placed through the API appears on My Orders', async ({ ordersApi, loginPage, ordersPage, cleanup }) => {
    const order: Order = await test.step('Arrange: place an order with the API', async () => {
      const res = await ordersApi.place(7, 3);          // 3 x Water Bottle
      expect(res.status()).toBe(201);
      return res.json();
    });
    cleanup.add(`cancel order ${order.id}`, () => ordersApi.cancel(order.id));

    await test.step('Act: log in through the UI', async () => {
      await loginPage.open();
      await loginPage.login(env.user.username, env.user.password);
    });

    await test.step('Assert: the new row shows the same data', async () => {
      const row = ordersPage.row(order.id);
      await expect(row).toBeVisible();
      await expect(row).toContainText('Water Bottle');
      await expect(row.locator('td').nth(2)).toHaveText(String(order.quantity));
      await expect(row.locator('td').nth(3)).toHaveText(String(order.total));
      await expect(ordersPage.status(order.id)).toHaveText('PLACED');
    });
  });

  test('cancelling through the API changes the status in the UI', async ({ page, ordersApi, loginPage, ordersPage }) => {
    const order: Order = await (await ordersApi.place(10, 1)).json();
    await loginPage.open();
    await loginPage.login(env.user.username, env.user.password);
    await expect(ordersPage.status(order.id)).toHaveText('PLACED');

    await ordersApi.cancel(order.id);
    await page.reload();

    await expect(ordersPage.status(order.id)).toHaveText('CANCELLED');
  });
});
