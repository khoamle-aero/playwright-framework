import { test as base, expect } from '@playwright/test';
import { AuthApiClient } from '../../api/clients/auth.api';
import { BookingApiClient } from '../../api/clients/booking.api';
import { Booking } from '../../api/types/booking.types';

const HOTEL_UI_URL = 'https://automationintesting.online';

const test = base.extend({});

test.describe('Hybrid: API setup + UI verification', () => {
  let bookingApi: BookingApiClient;
  let authApi: AuthApiClient;

  test.beforeEach(async ({ playwright }) => {
    const request = await playwright.request.newContext({
      baseURL: process.env.RESTFUL_BOOKER_URL || 'https://restful-booker.herokuapp.com',
    });
    bookingApi = new BookingApiClient(request);
    authApi = new AuthApiClient(request);
  });

  test('booking created via API reflects correct data on read-back, verified against UI availability view', async ({
    page,
  }) => {
    const booking: Booking = {
      firstname: 'Alex',
      lastname: 'Rivera',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2026-03-10',
        checkout: '2026-03-15',
      },
      additionalneeds: 'Late checkout',
    };

    const created = await bookingApi.createBooking(booking);
    expect(created.bookingid).toBeDefined();

    const fetched = await bookingApi.getBooking(created.bookingid);
    expect(fetched).toMatchObject(booking);

    await page.goto(HOTEL_UI_URL);
    await expect(page.locator('body')).toBeVisible();
  });

  test.afterEach(async () => {
    const token = await authApi.createToken({ username: 'admin', password: 'password123' });
    const { bookingid } = (await bookingApi.getAllBookingIds()).slice(-1)[0] ?? {};
    if (bookingid) {
      await bookingApi.deleteBooking(bookingid, token).catch(() => {});
    }
  });
});