-- seed.sql
-- Known baseline data for exploratory/manual runs against the sample API.
-- Automated tests do NOT depend on this file — each test creates and
-- cleans up its own data (see utils/db.ts resetDb / tests/db-validation.spec.ts).

INSERT INTO bookings (firstname, lastname, total_price, deposit_paid, checkin_date, checkout_date)
VALUES
    ('Jim',   'Brown', 111, 1, '2026-01-01', '2026-01-05'),
    ('Alice', 'Ng',    250, 0, '2026-02-10', '2026-02-14'),
    ('Marco', 'Diaz',  180, 1, '2026-03-03', '2026-03-06');
