import { randomUUID } from 'node:crypto';

/**
 * Lightweight test-data helpers.
 *
 * ParaBank is a shared public demo instance, so every test run that creates
 * a customer must use a unique username (the app enforces uniqueness and
 * will otherwise fail registration with "This username already exists.").
 * We generate deterministic-but-unique values per run instead of pulling in
 * a full faker dependency, keeping the framework dependency-light.
 */

export interface NewCustomer {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
}

/**
 * Returns a short, effectively-collision-proof suffix safe for usernames.
 *
 * A previous version used `Date.now()` + a 3-digit random number, which can
 * collide when Playwright runs multiple workers in parallel and two tests
 * happen to generate a customer within the same millisecond — that's what
 * produced the intermittent "This username already exists." failures.
 * crypto.randomUUID() draws from the OS's cryptographic RNG, so collisions
 * are not a realistic concern even across many parallel workers.
 */
function uniqueSuffix(): string {
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

/** Builds a fully-populated, unique customer registration payload. */
export function generateCustomer(overrides: Partial<NewCustomer> = {}): NewCustomer {
  const suffix = uniqueSuffix();

  return {
    firstName: 'Kev',
    lastName: 'Automation',
    street: '123 Test Street',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    phoneNumber: '555-0100',
    ssn: '123-45-6789',
    username: `qauser_${suffix}`,
    password: 'Password123!',
    ...overrides,
  };
}

/** Returns a random dollar amount (as a string) within the given bounds. */
export function randomAmount(min = 5, max = 100): string {
  const value = Math.random() * (max - min) + min;
  return value.toFixed(2);
}