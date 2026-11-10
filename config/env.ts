// One place for every setting that changes between environments.
// Values come from environment variables (or a .env file), with defaults for the local practice API.
import fs from 'node:fs';

// Load .env if it exists (Node.js 20.12+ has this built in; no extra package needed).
if (fs.existsSync('.env') && typeof process.loadEnvFile === 'function') {
  process.loadEnvFile('.env');
}

const ENVIRONMENTS = {
  local: 'http://localhost:3000',
  staging: 'https://staging.example.com', // replace with your real test server
} as const;

type EnvName = keyof typeof ENVIRONMENTS;
const name = (process.env.TEST_ENV ?? 'local') as EnvName;
if (!(name in ENVIRONMENTS)) {
  throw new Error(`Unknown TEST_ENV "${name}". Use one of: ${Object.keys(ENVIRONMENTS).join(', ')}`);
}

export const env = {
  name,
  baseURL: process.env.BASE_URL ?? ENVIRONMENTS[name],
  user: { username: process.env.API_USER ?? 'tester', password: process.env.API_PASSWORD ?? 'Test@123' },
  admin: { username: process.env.ADMIN_USER ?? 'admin', password: process.env.ADMIN_PASSWORD ?? 'Admin@123' },
};
