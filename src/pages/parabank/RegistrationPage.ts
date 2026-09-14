import { type Locator, type Page, expect } from '@playwright/test';
import type { NewCustomer } from '../../../utilities/data-generator';

export class RegistrationPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly street: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly zipCode: Locator;
  readonly phoneNumber: Locator;
  readonly ssn: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly registerButton: Locator;
  readonly usernameTakenError: Locator;
  readonly successHeading: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('input[id="customer.firstName"]');
    this.lastName = page.locator('input[id="customer.lastName"]');
    this.street = page.locator('input[id="customer.address.street"]');
    this.city = page.locator('input[id="customer.address.city"]');
    this.state = page.locator('input[id="customer.address.state"]');
    this.zipCode = page.locator('input[id="customer.address.zipCode"]');
    this.phoneNumber = page.locator('input[id="customer.phoneNumber"]');
    this.ssn = page.locator('input[id="customer.ssn"]');
    this.username = page.locator('input[id="customer.username"]');
    this.password = page.locator('input[id="customer.password"]');
    this.confirmPassword = page.locator('input[id="repeatedPassword"]');
    this.registerButton = page.locator('input[value="Register"]');
    this.usernameTakenError = page.locator('#customer\\.username\\.errors');
    this.successHeading = page.getByRole('heading', { name: 'Welcome' });
    this.successMessage = page.getByText('Your account was created successfully. You are now logged in.');
  }

  async goto(): Promise<void> {
    await this.page.goto('register.htm');
  }

  async register(customer: NewCustomer): Promise<void> {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.street.fill(customer.street);
    await this.city.fill(customer.city);
    await this.state.fill(customer.state);
    await this.zipCode.fill(customer.zipCode);
    await this.phoneNumber.fill(customer.phoneNumber);
    await this.ssn.fill(customer.ssn);
    await this.username.fill(customer.username);
    await this.password.fill(customer.password);
    await this.confirmPassword.fill(customer.password);
    await this.registerButton.click();
  }

  async expectRegistrationSucceeded(): Promise<void> {
    await expect(this.successHeading).toBeVisible();
    await expect(this.successMessage).toBeVisible();

  }

  async expectUsernameAlreadyExists(): Promise<void> {
    await expect(this.usernameTakenError).toHaveText(/already exists/i);
    // Registration should not have navigated away on failure.
    await expect(this.page).toHaveURL(/register\.htm/);
  }
}
