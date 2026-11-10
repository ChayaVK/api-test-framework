import { test, expect } from '../../src/fixtures/test';

test('the API is up @smoke', async ({ request }) => {
  const res = await request.get('/health');
  expect(res.status()).toBe(200);
  expect((await res.json()).status).toBe('UP');
});
