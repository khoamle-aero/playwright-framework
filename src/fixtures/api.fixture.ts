import { test as base } from '@playwright/test';
import { AuthApiClient } from '../api/clients/auth.api';
import { BookingApiClient } from '../api/clients/booking.api';

type ApiClients = {
  authApi: AuthApiClient;
  bookingApi: BookingApiClient;
};

export const test = base.extend<ApiClients>({
  authApi: async ({ request }, use) => {
    await use(new AuthApiClient(request));
  },

  bookingApi: async ({ request }, use) => {
    await use(new BookingApiClient(request));
  },
});

export { expect } from '@playwright/test';
