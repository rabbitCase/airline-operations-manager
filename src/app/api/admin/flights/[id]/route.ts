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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin(request);

  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const id = Number(params.id);

  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

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
    gateNumber,
    delayMinutes,
    status,
  } = body as {
    flightNumber?: string;
    airlineName?: string;
    airlineCode?: string;
    fromAirport?: string;
    toAirport?: string;
    departureTime?: string;
    arrivalTime?: string;
    basePriceINR?: number;
    gateNumber?: string;
    delayMinutes?: number;
    status?: string;
  };

  const existing = await prisma.flight.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const departure = departureTime
    ? new Date(departureTime)
    : existing.departureTime;
  const arrival = arrivalTime ? new Date(arrivalTime) : existing.arrivalTime;
  const durationMinutes = Math.max(
    30,
    Math.round((arrival.getTime() - departure.getTime()) / (60 * 1000))
  );

  const updated = await prisma.flight.update({
    where: { id },
    data: {
      flightNumber: flightNumber ?? existing.flightNumber,
      airlineName: airlineName ?? existing.airlineName,
      airlineCode: airlineCode ?? existing.airlineCode,
      fromAirport: (fromAirport as any) ?? existing.fromAirport,
      toAirport: (toAirport as any) ?? existing.toAirport,
      departureTime: departure,
      arrivalTime: arrival,
      durationMinutes,
      basePriceINR: basePriceINR ?? existing.basePriceINR,
      gateNumber: gateNumber ?? existing.gateNumber,
      delayMinutes: delayMinutes ?? existing.delayMinutes,
      status: status ?? existing.status,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin(request);

  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const id = Number(params.id);

  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await prisma.bookingSeat.deleteMany({
    where: {
      seat: {
        flightId: id,
      },
    },
  });

  await prisma.booking.deleteMany({
    where: {
      flightId: id,
    },
  });

  await prisma.seat.deleteMany({
    where: {
      flightId: id,
    },
  });

  await prisma.flight.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({ ok: true });
}

