import { test, expect } from '../../src/fixtures/test';
import { readCsv } from '../../src/utils/csv';
import { uniqueEmail } from '../../src/data/userFactory';
import { expectSchema } from '../../src/utils/schema';

// One test per row of the CSV file: add a row, get a new test. No code change needed.
const rows = readCsv('data/user-validation.csv');

test.describe('Users: validation rules (data-driven)', () => {
  for (const row of rows) {
    test(`${row.case} -> ${row.expectedStatus}`, async ({ usersApi, cleanup }) => {
      const email = row.email === '{unique}' ? uniqueEmail('dd') : row.email;

      const res = await usersApi.create({ name: row.name, email, role: row.role });

      expect(res.status()).toBe(Number(row.expectedStatus));      // CSV values are text
      const body = await res.json();
      if (res.status() === 201) {
        cleanup.add(`delete user ${body.id}`, () => usersApi.delete(body.id));
        expectSchema(body, 'user');
      } else {
        expectSchema(body, 'error');
        expect(body.error.code).toBe(row.expectedCode);
        if (row.field) expect(body.error.details.map((d: { field: string }) => d.field)).toContain(row.field);
      }
    });
  }
});
