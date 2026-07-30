import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class HomePage extends BasePage {
  private readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading');
  }

  async expectLoaded(): Promise<void> {
    await this.heading.waitFor({ state: 'visible' });
  }
}
