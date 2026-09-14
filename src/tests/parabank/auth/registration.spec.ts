import { test, expect } from '../../../fixtures/test-fixtures';
import { RegistrationPage } from '../../../pages/parabank/RegistrationPage';
import { generateCustomer } from '../../../../utilities/data-generator';

test.describe('Customer Registration', () => {
  test('REG-01: register a new customer with valid data', async ({ page, registeredUser }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
    await registrationPage.register(registeredUser);

    await registrationPage.expectRegistrationSucceeded();
  });

  test('REG-02: registering with a duplicate username shows an inline error', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const customer = generateCustomer();

    // First registration establishes the username.
    await registrationPage.goto();
    await registrationPage.register(customer);
    await registrationPage.expectRegistrationSucceeded();

    // Log out, then attempt to register the same username again.
    await page.locator('a[href="logout.htm"]').click();
    await registrationPage.goto();
    await registrationPage.register(customer);

    await registrationPage.expectUsernameAlreadyExists();
  });

  test('REG-03: required fields show validation errors when left empty', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();

    // Submit with everything blank.
    await registrationPage.registerButton.click();

    // ParaBank renders a per-field <span class="error"> for each required
    // field left empty; first name is the first in the form.
    await expect(page.locator('#customer\\.firstName\\.errors')).toContainText('required');
    await expect(page).toHaveURL(/register\.htm/);
  });

  test('REG-04: mismatched password and confirm-password blocks submission', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const customer = generateCustomer({ password: 'Password123!' });

    await registrationPage.goto();
    await registrationPage.firstName.fill(customer.firstName);
    await registrationPage.lastName.fill(customer.lastName);
    await registrationPage.street.fill(customer.street);
    await registrationPage.city.fill(customer.city);
    await registrationPage.state.fill(customer.state);
    await registrationPage.zipCode.fill(customer.zipCode);
    await registrationPage.phoneNumber.fill(customer.phoneNumber);
    await registrationPage.ssn.fill(customer.ssn);
    await registrationPage.username.fill(customer.username);
    await registrationPage.password.fill(customer.password);
    await registrationPage.confirmPassword.fill('SomethingDifferent!');
    await registrationPage.registerButton.click();

    await expect(page.locator('#repeatedPassword\\.errors')).toContainText('Passwords did not match');
    await expect(page).toHaveURL(/register\.htm/);
  });
});
