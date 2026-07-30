import { Locator, Page, expect } from '@playwright/test';

export class WaitHelper {
  constructor(private readonly page: Page) {}

  async waitForVisible(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load', timeout = 30000): Promise<void> {
    await this.page.waitForLoadState(state, { timeout });
  }

  async waitForURL(urlPart: string | RegExp, timeout = 10000): Promise<void> {
    await expect(this.page).toHaveURL(urlPart, { timeout });
  }
}
