

## Airline Management System

An opinionated demo of an airline management system built with Next.js App Router, Tailwind CSS v4, shadcn-style UI primitives, Prisma, and Better Auth. It showcases both the traveller-facing booking flow and an admin portal that controls all displayed data.
### Admin Portal Demo


https://github.com/user-attachments/assets/8b9f73c9-d10a-479a-9c5e-61f235cdd8ef

### Tech stack

- **Framework**: Next.js App Router (TypeScript, React 19)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Better Auth + Prisma adapter (email/password, session cookies)
- **Styling**: Tailwind CSS v4, custom shadcn-style components, Sonner toasts
- **Design language**: Minimal, airline-inspired interface using `#eee`, black, `#7b0b0b`, and skyblue

### Features

- **Traveller-facing app**
  - **Home / Search (`/airline`)**
    - Top navbar with `Sign in` and `Admin login`
    - Sidebar search:
      - Passenger count
      - Student travelling toggle (5% discount)
      - From/To airport selection 
      - Departure and return dates 
      - Search button to query flights
    - Flight results list:
      - Shows airline, route, departure/arrival times, duration
      - Price derived from base fare, duration, passenger count, and student discount
  - **Auth (`/sign-in`)**
    - Email/password fields and “Sign in/Sign up with Google” buttons are present but disabled
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
  - **Admin auth (`/admin/sign-in`)**
    - Real email/password forms wired to Better Auth
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

### Security and best practices

- All state-changing endpoints validate payloads and require authentication:
  - `/api/bookings` is restricted to authenticated users and checks seat availability before writing
  - `/api/admin/*` routes are restricted to admins based on the `role` field on the user
- Session handling and cookie management are delegated to Better Auth, following the official Prisma adapter and Next.js integration pattern.
- Admin-only routes are protected in two layers:
  - Middleware restriction for `/admin/*`
  - Server-side guards on pages and APIs that double-check the user’s role
- No plaintext secrets or database credentials are hard-coded; everything is read from environment variables.
