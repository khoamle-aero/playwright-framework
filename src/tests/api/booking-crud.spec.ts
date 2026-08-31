import { test, expect } from '../../fixtures/api.fixture';
import { Booking } from '../../api/types/booking.types';

function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'Jim',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-01-01',
      checkout: '2026-01-05',
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

test.describe('Booking API - CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  let token: string;
  let bookingId: number;

  test.beforeAll(async ({ playwright }) => {
    const request = await playwright.request.newContext({
      baseURL: process.env.RESTFUL_BOOKER_URL || 'https://restful-booker.herokuapp.com',
    });
    const response = await request.post('/auth', {
      data: { username: 'admin', password: 'password123' },
    });
    const body = await response.json();
    token = body.token;
    await request.dispose();
  });

  test('creates a new booking', async ({ bookingApi }) => {
    const newBooking = buildBooking();
    const created = await bookingApi.createBooking(newBooking);

    expect(created.bookingid).toBeDefined();
    expect(created.booking).toMatchObject(newBooking);

    bookingId = created.bookingid;
  });

  test('reads back the created booking', async ({ bookingApi }) => {
    const booking = await bookingApi.getBooking(bookingId);
    expect(booking.firstname).toBe('Jim');
    expect(booking.lastname).toBe('Brown');
  });

  test('updates the booking with new details (PUT)', async ({ bookingApi }) => {
    const updated = buildBooking({ firstname: 'James', totalprice: 222 });
    const result = await bookingApi.updateBooking(bookingId, updated, token);

    expect(result.firstname).toBe('James');
    expect(result.totalprice).toBe(222);
  });

  test('partially updates the booking (PATCH)', async ({ bookingApi }) => {
    const result = await bookingApi.partialUpdateBooking(
      bookingId,
      { firstname: 'Jamie' },
      token
    );

    expect(result.firstname).toBe('Jamie');
    expect(result.lastname).toBe('Brown');
  });

  test('deletes the booking', async ({ bookingApi }) => {
    const response = await bookingApi.deleteBooking(bookingId, token);
    expect(response.status()).toBe(201);
  });

  test('confirms the deleted booking no longer exists', async ({ bookingApi }) => {
    await expect(bookingApi.getBooking(bookingId)).rejects.toThrow(/404/);
  });

  test('rejects update without a valid auth token', async ({ bookingApi }) => {
    const newBooking = buildBooking();
    const created = await bookingApi.createBooking(newBooking);

    await expect(
      bookingApi.updateBooking(created.bookingid, newBooking, 'invalid-token')
    ).rejects.toThrow(/403/);
  });
});