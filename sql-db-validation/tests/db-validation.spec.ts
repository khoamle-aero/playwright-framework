// tests/db-validation.spec.ts
//
// Pattern demonstrated: don't just trust the API's response — query the
// database directly to confirm the write actually happened, with the
// correct values. This catches bugs a pure API/UI assertion would miss
// (e.g. an endpoint that returns 201 but silently drops a field, or
// rounds/truncates a value on the way into the DB).

import { test, expect, APIRequestContext, request } from "@playwright/test";
import { Server } from "http";
import { createApp } from "../src/api";
import { resetDb, getBookingById, getBookingsByLastname, countBookings } from "../utils/db";

const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;

let server: Server;
let api: APIRequestContext;

test.beforeAll(async () => {
  resetDb(); // clean schema before the suite runs
  server = createApp().listen(PORT);
  api = await request.newContext({ baseURL: BASE_URL });
});

test.afterAll(async () => {
  await api.dispose();
  server.close();
});

test.beforeEach(() => {
  resetDb(); // isolate each test — no shared state, no ordering dependencies
});

test("creating a booking via the API persists the correct row in the DB", async () => {
  const payload = {
    firstname: "Kev",
    lastname: "Le",
    total_price: 275,
    deposit_paid: true,
    checkin_date: "2026-09-10",
    checkout_date: "2026-09-15",
  };

  const response = await api.post("/booking", { data: payload });
  expect(response.status()).toBe(201);
  const { bookingid } = await response.json();

  // API says it worked — now verify directly against the DB rather than
  // trusting the response body alone.
  const row = getBookingById(bookingid);
  expect(row).toBeDefined();
  expect(row?.firstname).toBe(payload.firstname);
  expect(row?.lastname).toBe(payload.lastname);
  expect(row?.total_price).toBe(payload.total_price);
  expect(row?.deposit_paid).toBe(1); // confirms boolean -> 0/1 mapping is correct
});

test("deleting a booking via the API removes it from the DB, not just the API view", async () => {
  const created = await api.post("/booking", {
    data: { firstname: "Temp", lastname: "Record", total_price: 50, checkin_date: "2026-01-01", checkout_date: "2026-01-02" },
  });
  const { bookingid } = await created.json();
  expect(countBookings()).toBe(1);

  const del = await api.delete(`/booking/${bookingid}`);
  expect(del.status()).toBe(204);

  // The real assertion: the row is gone from the table, not just a 404 on GET.
  expect(getBookingById(bookingid)).toBeUndefined();
  expect(countBookings()).toBe(0);
});

test("querying by lastname returns only matching rows (validates a filtered SQL read)", async () => {
  await api.post("/booking", { data: { firstname: "A", lastname: "Shared", total_price: 10, checkin_date: "2026-01-01", checkout_date: "2026-01-02" } });
  await api.post("/booking", { data: { firstname: "B", lastname: "Shared", total_price: 20, checkin_date: "2026-01-01", checkout_date: "2026-01-02" } });
  await api.post("/booking", { data: { firstname: "C", lastname: "Different", total_price: 30, checkin_date: "2026-01-01", checkout_date: "2026-01-02" } });

  const shared = getBookingsByLastname("Shared");
  expect(shared).toHaveLength(2);
  expect(shared.every((b) => b.lastname === "Shared")).toBe(true);
});
