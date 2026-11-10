import { test as base, expect, APIRequestContext } from '@playwright/test';
import { env } from '../../config/env';
import { AuthApi } from '../api/AuthApi';
import { UsersApi } from '../api/UsersApi';
import { OrdersApi } from '../api/OrdersApi';
import { ProductsApi } from '../api/ProductsApi';
import { LoginPage } from '../pages/LoginPage';
import { OrdersPage } from '../pages/OrdersPage';

type Fixtures = {
  authApi: AuthApi;
  usersApi: UsersApi;
  productsApi: ProductsApi;
  ordersApi: OrdersApi;          // logged in as the normal test user
  cleanup: Cleanup;
  loginPage: LoginPage;
  ordersPage: OrdersPage;
};
type WorkerFixtures = {
  userToken: string;             // one login per worker, shared by all its tests
};

/** Collects "undo" steps during a test and runs them afterwards, even when the test fails. */
export class Cleanup {
  private steps: { name: string; run: () => Promise<unknown> }[] = [];
  add(name: string, run: () => Promise<unknown>) { this.steps.push({ name, run }); }
  async runAll() {
    for (const s of this.steps.reverse()) {
      await base.step(`cleanup: ${s.name}`, async () => { await s.run(); });
    }
  }
}

export const test = base.extend<Fixtures, WorkerFixtures>({
  // Worker-scoped: logs in once per worker process, not once per test
  userToken: [async ({ playwright }, use) => {
    const request: APIRequestContext = await playwright.request.newContext({ baseURL: env.baseURL });
    const token = await new AuthApi(request).getToken(env.user.username, env.user.password);
    await use(token);
    await request.dispose();
  }, { scope: 'worker' }],

  authApi: async ({ request }, use) => { await use(new AuthApi(request)); },
  usersApi: async ({ request }, use) => { await use(new UsersApi(request)); },
  productsApi: async ({ request }, use) => { await use(new ProductsApi(request)); },
  ordersApi: async ({ request, userToken }, use) => { await use(new OrdersApi(request, userToken)); },

  cleanup: async ({}, use) => {
    const cleanup = new Cleanup();
    await use(cleanup);
    await cleanup.runAll();      // runs after the test, pass or fail
  },

  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  ordersPage: async ({ page }, use) => { await use(new OrdersPage(page)); },
});

export { expect };
