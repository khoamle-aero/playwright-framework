import { test, expect } from '../fixtures/base.fixture';
import { LoginPage } from '../pages/login.page';
import userData from '../../test-data/login-users.json';
import AxeBuilder from '@axe-core/playwright';

test('user can login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  
  await loginPage.expectLoginPage();
  await loginPage.login(userData.validUser.username, userData.validUser.password);
  

  await expect(page).toHaveURL(/inventory/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();

});

test('inventory page matches visual baseline', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(userData.validUser.username, userData.validUser.password);
  
  // Captures a snapshot and compares it to a baseline image
  await expect(page).toHaveScreenshot('inventory-page.png', {
    mask: [page.locator('.inventory_item_img')] // Masks dynamic images to avoid false positives
  });
});

test('login page meets accessibility standards', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a']) // Only scans for critical WCAG 2.0 Level A rules
    .analyze();

  // Extract the specific failure data into the violations variable
  const violations = accessibilityScanResults.violations.map(v => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    help: v.help
  }));

  expect(violations, 'Accessibility violations found!').toEqual([]);
});
