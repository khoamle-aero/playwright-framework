# Playwright Automation Framework

A TypeScript test automation framework demonstrating UI, API, and hybrid testing patterns, with a CI/CD pipeline running three layers in parallel on every push.

Built to showcase practical QA automation skills: Page Object Model design, API client architecture, cross-browser execution, visual regression, accessibility testing, manual/exploratory API testing via Postman, and a real GitHub Actions pipeline — including the kind of debugging (environment config, CI-specific failures, flaky test isolation, dependency lockfile drift) that comes up in day-to-day automation work.

## What's demonstrated here

| Area | Where |
|---|---|
| UI automation with Page Object Model | `src/pages/`, `src/tests/example.spec.ts` |
| API test automation (auth, full CRUD, negative cases) | `src/api/`, `src/tests/api/` |
| Hybrid testing (API for setup, UI for verification) | `src/tests/api/hybrid-ui-api.spec.ts` |
| Manual/exploratory API testing (Postman + Newman) | `postman/` |
| Visual regression testing | `src/tests/example.spec.ts` (`toHaveScreenshot`) |
| Accessibility testing (WCAG 2.0 A) | `src/tests/example.spec.ts` (axe-core) |
| Cross-browser execution | Chromium, Firefox, WebKit projects |
| CI/CD pipeline (3 parallel jobs, artifacts) | `.github/workflows/playwright.yml` |

## Project Structure

```text
playwright-framework/
├── src/
│   ├── api/
│   │   ├── clients/          # API client classes (one per resource, mirrors POM)
│   │   │   ├── base-api-client.ts
│   │   │   ├── auth.api.ts
│   │   │   └── booking.api.ts
│   │   └── types/             # TypeScript interfaces for API payloads
│   ├── fixtures/
│   │   ├── base.fixture.ts    # Injects UI page objects into tests
│   │   └── api.fixture.ts     # Injects API clients into tests
│   ├── pages/                 # Page Object Model classes for UI tests
│   └── tests/
│       ├── example.spec.ts    # UI: login, visual regression, accessibility
│       └── api/                # API: auth, CRUD, hybrid UI+API
├── postman/                    # Postman collection for manual/exploratory API testing
├── test-data/                  # JSON test data (e.g. login credentials)
├── config/                     # Environment configuration
├── constants/                  # Shared URLs and selectors
├── utilities/                  # Reusable helpers (waits, screenshots, etc.)
├── reports/                     # HTML and JSON reports (generated)
├── .github/workflows/           # CI pipeline
├── playwright.config.ts
└── .env.example                 # Template for local environment variables
```

## Architecture notes

**API layer mirrors the UI layer's design.** `BaseApiClient` plays the same role `BasePage` plays for UI tests: shared request/response handling that every resource-specific client (`AuthApiClient`, `BookingApiClient`) extends. Fixtures (`api.fixture.ts`) inject ready-to-use clients into tests the same way `base.fixture.ts` injects page objects — so switching between reading a UI test and an API test in this repo, the pattern is already familiar.

**Two separate base URLs, one config.** UI tests run against [SauceDemo](https://saucedemo.com); API tests run against [Restful-Booker](https://restful-booker.herokuapp.com), a purpose-built API testing playground. `playwright.config.ts` defines a dedicated `api` project with its own `baseURL`, scoped via `testMatch`/`testIgnore` so the two suites never cross-contaminate.

**The CRUD suite runs in serial, deliberately.** `booking-crud.spec.ts` uses `test.describe.configure({ mode: 'serial' })` because it exercises a real dependency chain — create → read → update → delete — where each step needs the ID from the previous one. This is called out explicitly in comments since `fullyParallel: true` is the project default, and this file is the intentional exception.

**Postman complements, not duplicates, the automated suite.** The `postman/` collection covers the same Restful-Booker CRUD flow as `src/tests/api/`, but exists to demonstrate manual/exploratory testing skill and Postman-specific technique (test scripts, collection variables chaining `token`/`bookingId` across requests) — a common day-to-day QA tool alongside code-based automation. It's runnable both in the Postman GUI and headlessly via Newman.

## Installation

```bash
git clone <this-repo>
cd playwright-framework
npm install
npx playwright install
```

Copy `.env.example` to `.env` and set `BASE_URL` if you want to override the default:

```bash
cp .env.example .env
```

## Running Tests

Run everything (UI + API):

```bash
npx playwright test
```

Run just the UI suite:

```bash
npx playwright test --project=chromium --project=firefox --project=webkit
```

Run just the API suite:

```bash
npx playwright test --project=api
```

Run the Postman collection via Newman:

```bash
npm run test:postman
```

Run a specific file:

```bash
npx playwright test src/tests/example.spec.ts
```

Open the HTML report:

```bash
npx playwright show-report reports/html
```

## Reporting

- HTML report: `reports/html`
- JSON report: `reports/results.json`
- Screenshots, videos, and traces captured on failure/retry
- Newman prints a pass/fail summary table to the console; an HTML report can be added via `newman-reporter-htmlextra`

## Environment Configuration

| Variable | Purpose | Default |
|---|---|---|
| `BASE_URL` | UI test target | `https://example.com` |
| `RESTFUL_BOOKER_URL` | API test target | `https://restful-booker.herokuapp.com` |

Override at runtime:

```bash
BASE_URL=https://staging.example.com npx playwright test
```

## CI/CD

GitHub Actions runs three jobs in parallel on every push and pull request to `main`:

- **`ui-tests`** — Chromium, Firefox, WebKit, with HTML/trace/video artifacts on failure
- **`api-tests`** — auth, CRUD, and hybrid suites against Restful-Booker
- **`postman-tests`** — the Postman collection, run headlessly via Newman

All jobs upload their reports as downloadable artifacts, so a failure can be diagnosed without re-running locally.

## Best Practices Followed

- Selectors and API calls live in page objects / API clients, never inline in test files
- Shared setup goes through fixtures, not repeated per-test
- Test data lives in JSON files or is built via factory functions (`buildBooking()`), not hardcoded inline
- Secrets and environment-specific values are never committed — `.env` is git-ignored, `.env.example` documents what's needed
- Serial execution is used only where a genuine data dependency requires it, and is commented to explain why
- `package-lock.json` is committed and kept in sync with `package.json` so `npm ci` behaves identically in CI and locally
