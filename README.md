# Sports Venue Booking — Interactive Prototype

A UI-first prototype of a sports-facility booking platform, designed to demonstrate the customer booking journey and the venue owner's day-to-day view. It is a product-discovery and client-feedback artifact, **not a live reservation or payment service**.

[Open the prototype](https://booking-prototype-cakra.vercel.app) · [Read the product requirements](PRD.md)

## Experience covered

| Customer | Venue owner |
| --- | --- |
| Browse sports venues, photos, pricing, facilities and schedules | View sample bookings and payment-status summaries |
| Pick a date, time slot and duration | Search bookings and inspect sample details |
| Enter contact details and review a booking | Explore schedule and venue management screens |
| Simulate a payment outcome and view a QR-style ticket | Review dashboard charts built from sample records |

## Technology

- Next.js 16 App Router, React 19 and TypeScript
- Tailwind CSS and Radix UI component primitives
- React Hook Form / Zod packages, date-fns, QR code and chart components
- In-memory fixtures under [`lib/data.ts`](lib/data.ts), with no persistent backend required for the demo

## Main routes

- `/` — venue discovery and landing page
- `/venue/[id]` — venue details
- `/booking` — guided booking and payment simulation
- `/owner` — owner overview
- `/owner/bookings`, `/owner/schedule`, `/owner/venues`, `/owner/settings` — additional owner flows

## Local development

Requirements: Node.js compatible with Next.js 16 and npm.

```bash
npm ci
npm run dev
```

Visit `http://localhost:3000`. For a production-mode compile or static checks:

```bash
npm run lint
npm run build
```

## What this prototype does not do

- No real payment gateway, charges, refunds, or booking confirmation.
- No server-side booking conflict prevention or durable reservations; availability and booking records are demo data.
- No live account authentication or authorization.
- Screens and sample prices are for interaction feedback, not operational availability or commercial offers.

The source of truth for intended scope and future requirements is [`PRD.md`](PRD.md). The project is best evaluated as **UX flow and frontend implementation work**, not as a production booking backend.
