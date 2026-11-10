import Ajv, { ValidateFunction } from 'ajv';
import { expect } from '@playwright/test';
import userSchema from '../schemas/user.schema.json';
import orderSchema from '../schemas/order.schema.json';
import errorSchema from '../schemas/error.schema.json';

// allErrors: report every problem in the body, not only the first one
const ajv = new Ajv({ allErrors: true });
// Two formats the schemas use, defined here so no extra package is needed
ajv.addFormat('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
ajv.addFormat('date-time', (s: string) => !Number.isNaN(Date.parse(s)) && /T\d{2}:\d{2}/.test(s));

const SCHEMAS = { user: userSchema, order: orderSchema, error: errorSchema };
export type SchemaName = keyof typeof SCHEMAS;
const compiled = new Map<SchemaName, ValidateFunction>();

/** Fails the test with a readable list of every schema problem. */
export function expectSchema(body: unknown, name: SchemaName): void {
  if (!compiled.has(name)) compiled.set(name, ajv.compile(SCHEMAS[name]));
  const validate = compiled.get(name)!;
  const ok = validate(body);
  const problems = (validate.errors ?? []).map((e) => {
    const extra = e.keyword === 'additionalProperties' ? `: "${e.params.additionalProperty}"` : '';
    return `${e.instancePath || '(body)'} ${e.message}${extra}`;
  });
  // an empty list means the body is valid; otherwise the report shows every problem
  expect(ok ? [] : problems, `body matches the "${name}" schema`).toEqual([]);
}
