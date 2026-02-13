import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromAirport, toAirport, departureDate } = body as {
      fromAirport?: string;
      toAirport?: string;
      departureDate?: string;
    };

    if (!fromAirport || !toAirport || !departureDate) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const start = new Date(departureDate);
    const end = new Date(departureDate);
    end.setDate(end.getDate() + 1);

    const flights = await prisma.flight.findMany({
      where: {
        fromAirport: fromAirport as any,
        toAirport: toAirport as any,
        departureTime: {
          gte: start,
          lt: end,
        },
      },
      orderBy: {
        departureTime: "asc",
      },
    });

    return NextResponse.json(flights);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search flights" },
      { status: 500 }
    );
  }
}

