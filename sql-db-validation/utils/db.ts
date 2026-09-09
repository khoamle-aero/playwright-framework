// utils/db.ts
//
// Thin data-access layer used by BOTH the sample API (src/api.ts) and the
// tests (tests/db-validation.spec.ts). In a real project this would point
// at the application's actual database instead of a local SQLite file —
// the pattern (query the DB directly to confirm what the API/UI claims
// happened actually persisted) is the point being demonstrated here.

// Uses Node's built-in `node:sqlite` module (stable in recent Node 22/24)
// instead of better-sqlite3 — avoids a native-module compile step (node-gyp
// + Visual Studio Build Tools on Windows) that isn't worth the friction for
// a portfolio example. Swap this file for `pg`/`mysql2` if pointing at a
// real Postgres/MySQL target — the rest of the codebase doesn't change.
import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(__dirname, "..", "db", "test.sqlite");
const SCHEMA_PATH = path.join(__dirname, "..", "db", "schema.sql");

export interface Booking {
  id: number;
  firstname: string;
  lastname: string;
  total_price: number;
  deposit_paid: number;
  checkin_date: string;
  checkout_date: string;
  created_at: string;
}

export function getDb(): DatabaseSync {
  return new DatabaseSync(DB_PATH);
}

/** Rebuilds a clean schema. Call before each test for isolation. */
export function resetDb(): void {
  const db = getDb();
  const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
  db.exec(schema);
  db.close();
}

export function insertBooking(b: Omit<Booking, "id" | "created_at">): number {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO bookings (firstname, lastname, total_price, deposit_paid, checkin_date, checkout_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(b.firstname, b.lastname, b.total_price, b.deposit_paid, b.checkin_date, b.checkout_date);
  db.close();
  return Number(result.lastInsertRowid);
}

export function getBookingById(id: number): Booking | undefined {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM bookings WHERE id = ?`).get(id) as Booking | undefined;
  db.close();
  return row;
}

export function getBookingsByLastname(lastname: string): Booking[] {
  const db = getDb();
  const rows = db.prepare(`SELECT * FROM bookings WHERE lastname = ?`).all(lastname) as unknown as Booking[];
  db.close();
  return rows;
}

export function deleteBooking(id: number): void {
  const db = getDb();
  db.prepare(`DELETE FROM bookings WHERE id = ?`).run(id);
  db.close();
}

export function countBookings(): number {
  const db = getDb();
  const row = db.prepare(`SELECT COUNT(*) AS c FROM bookings`).get() as { c: number };
  db.close();
  return row.c;
}
