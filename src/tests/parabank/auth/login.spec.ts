import { test, expect } from '../../../fixtures/test-fixtures';
import { LoginPage } from '../../../pages/parabank/LoginPage';
import { AccountsOverviewPage } from '../../../pages/parabank/AccountsOverviewPage';

test.describe('Login / Logout / Session', () => {
  test('LOGIN-01: valid credentials land on Accounts Overview', async ({ page, registeredUser, loggedInPage }) => {
    // `loggedInPage` fixture already registered + logged this user in;
    // log out here so we can exercise the login form directly with known
    // valid credentials.
    await loggedInPage.logout();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(registeredUser.username, registeredUser.password);

    await expect(page).toHaveURL(/overview\.htm/);
  });

  test('LOGIN-02: invalid credentials show an error and stay on login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('not_a_real_user', 'wrong_password');

    await loginPage.expectLoginError();
  });

  test('LOGIN-03: submitting with empty username and password does not crash', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginButton.click()
  
    // FIX: ParaBank redirects to the login processing endpoint upon failure
    await expect(page).toHaveURL(/login\.htm/);
    
    // Ensure the login form inputs are still available for re-entry
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('LOGIN-04: logout redirects to the public index and blocks protected pages', async ({ loggedInPage, page }) => {
    await loggedInPage.logout();
    await expect(page).toHaveURL(/index\.htm/);

    // Attempting to return to an authenticated page directly should not
    // show the logged-in account view.
    await page.goto('overview.htm');
    await expect(page.locator('#accountTable')).not.toBeVisible();
  });

  test('LOGIN-05: direct navigation to overview.htm after logout redirects to login', async ({ loggedInPage, page }) => {
    await loggedInPage.logout();
    await page.goto('overview.htm');

    const loginPage = new LoginPage(page);
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('LOGIN-06: session persists across in-app navigation without re-login', async ({ loggedInPage, page }) => {
    await page.goto('openaccount.htm');
    await expect(page).not.toHaveURL(/index\.htm/);

    await page.goto('transfer.htm');
    await expect(page).not.toHaveURL(/index\.htm/);

    const overviewPage = new AccountsOverviewPage(page);
    await overviewPage.goto();
    await overviewPage.expectLoggedIn();
  });
});
