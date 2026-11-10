import { NewUser, Role } from '../models/types';

let counter = 0;

/** A unique email on every call, even when tests run in parallel. */
export function uniqueEmail(prefix = 'user'): string {
  counter += 1;
  return `${prefix}.${Date.now()}.${process.pid}.${counter}@example.com`;
}

/** A valid user with sensible defaults; pass only what the test cares about. */
export function buildUser(overrides: Partial<NewUser> = {}): NewUser {
  return { name: 'Sara Khan', email: uniqueEmail('sara'), role: 'tester' as Role, ...overrides };
}
