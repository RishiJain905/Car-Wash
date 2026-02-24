# Backend Implementation Plan — Northside Detailing & Garage

All backend logic lives inside Next.js **Route Handlers** (`src/app/api/`) using the App Router. No separate Node/Express server is needed. The database layer is covered in `DATABASE.md`.

---

## Batch 1 — Project Setup & API Structure

- [ ] Install dependencies:
  ```bash
  npm install @supabase/supabase-js stripe nodemailer resend zod
  npm install -D @types/nodemailer
  ```
- [ ] Create `.env.local` (add to `.gitignore`) with these variables:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=

  STRIPE_SECRET_KEY=
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
  STRIPE_WEBHOOK_SECRET=

  RESEND_API_KEY=           # for transactional email
  ADMIN_EMAIL=admin@northsidegarage.com
  FROM_EMAIL=no-reply@northsidegarage.com

  ADMIN_PASSWORD_HASH=      # bcrypt hash for /admin login
  NEXTAUTH_SECRET=          # random 32-char string (openssl rand -base64 32)
  NEXTAUTH_URL=http://localhost:3000
  ```
- [ ] Create `src/lib/supabase.ts` — server-side Supabase client using service role key
- [ ] Create `src/lib/supabase-client.ts` — browser-side Supabase client using anon key
- [ ] Create `src/lib/stripe.ts` — initialise Stripe SDK
- [ ] Create `src/lib/validations.ts` — shared Zod schemas for type-safe request bodies

---

## Batch 2 — Booking API

### `POST /api/bookings` — Create a new booking

- [ ] Accept JSON body: `{ packageId, date, timeSlot, clientName, clientEmail, clientPhone, paymentMethod }`
- [ ] Validate with Zod schema
- [ ] Check the requested `date + timeSlot` is not already taken (query DB)
- [ ] If taken → return `409 Conflict`
- [ ] Insert booking row into `bookings` table with status `pending`
- [ ] Generate a unique `confirmation_number` (e.g. `NDG-XXXXXX`)
- [ ] If `paymentMethod === "deposit"` → create a Stripe Payment Intent and return `{ clientSecret, confirmationNumber }`
- [ ] If `paymentMethod === "in_person"` → mark booking as `confirmed`, skip Stripe, proceed to email
- [ ] Return `{ success: true, confirmationNumber }`

### `GET /api/bookings/availability?date=YYYY-MM-DD`

- [ ] Query all bookings for the given date where `status != 'cancelled'`
- [ ] Return list of booked time slots as array of strings: `["11:00 AM", "01:00 PM"]`
- [ ] The frontend time slot picker uses this to grey out unavailable times

### `GET /api/bookings/[confirmationNumber]`

- [ ] Look up a booking by its `confirmation_number`
- [ ] Return full booking details (for the confirmation page)

### `PATCH /api/bookings/[confirmationNumber]/cancel`

- [ ] Require admin auth header
- [ ] Update booking status to `cancelled`
- [ ] If a deposit was paid via Stripe → trigger a Stripe refund
- [ ] Send cancellation email to client

---

## Batch 3 — Stripe Payment Integration

### Setup Stripe

- [ ] Register a Stripe account at stripe.com
- [ ] Get `STRIPE_SECRET_KEY` (live & test) and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Install Stripe Elements on the frontend: `npm install @stripe/stripe-js @stripe/react-stripe-js`

### `POST /api/stripe/create-payment-intent`

- [ ] Accept JSON body: `{ amount, currency: "usd", bookingId }`
- [ ] Create a Stripe `PaymentIntent` with `metadata: { bookingId }`
- [ ] Return `{ clientSecret }`

### Stripe Webhook `POST /api/stripe/webhook`

- [ ] Disable body parser for this route (`export const config = { api: { bodyParser: false } }`)
- [ ] Verify webhook signature using `STRIPE_WEBHOOK_SECRET`
- [ ] Handle events:
  - `payment_intent.succeeded` → update booking status to `confirmed` in DB → send confirmation email
  - `payment_intent.payment_failed` → update booking status to `payment_failed` → send failure email
  - `charge.refunded` → update booking status to `refunded`

### Frontend Payment Form Component

- [ ] Create `src/components/StripePaymentForm.tsx`
- [ ] Wrap with `<Elements stripe={stripePromise}>` from `@stripe/react-stripe-js`
- [ ] Use `<CardElement>` for card input
- [ ] On confirm, call `POST /api/stripe/create-payment-intent` to get `clientSecret`
- [ ] Call `stripe.confirmCardPayment(clientSecret)` with the card element
- [ ] Handle success → redirect to confirmation page with `confirmationNumber`
- [ ] Handle error → display inline error message

---

## Batch 4 — Email Notifications (Transactional)

Use **Resend** (resend.com) — free tier supports 3,000 emails/month.

### `src/lib/email.ts` — shared email sending helper

- [ ] Create `sendBookingConfirmation(booking)` function
- [ ] Create `sendBookingCancellation(booking)` function
- [ ] Create `sendInquiryNotification(inquiry)` function (for admin)
- [ ] Create `sendInquiryAcknowledgement(inquiry)` function (for client)

### Email Templates (`src/emails/`)

- [ ] `BookingConfirmation.tsx` — React Email template with:
  - Northside Detailing logo/header
  - Package name, date, time
  - Confirmation number
  - Amount paid / amount due in person
  - Add to Google Calendar link
  - Location & contact info
  - "Manage Booking" link
- [ ] `BookingCancellation.tsx` — same branding, refund details if applicable
- [ ] `InquiryAcknowledgement.tsx` — "We received your message and will reply within 24 hours"
- [ ] Pre-render templates and send via the Resend API

### Admin Notification Email

- [ ] When a new booking is created → send a plain-text summary email to `ADMIN_EMAIL`
- [ ] When a new contact form inquiry is submitted → forward to `ADMIN_EMAIL`

---

## Batch 5 — Contact Form API

### `POST /api/contact`

- [ ] Accept JSON body: `{ name, email, message, honeypot }` (honeypot must be empty)
- [ ] Validate with Zod
- [ ] Rate limit: max 5 requests per IP per hour (use `@upstash/ratelimit` with Redis or a simple in-memory map)
- [ ] Save inquiry to `inquiries` table in DB
- [ ] Send acknowledgement email to submitter
- [ ] Send notification email to admin
- [ ] Return `{ success: true }`

---

## Batch 6 — Admin Authentication & API

Use **NextAuth.js v5** with the Credentials provider (simple email + password since this is a single-owner admin panel).

- [ ] Install: `npm install next-auth@beta bcryptjs`
- [ ] Create `src/auth.ts` — configure NextAuth with credentials provider
- [ ] Create `src/app/api/auth/[...nextauth]/route.ts`
- [ ] Create `src/app/admin/login/page.tsx` — simple login form
- [ ] Protect all `/admin/*` routes with `middleware.ts` using `auth()` from NextAuth
- [ ] Create `src/app/admin/page.tsx` — dashboard showing:
  - Upcoming bookings (table: name, package, date, time, status, payment)
  - Pending inquiries
  - Quick stats: bookings this week, revenue this week
- [ ] Create `GET /api/admin/bookings` — paginated list of all bookings (admin-only)
- [ ] Create `GET /api/admin/inquiries` — list of all contact form submissions
- [ ] Create `PATCH /api/admin/bookings/[id]` — update booking status (confirm / cancel / complete)
- [ ] Create `POST /api/admin/availability/block` — block off a date from accepting bookings
- [ ] Create `DELETE /api/admin/availability/block/[date]` — unblock a date

---

## Batch 7 — Deployment Backend Checklist

- [ ] Add all env vars to Vercel / hosting dashboard (never committed to git)
- [ ] Register Stripe webhook endpoint in the Stripe Dashboard pointing to `https://yourdomain.com/api/stripe/webhook`
- [ ] Verify Resend domain (add DNS records to your domain registrar for sending from your domain)
- [ ] Test the full booking flow end-to-end in Stripe test mode
- [ ] Enable Supabase Row Level Security (RLS) policies — see `DATABASE.md`
- [ ] Set `NEXTAUTH_URL` to the production domain
- [ ] Run `npm run build` clean
