import { type Locator, type Page, expect } from '@playwright/test';

export class AccountsOverviewPage {
  readonly page: Page;
  readonly accountTable: Locator;
  readonly accountRows: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountTable = page.locator('#accountTable');
    this.accountRows = this.accountTable.locator('tbody tr');
    this.logoutLink = page.locator('a[href="logout.htm"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('overview.htm');
  }

  /** Returns the list of account IDs currently shown on the overview page. */
  async getAccountIds(): Promise<string[]> {
    const links = this.accountRows.locator('td:first-child a');
    const count = await links.count();
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
      ids.push((await links.nth(i).innerText()).trim());
    }
    return ids;
  }

  /** Reads the displayed balance for a given account ID, as a number. */
  async getBalance(accountId: string): Promise<number> {
    const row = this.accountRows.filter({ hasText: accountId });
    const balanceText = await row.locator('td').nth(1).innerText();
    return parseCurrency(balanceText);
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/overview\.htm/);
    await expect(this.accountTable).toBeVisible();
  }
}

/** Converts a currency string like "$1,234.56" into a plain number. */
export function parseCurrency(value: string): number {
  return Number(value.replace(/[^0-9.-]+/g, ''));
}
