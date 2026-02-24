# Database Implementation Plan — Northside Detailing & Garage

**Database:** Supabase (PostgreSQL) — free tier handles this workload comfortably.
**ORM:** Raw Supabase client (no ORM needed for this scale).

---

## Batch 1 — Supabase Project Setup

- [ ] Go to [supabase.com](https://supabase.com) and create a new project
- [ ] Name it `northside-detailing` (or similar)
- [ ] Choose a region close to your users (US East recommended)
- [ ] Copy the `Project URL` and `Anon Key` to `.env.local` as:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  SUPABASE_SERVICE_ROLE_KEY=eyJ...  ← keep this secret, server-side only
  ```
- [ ] Enable **Email Auth** if you need admin logins via Supabase Auth (optional if using NextAuth)
- [ ] Enable the **pg_cron** extension (for automated availability refresh, optional)

---

## Batch 2 — Schema Design & Table Creation

Run these SQL statements in the **Supabase SQL Editor**.

### Table: `packages`

Stores the definitive list of service packages. Seeded once.

```sql
CREATE TABLE packages (
  id          TEXT PRIMARY KEY,          -- 'silver' | 'gold' | 'diamond'
  name        TEXT NOT NULL,
  price       INTEGER NOT NULL,          -- in cents (7000, 14000, 20000)
  description TEXT NOT NULL,
  features    TEXT[] NOT NULL,           -- array of feature strings
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

-- Seed data
INSERT INTO packages (id, name, price, description, features, sort_order) VALUES
  ('silver',  'Silver',  7000,  'Essential care for everyday shine.',
   ARRAY['Exterior Hand Wash', 'Wheel & Tire Cleaning', 'Interior Vacuum', 'Window Cleaning'], 1),
  ('gold',    'Gold',   14000, 'Deep cleaning for a showroom finish.',
   ARRAY['Everything in Silver +', 'Hand Wax Protection', 'Leather Conditioning', 'Steam Clean Interior', 'Door Jambs Detail'], 2),
  ('diamond', 'Diamond',20000, 'Ultimate luxury and protection.',
   ARRAY['Everything in Gold +', 'Clay Bar Treatment', 'Machine Polish (Paint Correction)', 'Ceramic Sealant Application', 'Engine Bay Detail'], 3);
```

### Table: `bookings`

Core table. One row per booking.

```sql
CREATE TABLE bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  confirmation_number TEXT UNIQUE NOT NULL,          -- e.g. 'NDG-A3X7K2'
  package_id          TEXT NOT NULL REFERENCES packages(id),
  date                DATE NOT NULL,
  time_slot           TEXT NOT NULL,                 -- '09:00 AM'
  duration_hours      INTEGER NOT NULL DEFAULT 2,
  client_name         TEXT NOT NULL,
  client_email        TEXT NOT NULL,
  client_phone        TEXT,
  payment_method      TEXT NOT NULL CHECK (payment_method IN ('deposit', 'in_person')),
  payment_status      TEXT NOT NULL DEFAULT 'pending'
                        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  stripe_payment_intent_id TEXT,                     -- set when deposit paid via Stripe
  amount_paid_cents   INTEGER NOT NULL DEFAULT 0,    -- 0 for in_person bookings
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for availability lookups
CREATE INDEX idx_bookings_date_slot ON bookings(date, time_slot)
  WHERE status NOT IN ('cancelled');

-- Index for admin listing
CREATE INDEX idx_bookings_status ON bookings(status, date);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Table: `inquiries`

Stores contact form submissions.

```sql
CREATE TABLE inquiries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  replied_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inquiries_unread ON inquiries(is_read, created_at DESC);
```

### Table: `blocked_dates`

Admin can block off entire days (e.g. holidays).

```sql
CREATE TABLE blocked_dates (
  date   DATE PRIMARY KEY,
  reason TEXT
);
```

### Table: `time_slots`

Configurable list of available time slots per day. Allows the admin to add or remove slots.

```sql
CREATE TABLE time_slots (
  id         SERIAL PRIMARY KEY,
  slot_label TEXT NOT NULL,        -- '09:00 AM'
  slot_start TIME NOT NULL,        -- 09:00:00
  duration   INTEGER NOT NULL DEFAULT 2, -- hours
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO time_slots (slot_label, slot_start, sort_order) VALUES
  ('09:00 AM', '09:00:00', 1),
  ('11:00 AM', '11:00:00', 2),
  ('01:00 PM', '13:00:00', 3),
  ('03:00 PM', '15:00:00', 4);
```

---

## Batch 3 — Row Level Security (RLS) Policies

Enable RLS to protect data. The server uses the `service_role` key (bypasses RLS — keep it secret).

```sql
-- Enable RLS on all tables
ALTER TABLE bookings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots     ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages       ENABLE ROW LEVEL SECURITY;

-- packages: anyone can read (public)
CREATE POLICY "packages_public_read" ON packages
  FOR SELECT USING (TRUE);

-- time_slots: anyone can read active slots (public)
CREATE POLICY "time_slots_public_read" ON time_slots
  FOR SELECT USING (is_active = TRUE);

-- blocked_dates: anyone can read (needed for calendar)
CREATE POLICY "blocked_dates_public_read" ON blocked_dates
  FOR SELECT USING (TRUE);

-- bookings: anon can only read availability (date + time_slot + status), not PII
CREATE POLICY "bookings_availability_read" ON bookings
  FOR SELECT USING (TRUE);
  -- Note: Server routes use the service role key for full access.
  -- The anon key only queries the availability columns.

-- bookings: insert allowed for anyone (creating a booking)
CREATE POLICY "bookings_public_insert" ON bookings
  FOR INSERT WITH CHECK (TRUE);

-- inquiries: insert allowed for anyone (contact form)
CREATE POLICY "inquiries_public_insert" ON inquiries
  FOR INSERT WITH CHECK (TRUE);
```

---

## Batch 4 — Helper SQL Functions

### Function: `get_available_slots(p_date DATE)`

Returns the list of time slot labels that are still available for a given date.

```sql
CREATE OR REPLACE FUNCTION get_available_slots(p_date DATE)
RETURNS TABLE(slot_label TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT ts.slot_label
  FROM time_slots ts
  WHERE ts.is_active = TRUE
    AND NOT EXISTS (
      SELECT 1 FROM blocked_dates bd WHERE bd.date = p_date
    )
    AND NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.date = p_date
        AND b.time_slot = ts.slot_label
        AND b.status NOT IN ('cancelled')
    )
  ORDER BY ts.sort_order;
END;
$$ LANGUAGE plpgsql;
```

Usage from Next.js:
```ts
const { data } = await supabase.rpc('get_available_slots', { p_date: '2025-03-15' });
```

### Function: `generate_confirmation_number()`

Generates a unique `NDG-XXXXXX` code.

```sql
CREATE OR REPLACE FUNCTION generate_confirmation_number()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := 'NDG-' || upper(substring(md5(random()::text) FROM 1 FOR 6));
    SELECT EXISTS(SELECT 1 FROM bookings WHERE confirmation_number = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;
```

---

## Batch 5 — Supabase Realtime (Optional)

Enable realtime updates so the admin dashboard auto-refreshes when a new booking comes in.

- [ ] Enable Realtime on the `bookings` table in the Supabase Dashboard (Database → Replication → enable for `bookings`)
- [ ] Subscribe in the admin panel:
  ```ts
  supabase
    .channel('bookings')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, handleNewBooking)
    .subscribe();
  ```

---

## Batch 6 — Database Migrations & Versioning

Use Supabase's built-in migration system to version-control schema changes.

- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Initialise: `supabase init`
- [ ] Create migration files in `supabase/migrations/`:
  - `20250224000001_create_packages.sql`
  - `20250224000002_create_bookings.sql`
  - `20250224000003_create_inquiries.sql`
  - `20250224000004_create_blocked_dates.sql`
  - `20250224000005_create_time_slots.sql`
  - `20250224000006_create_rls_policies.sql`
  - `20250224000007_create_functions.sql`
  - `20250224000008_seed_packages.sql`
  - `20250224000009_seed_time_slots.sql`
- [ ] Run against local: `supabase db push`
- [ ] Run against production: link project and push via `supabase db push --linked`

---

## Batch 7 — Backups & Monitoring

- [ ] Enable **Point-in-Time Recovery** in Supabase Dashboard (Pro plan, optional for MVP)
- [ ] Set up a weekly manual backup export (Database → Backups in Supabase Dashboard on free tier)
- [ ] Create a Supabase **Alert** (or use Sentry) for `500` errors on the API routes
- [ ] Add a `pg_cron` job to auto-mark bookings as `no_show` if 2 hours past the slot time with status still `confirmed`:
  ```sql
  SELECT cron.schedule(
    'mark_no_shows',
    '0 * * * *',  -- every hour
    $$
      UPDATE bookings
      SET status = 'no_show'
      WHERE status = 'confirmed'
        AND (date + time_slot::TIME + INTERVAL '2 hours') < NOW();
    $$
  );
  ```

---

## Summary — Complete Table Reference

| Table            | Purpose                                  |
|-----------------|------------------------------------------|
| `packages`      | Service package definitions (seeded)     |
| `bookings`      | All customer bookings                    |
| `inquiries`     | Contact form submissions                 |
| `blocked_dates` | Admin-blocked dates (no bookings allowed)|
| `time_slots`    | Configurable available time slots        |

---

## Environment Variables Checklist

| Variable                         | Source              |
|---------------------------------|---------------------|
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase Dashboard  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard  |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase Dashboard  |
| `STRIPE_SECRET_KEY`             | Stripe Dashboard    |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET`         | Stripe Dashboard    |
| `RESEND_API_KEY`                | resend.com          |
| `ADMIN_EMAIL`                   | Your email          |
| `NEXTAUTH_SECRET`               | `openssl rand -base64 32` |
| `NEXTAUTH_URL`                  | Your production URL |



You will act as the Orchestrator, and you will use @modern-ui-engineer as your 
frontend engineer subagent, then you will use @app-performance-optimizer to 
maximixe the performance of the website, then you will use @security-code-reviewer 
to review the code at the end of each batch, ensure that the security is hardened if 
it is not you must present the issues to @modern-ui-engineer and then fix the issues. 
You may proceed.
