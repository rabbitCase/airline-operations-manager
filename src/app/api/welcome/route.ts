import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IndianAirport } from "../../../../generated/prisma/enums";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { depairport, arrairport, tripdate } = body;

    const startOfDay = new Date(tripdate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(tripdate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const flights = await prisma.flight.findMany({
      where: {
        fromAirport: depairport as IndianAirport,
        toAirport: arrairport as IndianAirport,
        departureTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        id: true,
        flightNumber: true,
        airlineName: true,
        airlineCode: true,
        fromAirport: true,
        toAirport: true,
        departureTime: true,
        arrivalTime: true,
        durationMinutes: true,
        basePriceINR: true,
        status: true,
        delayMinutes: true,
      },
      orderBy: {
        departureTime: "asc",
      },
    });

    return NextResponse.json(flights);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch flights" },
      { status: 500 },
    );
  }
}
