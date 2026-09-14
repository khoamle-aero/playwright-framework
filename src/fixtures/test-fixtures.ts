import { test as base } from '@playwright/test';
import { RegistrationPage } from '../pages/parabank/RegistrationPage';
import { AccountsOverviewPage } from '../pages/parabank/AccountsOverviewPage.ts';
import { generateCustomer, type NewCustomer } from '../../utilities/data-generator';

/**
 * ParaBank is a shared public demo instance with no test-isolation of its
 * own, so we register a brand-new customer for every test that needs to be
 * logged in. This avoids flaky collisions with other users hitting the same
 * environment (including other candidates' automation!) and gives each test
 * a deterministic starting balance on its default checking account.
 */
type Fixtures = {
  registeredUser: NewCustomer;
  loggedInPage: AccountsOverviewPage;
};

export const test = base.extend<Fixtures>({
  registeredUser: async ({}, use) => {
    await use(generateCustomer());
  },

  loggedInPage: async ({ page, registeredUser }, use) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
    await registrationPage.register(registeredUser);
    await registrationPage.expectRegistrationSucceeded();

    const overviewPage = new AccountsOverviewPage(page);
    await overviewPage.expectLoggedIn();

    await use(overviewPage); 
  },
});

export { expect } from '@playwright/test';
