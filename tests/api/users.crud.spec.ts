import { test, expect } from '../../src/fixtures/test';
import { buildUser } from '../../src/data/userFactory';
import { expectSchema } from '../../src/utils/schema';
import { User, Page } from '../../src/models/types';

test.describe('Users: create, read, update, delete', () => {
  test('create a user @smoke', async ({ usersApi, cleanup }) => {
    const newUser = buildUser();

    const res = await usersApi.create(newUser);

    expect(res.status()).toBe(201);
    const user: User = await res.json();
    cleanup.add(`delete user ${user.id}`, () => usersApi.delete(user.id));
    expectSchema(user, 'user');
    expect(user).toMatchObject({ name: newUser.name, email: newUser.email, role: 'tester', active: true });
    expect(res.headers()['location']).toBe(`/api/users/${user.id}`);
  });

  test('read, replace, update and delete a user', async ({ usersApi }) => {
    const created: User = await (await usersApi.create(buildUser())).json();

    await test.step('GET returns the same user', async () => {
      const res = await usersApi.get(created.id);
      expect(res.status()).toBe(200);
      expect(await res.json()).toEqual(created);
    });

    await test.step('PUT replaces the whole user', async () => {
      const res = await usersApi.replace(created.id, { name: 'Sara K', email: created.email, role: 'developer', active: true });
      expect(res.status()).toBe(200);
      expect(await res.json()).toMatchObject({ name: 'Sara K', role: 'developer' });
    });

    await test.step('PATCH changes only the fields sent', async () => {
      const res = await usersApi.update(created.id, { active: false });
      expect(res.status()).toBe(200);
      expect(await res.json()).toMatchObject({ name: 'Sara K', role: 'developer', active: false });
    });

    await test.step('DELETE removes it, and GET then gives 404', async () => {
      expect((await usersApi.delete(created.id)).status()).toBe(204);
      expect((await usersApi.get(created.id)).status()).toBe(404);
    });
  });

  test('filter the list by role', async ({ usersApi }) => {
    const res = await usersApi.list({ role: 'tester', limit: 50 });

    expect(res.status()).toBe(200);
    const page: Page<User> = await res.json();
    expect(page.data.length).toBeGreaterThan(0);
    for (const user of page.data) expect(user.role).toBe('tester');
  });

  test('an unknown user gives 404 with a clear error', async ({ usersApi }) => {
    const res = await usersApi.get(999999);

    expect(res.status()).toBe(404);
    const body = await res.json();
    expectSchema(body, 'error');
    expect(body.error.code).toBe('USER_NOT_FOUND');
  });
});
