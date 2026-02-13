

## Airline Management System

An opinionated demo of an airline management system built with Next.js App Router, Tailwind CSS v4, shadcn-style UI primitives, Prisma, and Better Auth. It showcases both the traveller-facing booking flow and an admin portal that controls all displayed data.

### Tech stack

- **Framework**: Next.js App Router (TypeScript, React 19)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Better Auth + Prisma adapter (email/password, session cookies)
- **Styling**: Tailwind CSS v4, custom shadcn-style components, Sonner toasts
- **Design language**: Minimal, airline-inspired interface using `#eee`, black, `#7b0b0b`, and skyblue

### Features

- **Welcome experience**
  - Landing page branded as **Airline Management System**
  - Clear call to action leading into the live airline demo

- **Traveller-facing app**
  - **Home / Search (`/airline`)**
    - Top navbar with `Sign in`, `Sign up`, and `Admin login`
    - Sidebar search:
      - Passenger count
      - Student travelling toggle (5% discount)
      - From/To airport selection with suggestions backed by an Indian airports enum
      - Departure and return dates (native date-pickers)
      - Search button that queries flights for the selected day
    - Flight results list:
      - Shows airline, route, departure/arrival times, duration
      - Price derived from base fare, duration, passenger count, and student discount
      - Clicking a flight routes to the checkout page, carrying all relevant parameters
  - **Auth (`/sign-in`, `/sign-up`)**
    - Email/password fields and “Sign in/Sign up with Google” buttons are present but disabled
    - Note explains this is a demo and invites users to sign in as a guest
    - Guest button calls a dedicated endpoint that provisions or logs in a demo user and redirects back to the checkout flow
  - **Checkout (`/checkout`)**
    - Protected by Better Auth: unauthenticated users are redirected to `/sign-in?redirectTo=/checkout`
    - Shows:
      - Demo user identity and explanation of the guest account
      - Selected flight details (route, times, duration, delays, gate when available)
      - Seat map for 60 seats (1A–10F) where:
        - Only seats not blocked and not already booked can be selected
        - Seat availability reflects admin-controlled seat maps
      - Options:
        - Meal preference (veg, non-veg, none)
        - Discount credits for future flights
        - Additional 10kg baggage, enabled by default for students
      - Fare breakdown:
        - Duration-sensitive base price per passenger
        - Student discount (5%)
        - Taxes and service fees, with optional extra baggage charge
      - Checkout button:
        - Persists a booking and selected seats in the database
        - Shows a top-position toast informing the user that the demo has been completed

- **Admin portal**
  - **Admin auth (`/admin/sign-in`, `/admin/sign-up`)**
    - Real email/password forms wired to Better Auth
    - New admins created via `/admin/sign-up` are elevated to role `ADMIN` by a dedicated endpoint
    - Both pages display a note for guests, linking to the GitHub README for a safe admin preview
  - **Route protection**
    - Next.js middleware and server-side checks ensure only admins can access `/admin/*` pages and admin APIs
  - **Admin console (`/admin/portal`)**
    - Flights side panel:
      - List of all flights ordered by departure time
      - Quick “New flight” action
    - Flight details tab:
      - Create, edit, and delete flights:
        - Flight number, airline name/code
        - From/To airports (Indian enum)
        - Departure/arrival times
        - Base price, delay minutes, gate number, status
      - Duration is computed from times and used by pricing logic
    - Seat map tab:
      - 60-seat grid for each flight
      - Toggle seats as blocked/unblocked
      - Changes persist to the database and immediately influence the frontend checkout seat-selection experience

### Data model (Prisma)

Key models in `prisma/schema.prisma`:

- **User, Session, Account, Verification**: Better Auth-compatible auth schema
- **UserRole**: `USER` and `ADMIN`
- **IndianAirport**: Enum for Indian airports used throughout the app
- **Flight**:
  - Flight number, airline info
  - From/To airports as `IndianAirport`
  - Departure/arrival times, duration in minutes
  - Base price, gate, delay minutes, textual status
- **Seat**:
  - Linked to a flight
  - `seatNumber` (`1A`–`10F`)
  - `isBlocked` for admin-controlled seat configuration
- **Booking**:
  - Linked to user and flight
  - Passenger count, student flag, meal preference
  - Discount credits, extra baggage, price breakdown fields
- **BookingSeat**:
  - One seat per seat record (enforced with a unique `seatId`)
  - Connects `Booking` and `Seat` and powers the seat map

### Seeding and demo data

The seed script at `prisma/seed.ts`:

- Clears existing flights, seats, bookings, and booking-seat records
- Inserts a curated set of flights across major Indian routes with:
  - Different airlines, gates, statuses, and delays
  - Realistic departure and arrival times
- Creates 60 seats per flight (`1A`–`10F`)

This ensures that the home page flight search and admin portal have rich data to work with immediately.

### Running the project

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment**

Create `.env` in the project root and provide:

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
BETTER_AUTH_SECRET="your-better-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

3. **Generate Prisma client and migrate**

```bash
npx prisma generate
npx prisma migrate dev --name airline_init
```

4. **Seed demo data**

```bash
npx prisma db seed
```

5. **Start the dev server**

```bash
npm run dev
```

Visit:

- `http://localhost:3000` → welcome page
- `http://localhost:3000/airline` → traveller-facing app
- `http://localhost:3000/sign-in` → guest sign-in into the checkout flow
- `http://localhost:3000/admin/sign-up` → create an admin, then explore `/admin/portal`

### Security and best practices

- All state-changing endpoints validate payloads and require authentication:
  - `/api/bookings` is restricted to authenticated users and checks seat availability before writing
  - `/api/admin/*` routes are restricted to admins based on the `role` field on the user
- Session handling and cookie management are delegated to Better Auth, following the official Prisma adapter and Next.js integration pattern.
- Admin-only routes are protected in two layers:
  - Middleware restriction for `/admin/*`
  - Server-side guards on pages and APIs that double-check the user’s role
- No plaintext secrets or database credentials are hard-coded; everything is read from environment variables.

### How to explore

- **As a guest**
  - Start on `/airline`, search for any BOM–DEL, DEL–BLR, etc., route on seeded dates
  - Click a flight → you will be redirected to sign in
  - Use “Sign in as guest” to get demo credentials and land in the checkout page
  - Pick seats, tweak options, and hit Checkout to see the final toast

- **As an admin**
  - Go to `/admin/sign-up` and create an account
  - You will be elevated to `ADMIN` and redirected to `/admin/portal`
  - Add or update flights and play with seat maps to see how the public-facing app reacts

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
