import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class DashboardPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly menuButton: Locator;
  private readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole('heading');
    this.menuButton = page.getByRole('button', { name: /menu/i });
    this.logoutButton = page.getByRole('link', { name: /logout/i });
  }

  async open(): Promise<void> {
    await this.goto('/dashboard');
  }

  async expectLoaded(): Promise<void> {
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutButton.click();
  }
}
