# SQL / DB Validation Example

Demonstrates a pattern that's easy to talk about in interviews but rare to
actually see in a portfolio: **verifying test outcomes at the database
layer, with SQL, instead of trusting the API/UI response alone.**

Runs automatically in GitHub Actions on every push/PR that touches this
folder — see `.github/workflows/sql-db-validation.yml`.

## Why this matters

An API can return `201 Created` while silently dropping a field, mis-mapping
a boolean, or failing a downstream write. Asserting only on the response
body won't catch that. Querying the database directly — the same way a
production support engineer would — closes that gap.

## What's here

```
db/
  schema.sql      -- table definition
  seed.sql        -- optional known dataset for manual/exploratory runs
utils/
  db.ts           -- data-access layer (used by both the API and the tests)
src/
  api.ts          -- minimal Express API under test (stands in for a real backend)
tests/
  db-validation.spec.ts  -- Playwright tests that assert against the DB directly
```

The API here is intentionally minimal — a `POST /booking`, `GET /booking/:id`,
`DELETE /booking/:id` — so the whole example runs self-contained in CI with
no external network dependency (no live Restful-Booker/PetStore call
required). The pattern is what matters, and it transfers directly to
testing against Postgres/MySQL on a real project — swap the `node:sqlite`
calls in `utils/db.ts` for `pg` or `mysql2` and the test logic barely changes.

**DB driver note:** this uses Node's built-in `node:sqlite` module (stable
in Node 22.5+/24) rather than `better-sqlite3`, specifically to avoid a
native-module compile step (`node-gyp` + Visual Studio Build Tools on
Windows) that adds friction with no payoff for a portfolio example. You'll
see a one-line `ExperimentalWarning` in the test output — harmless, just
Node flagging that the API may still change in a future release. Requires
Node >= 22.5.

## Running it

```bash
npm install
npx playwright install --with-deps   # first time only
npm test
```

Each test resets the schema in `beforeEach`, so tests are isolated and can
run in any order without leftover state.

## The core pattern (see `tests/db-validation.spec.ts`)

```ts
const response = await api.post("/booking", { data: payload });
const { bookingid } = await response.json();

// Don't stop at the API response — confirm the row is actually correct.
const row = getBookingById(bookingid);
expect(row?.firstname).toBe(payload.firstname);
expect(row?.deposit_paid).toBe(1); // catches boolean -> 0/1 mapping bugs
```

## Integrating into `playwright-framework`

- Drop `utils/db.ts` alongside your existing page objects / API clients, and
  swap the SQLite connection for a connection to whatever DB your
  Restful-Booker or PetStore test target actually persists to (if you're
  testing hosted third-party APIs with no DB access, keep this as a
  standalone example — that's a legitimate scenario to explain in an
  interview: "here's how I'd validate at the DB layer when I do have
  access").
- Add a short section to the main repo README pointing here, framed as:
  *"DB-level validation — see /sql-db-validation for a runnable example."*
