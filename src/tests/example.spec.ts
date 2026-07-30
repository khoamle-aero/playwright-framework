import { test, expect } from '../fixtures/base.fixture';
import { LoginPage } from '../pages/login.page';

test('user can login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  
  await loginPage.expectLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory/);
  await expect(page.getByRole('heading', { name: /products/i })).toBeVisible();
});
