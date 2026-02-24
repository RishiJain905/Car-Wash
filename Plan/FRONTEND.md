# Frontend Implementation Plan — Northside Detailing & Garage

A batch-by-batch guide to completing the frontend. After all batches are done the site will be fully functional, polished, and ready for deployment.

---

## Batch 1 — Package Selection + Booking Flow (Critical Fixes)

> Fix the core booking UX that is currently broken. This is the most urgent batch.

### 1.1 — Interactive Package Selector (`src/app/packages/page.tsx`)

**Problem:** Clicking "Select Package" does nothing. The booking summary always shows "Gold Package" and $140.

**Solution:** Convert the packages page to a **Client Component** and introduce `useState` to track which package is chosen.

- [ ] Add `"use client"` directive to `packages/page.tsx`
- [ ] Create a `packages` data array with `id`, `name`, `price`, `description`, and `features` fields (Silver $70, Gold $140, Diamond $200)
- [ ] Add `selectedPackage` state (`useState<string>("gold")`)
- [ ] Wire each "Select Package" button's `onClick` to set `selectedPackage`
- [ ] Dynamically highlight the selected card with a border/ring
- [ ] Update the Booking Summary panel on the right to reflect the chosen package name and price dynamically
- [ ] Update "Pay 50% Deposit Now" to show `price / 2` dynamically
- [ ] Smooth scroll to `#booking-section` when a package is selected

### 1.2 — Live Calendar Component (`src/components/BookingCalendar.tsx`)

**Problem:** The calendar is completely static — October 2023 with hardcoded dates.

**Solution:** Build a real interactive calendar component.

- [ ] Build a `BookingCalendar.tsx` client component
- [ ] Track `currentMonth` and `currentYear` in state
- [ ] Render the correct days for the current month dynamically using JavaScript `Date` API
- [ ] Navigate months with `<` / `>` chevron buttons that update state
- [ ] Prevent selecting dates in the past (grey them out)
- [ ] Track `selectedDate` in state; highlight the selected day with primary bg
- [ ] Display "Today" badge on the current date
- [ ] Expose `onSelectDate` prop that emits the selected date to the parent page

### 1.3 — Time Slot Selector (`src/components/TimeSlotPicker.tsx`)

**Problem:** Time slots are hardcoded and non-interactive.

- [ ] Build `TimeSlotPicker.tsx` component
- [ ] Accept `selectedDate` prop; show a loading state when date is not yet selected
- [ ] Statically define available slots: `09:00 AM`, `11:00 AM`, `01:00 PM`, `03:00 PM`
- [ ] Track `selectedSlot` state; visually highlight chosen slot
- [ ] Mark a slot as "Booked" (disabled styling) when eventually connected to the backend
- [ ] Expose `onSelectSlot` prop to parent

### 1.4 — Unified Booking State (`src/app/packages/page.tsx`)

- [ ] Lift `selectedPackage`, `selectedDate`, `selectedSlot`, and `paymentMethod` state up to the `packages/page.tsx`
- [ ] Pass state down as props to `BookingCalendar`, `TimeSlotPicker`, and the summary panel
- [ ] Summary panel should update in real time as the user adjusts choices
- [ ] Disable "Confirm Booking" button until all three (package, date, slot) are chosen
- [ ] Add a loading spinner state for when the booking is being submitted

---

## Batch 2 — Booking Confirmation & User Feedback

- [ ] Create `src/app/booking-confirmation/page.tsx` — a thank-you/confirmation page
  - Show: Package name, date, time, total amount
  - Show a confirmation number (random UUID until backend is ready)
  - "Add to Calendar" link (generate a Google Calendar URL)
  - A "Back to Home" CTA button
- [ ] Wire the "Confirm Booking" button to navigate to this page after a simulated delay
- [ ] Add a form-validation `toast` notification if user clicks "Confirm Booking" without all fields filled
- [ ] Install and configure a lightweight toast library (`react-hot-toast` or `sonner`)

---

## Batch 3 — Contact Form & Inquiry Handling

- [ ] Make the `Send an Inquiry` form on the homepage functional
- [ ] Add form state management with `useState` for name, email, message fields
- [ ] Add client-side validation (non-empty, valid email format)
- [ ] Wire the submit button to a `POST /api/contact` endpoint (defined in Backend Batch 1)
- [ ] Show a success/error toast after form submission
- [ ] Add honeypot anti-spam field

---

## Batch 4 — Mobile Responsiveness & Navigation Polish

- [ ] Audit every page on mobile (320px, 375px, 414px breakpoints)
- [ ] Fix the mobile menu — currently it opens but links don't close it reliably (add `onClick` handlers)
- [ ] Ensure the pricing cards stack vertically and the "Best Seller" Gold card is not clipped on mobile
- [ ] Booking section: On mobile, stack the calendar and summary vertically
- [ ] Navbar: Ensure logo text does not overflow on small screens
- [ ] Hero section: Ensure the CTA buttons are full-width on mobile
- [ ] Footer: Ensure the three columns stack on mobile

---

## Batch 5 — SEO, Metadata & Fonts

- [ ] Update `metadata` in `layout.tsx` and each page with proper `title`, `description`, `og:image`, `og:title`
- [ ] Add a `public/favicon.ico` and `public/og-image.jpg` (hero screenshot or logo)
- [ ] Create `src/app/sitemap.ts` for automatic sitemap generation
- [ ] Create `src/app/robots.ts`
- [ ] Use the `next/font` API to load Playfair Display and Inter/Lato without layout shift
- [ ] Set `lang="en"` and proper `aria-label` attributes on interactive elements

---

## Batch 6 — Admin Dashboard (Optional but Recommended)

- [ ] Create a password-protected `/admin` route
- [ ] View all upcoming bookings in a table (date, package, client name, payment status)
- [ ] Mark a booking as "Confirmed", "Completed", or "Cancelled"
- [ ] Block off specific dates as unavailable (feeds into the available-slots logic)
- [ ] View contact form messages / inquiries

---

## Batch 7 — Polish, Animations & Accessibility

- [ ] Add `framer-motion` for page transitions and section entrance animations
- [ ] Animate service cards on scroll with `IntersectionObserver` or Framer `whileInView`
- [ ] Add hover shimmer effect on package cards
- [ ] Ensure all images have proper `alt` text
- [ ] Add `aria-expanded` on mobile menu toggle button
- [ ] Add `focus-visible` outlines for keyboard navigation
- [ ] Lighthouse score target: ≥90 on all pages

---

## Batch 8 — Deployment Readiness (Frontend)

- [ ] Switch all `<img>` tags to Next.js `<Image>` components with proper `width`/`height`
- [ ] Add `next.config.ts` `remotePatterns` for `lh3.googleusercontent.com` and your CDN domain
- [ ] Run `npm run build` — fix any build warnings
- [ ] Set up `NEXT_PUBLIC_*` env vars in `.env.local` and `.env.example`
- [ ] Add Vercel-specific config (`vercel.json`) or configure your hosting platform
- [ ] Run Lighthouse on the production build
