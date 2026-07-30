# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: example.spec.ts >> user can login with valid credentials
- Location: src\tests\example.spec.ts:4:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-test="username"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-test="username"]')

```

```yaml
- heading "Example Domain" [level=1]
- paragraph: This domain is for use in documentation examples without needing permission. Avoid use in operations.
- paragraph:
  - link "Learn more":
    - /url: https://iana.org/domains/example
```

# Test source

```ts
  1  | import { expect, Locator, Page } from '@playwright/test';
  2  | import { BasePage } from './base-page';
  3  | 
  4  | export class LoginPage extends BasePage {
  5  |   private readonly usernameInput: Locator;
  6  |   private readonly passwordInput: Locator;
  7  |   private readonly submitButton: Locator;
  8  | 
  9  |   constructor(page: Page) {
  10 |     super(page);
  11 | 
  12 |     this.usernameInput = page.locator('[data-test="username"]');
  13 |     this.passwordInput = page.locator('[data-test="password"]');
  14 |     this.submitButton = page.locator('[data-test="login-button"]');
  15 |   }
  16 | 
  17 |   async open(): Promise<void> {
  18 |     await this.page.goto('/');
  19 |   }
  20 | 
  21 |   async expectLoginPage(): Promise<void> {
> 22 |     await expect(this.usernameInput).toBeVisible();
     |                                      ^ Error: expect(locator).toBeVisible() failed
  23 |     await expect(this.passwordInput).toBeVisible();
  24 |     await expect(this.submitButton).toBeVisible();
  25 |   }
  26 | 
  27 |   async login(username: string, password: string): Promise<void> {
  28 |     await this.usernameInput.fill(username);
  29 |     await this.passwordInput.fill(password);
  30 |     await this.submitButton.click();
  31 |   }
  32 | }
```