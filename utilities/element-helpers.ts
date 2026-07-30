import { Locator, Page } from '@playwright/test';

export class ElementHelpers {
  constructor(private readonly page: Page) {}

  async clickWhenVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async typeText(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }
}
