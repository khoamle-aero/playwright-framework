# Playwright Automation Framework

A TypeScript test automation framework demonstrating UI, API, and hybrid testing patterns, with a CI/CD pipeline running both layers in parallel on every push.

Built to showcase practical QA automation skills: Page Object Model design, API client architecture, cross-browser execution, visual regression, accessibility testing, and a real GitHub Actions pipeline.

## What's demonstrated here

| Area | Where |
|---|---|
| UI automation with Page Object Model | src/pages/, src/tests/example.spec.ts |
| API test automation (auth, full CRUD, negative cases) | src/api/, src/tests/api/ |
| Hybrid testing (API for setup, UI for verification) | src/tests/api/hybrid-ui-api.spec.ts |
| Visual regression testing | src/tests/example.spec.ts |
| Accessibility testing (WCAG 2.0 A) | src/tests/example.spec.ts (axe-core) |
| Cross-browser execution | Chromium, Firefox, WebKit projects |
| CI/CD pipeline (parallel jobs, artifacts) | .github/workflows/playwright.yml |

## Installation

git clone this repo, then:

npm install
npx playwright install

Copy .env.example to .env and adjust values if needed.

## Running Tests

Run everything: npx playwright test
Run UI only: npx playwright test --project=chromium --project=firefox --project=webkit
Run API only: npx playwright test --project=api

## CI/CD

GitHub Actions runs two parallel jobs on every push: ui-tests and api-tests. Both upload HTML reports as artifacts.

## Best Practices Followed

- Selectors and API calls live in page objects / API clients
- Shared setup goes through fixtures
- Test data built via factory functions, not hardcoded
- Secrets never committed; .env is git-ignored
- Serial execution used only where a genuine data dependency requires it
