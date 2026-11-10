import { test, expect } from '../../src/fixtures/test';
import { env } from '../../config/env';
import { AuthApi } from '../../src/api/AuthApi';
import { OrdersApi } from '../../src/api/OrdersApi';
import { UsersApi } from '../../src/api/UsersApi';

test.describe('Authentication and authorization', () => {
  test('a wrong password gives 401 @smoke', async ({ authApi }) => {
    const res = await authApi.login(env.user.username, 'wrong-password');
    expect(res.status()).toBe(401);
    expect((await res.json()).error.code).toBe('INVALID_CREDENTIALS');
  });

  test('a valid token tells the API who I am', async ({ authApi, userToken }) => {
    const res = await authApi.withToken(userToken).me();
    expect(res.status()).toBe(200);
    expect((await res.json()).username).toBe(env.user.username);
  });

  test('no token gives 401', async ({ request }) => {
    const res = await new OrdersApi(request).list();      // a client without a token
    expect(res.status()).toBe(401);
  });

  test('a broken token gives 401', async ({ request, userToken }) => {
    const res = await new OrdersApi(request, userToken + 'x').list();
    expect(res.status()).toBe(401);
  });

  test('a normal user cannot use an admin action (403)', async ({ request, userToken }) => {
    const res = await new UsersApi(request, userToken).adminDelete(2);
    expect(res.status()).toBe(403);
  });

  test("a user cannot read another user's order (BOLA)", async ({ ordersApi }) => {
    const res = await ordersApi.get(1002);               // belongs to buyer2
    expect(res.status()).toBe(404);
    expect(await res.text()).not.toContain('buyer2');
  });
});
