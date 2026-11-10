# API Testing Framework with Playwright + TypeScript

A complete, runnable API test automation framework, built on the same practice API as the
**API Testing with Postman** course. You learn the API in Postman first, then automate it here.

## Before you start

| You need | Check it with |
|---|---|
| Node.js 20.12 or newer | `node -v` |
| VS Code (recommended), with the "Playwright Test for VSCode" extension | |

## Run it in 3 steps

```
npm install
npx playwright install chromium
npx playwright test
```

Playwright starts the practice API for you (see `webServer` in `playwright.config.ts`), runs all
30 tests and stops the API again. Open the report with `npx playwright show-report`.

| Command | Runs |
|---|---|
| `npm test` | everything (API, UI and API + UI tests) |
| `npm run test:api` | only the API tests (no browser) |
| `npm run test:ui` | only the UI and mixed tests (Chromium) |
| `npm run test:smoke` | only the tests tagged `@smoke` |
| `npm run typecheck` | TypeScript checks, without running anything |
| `npm run api` | starts the practice API on its own (for Postman or manual checks) |
| `npm run learn:1` ... `learn:5` | the five coding lessons in `learn/` (guide, Chapter 1) |

## Folders

| Folder | What is inside |
|---|---|
| `config/` | `env.ts`: base URL and logins per environment (local, staging), from environment variables or `.env` |
| `src/api/` | One class per API area (`AuthApi`, `UsersApi`, `ProductsApi`, `OrdersApi`), all built on `BaseApi` |
| `src/models/` | TypeScript types for users, orders, products and errors |
| `src/schemas/` | JSON Schemas for a user, an order and an error, checked with `expectSchema` |
| `src/fixtures/` | `test.ts`: fixtures for API clients, a shared login token, cleanup, and page objects |
| `src/data/` | `userFactory.ts`: unique test data |
| `src/pages/` | Page objects for the practice shop (`LoginPage`, `OrdersPage`) |
| `src/utils/` | CSV reader and schema helper |
| `data/` | `user-validation.csv` and `orders.json` for data-driven tests |
| `tests/api/` | API tests: health, users CRUD, validation, auth and orders |
| `tests/ui/`, `tests/mixed/` | UI tests and API + UI tests on the practice shop |
| `.github/workflows/` | GitHub Actions workflow that runs everything on every push |
| `learn/` | Five short, runnable TypeScript lessons for beginners |
| `practice-api/` | The practice API (zero dependencies), with a small shop UI |

## Run against another environment

```
# macOS / Linux
TEST_ENV=staging npx playwright test
BASE_URL=https://my-test-server.example.com npx playwright test

# Windows PowerShell
$env:TEST_ENV="staging"; npx playwright test
```

Or copy `.env.example` to `.env` and change the values there. Never commit `.env`.

## If something goes wrong

| You see | Do this |
|---|---|
| `Executable doesn't exist ... chromium` | Run `npx playwright install chromium` |
| `Port 3000 is already in use` / `http://localhost:3000/health is already used` | Another practice API is running. Close it, or leave it running: locally Playwright reuses it |
| Values in `.env` are ignored | Update Node.js to 20.12 or newer (older versions cannot read `.env` files) |
| A test fails | Run `npx playwright show-report`, open the test, and look at its steps and the request and response of each API call |

The guide PDF explains every file, step by step, and Chapter 12 shows how to put the project on GitHub and run it there.
