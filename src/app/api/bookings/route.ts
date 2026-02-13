import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const {
    flightId,
    passengersCount,
    isStudent,
    mealPreference,
    discountCredits,
    extraBaggageKg,
    seatNumbers,
  } = body as {
    flightId?: number;
    passengersCount?: number;
    isStudent?: boolean;
    mealPreference?: string;
    discountCredits?: number;
    extraBaggageKg?: number;
    seatNumbers?: string[];
  };

  if (
    !flightId ||
    !passengersCount ||
    !Array.isArray(seatNumbers) ||
    seatNumbers.length !== passengersCount
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const flight = await prisma.flight.findUnique({
    where: { id: flightId },
  });

  if (!flight) {
    return NextResponse.json({ error: "Flight not found" }, { status: 404 });
  }

  const seats = await prisma.seat.findMany({
    where: {
      flightId: flightId,
      seatNumber: {
        in: seatNumbers,
      },
      isBlocked: false,
    },
    include: {
      bookingSeat: true,
    },
  });

  if (seats.length !== seatNumbers.length) {
    return NextResponse.json(
      { error: "Some seats are unavailable" },
      { status: 400 }
    );
  }

  if (seats.some((seat) => seat.bookingSeat)) {
    return NextResponse.json(
      { error: "Some seats are already booked" },
      { status: 400 }
    );
  }

  const basePerPassenger =
    flight.basePriceINR + Math.round(flight.durationMinutes * 5);
  const baseFare = basePerPassenger * passengersCount;
  const studentDiscount = isStudent ? Math.round(baseFare * 0.05) : 0;
  const serviceFee = 300;
  const tax = Math.round((baseFare - studentDiscount) * 0.12);
  const extraFee = extraBaggageKg && extraBaggageKg > 0 ? 450 : 0;

  const total =
    baseFare - studentDiscount + tax + serviceFee + extraFee;

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      flightId,
      passengersCount,
      isStudent: Boolean(isStudent),
      mealPreference,
      discountCredits: discountCredits ?? 0,
      extraBaggageKg: extraBaggageKg ?? 0,
      baseFareINR: baseFare,
      taxesINR: tax,
      totalPriceINR: total,
      seats: {
        create: seats.map((seat) => ({
          seatId: seat.id,
        })),
      },
    },
  });

  return NextResponse.json({ id: booking.id });
}

