import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);

  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const flights = await prisma.flight.findMany({
    orderBy: {
      departureTime: "asc",
    },
  });

  return NextResponse.json(flights);
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const {
    flightNumber,
    airlineName,
    airlineCode,
    fromAirport,
    toAirport,
    departureTime,
    arrivalTime,
    basePriceINR,
  } = body;

  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  const durationMinutes = Math.max(
    30,
    Math.round((arrival.getTime() - departure.getTime()) / (60 * 1000)),
  );

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Flight
      const flight = await tx.flight.create({
        data: {
          flightNumber,
          airlineName,
          airlineCode,
          fromAirport: fromAirport as any,
          toAirport: toAirport as any,
          departureTime: departure,
          arrivalTime: arrival,
          durationMinutes,
          basePriceINR,
          status: "ON_TIME",
        },
      });

      // 2. Generate 10 rows (1-10) with 6 columns (A-F)
      const rows = Array.from({ length: 10 }, (_, i) => i + 1); // [1, 2, ..., 10]
      const cols = ["A", "B", "C", "D", "E", "F"];

      const seatData = rows.flatMap((r) =>
        cols.map((c) => ({
          flightId: flight.id, // Links to Flight.id [cite: 14]
          seatNumber: `${r}${c}`,
          isBlocked: false,
        })),
      );

      // 3. Bulk insert 60 seats (10 * 6)
      await tx.seat.createMany({
        data: seatData,
      });

      return flight;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to create flight and seats:", error);
    return NextResponse.json(
      { error: "Database transaction failed" },
      { status: 500 },
    );
  }
}
