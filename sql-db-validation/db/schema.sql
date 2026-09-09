-- schema.sql
-- Minimal schema for a "bookings" resource, modeled loosely on
-- the Restful-Booker domain (firstname, lastname, price, deposit, dates).
-- Used both by the sample API (src/api.ts) and by tests that verify
-- API/UI actions actually persisted correctly at the DB layer.

DROP TABLE IF EXISTS bookings;

CREATE TABLE bookings (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname     TEXT    NOT NULL,
    lastname      TEXT    NOT NULL,
    total_price   INTEGER NOT NULL,
    deposit_paid  INTEGER NOT NULL DEFAULT 0,   -- 0/1 boolean
    checkin_date  TEXT    NOT NULL,
    checkout_date TEXT    NOT NULL,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_bookings_lastname ON bookings (lastname);
