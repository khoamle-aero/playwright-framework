# Playwright TypeScript Automation Framework

A modern, enterprise-ready Playwright TypeScript framework built around the Page Object Model (POM), reusable fixtures, utilities, and environment-based configuration for reliable UI automation.

## Features

- Page Object Model for maintainable test design
- Reusable fixtures and utility helpers
- Cross-browser execution for Chromium, Firefox, and WebKit
- Automatic screenshots, traces, and videos on failure
- HTML and JSON reporting
- Environment-based configuration with dotenv support
- CI/CD-friendly setup for GitHub Actions

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
npx playwright install
```

## Project Structure

```text
playwright-framework/
├── config/              # Environment and application config
├── constants/           # Shared URLs, selectors, and constants
├── fixtures/            # Custom Playwright fixtures
├── pages/               # Page Object Model classes
├── tests/               # Test specifications
├── test-data/           # JSON or fixture-based test data
├── utilities/           # Reusable helpers such as waits, screenshots, browser launchers
├── reports/             # HTML and JSON reports
├── logs/                # Execution logs
├── playwright.config.ts # Playwright configuration
├── .env                 # Environment variables
```

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run a specific test file:

```bash
npx playwright test tests/example.spec.ts
```

Run a specific browser project:

```bash
npx playwright test --project=chromium
```

Open the HTML report:

```bash
npx playwright show-report reports/html
```

## Reporting

The framework is configured to generate:

- HTML report in reports/html
- JSON report in reports/results.json
- Screenshots on failure
- Videos on failure
- Trace files on retry/failure

## Environment Configuration

Set environment variables in the .env file:

```env
BASE_URL=https://example.com
```

You can also override values at runtime:

```bash
BASE_URL=https://staging.example.com npx playwright test
```

## GitHub Actions Integration

A sample workflow can run the suite on every push or pull request.

```yaml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: reports
```

## Best Practices

- Keep selectors in page objects rather than tests
- Use fixtures for shared test setup
- Store test data externally in JSON files
- Avoid hardcoded URLs inside tests
- Use descriptive test names and assertions
- Capture screenshots and traces for debugging failures
