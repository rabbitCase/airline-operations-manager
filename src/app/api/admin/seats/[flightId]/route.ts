import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ flightId: string }> },
) {
  const session = await requireAdmin(request);

  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { flightId } = await context.params;
  const id = Number(flightId);

  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const seats = await prisma.seat.findMany({
    where: { flightId: id },
    orderBy: { seatNumber: "asc" },
  });

  return NextResponse.json(seats);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ flightId: string }> },
) {
  const session = await requireAdmin(request);

  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { flightId } = await context.params;
  const id = Number(flightId);

  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await request.json();

  const updates = body as {
    seatNumber: string;
    isBlocked: boolean;
  }[];

  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json({ error: "No updates" }, { status: 400 });
  }

  const toBlock = updates.filter((u) => u.isBlocked).map((u) => u.seatNumber);
  const toUnblock = updates
    .filter((u) => !u.isBlocked)
    .map((u) => u.seatNumber);

  try {
    await prisma.$transaction([
      ...(toBlock.length > 0
        ? [
            prisma.seat.updateMany({
              where: { flightId: id, seatNumber: { in: toBlock } },
              data: { isBlocked: true },
            }),
          ]
        : []),
      ...(toUnblock.length > 0
        ? [
            prisma.seat.updateMany({
              where: { flightId: id, seatNumber: { in: toUnblock } },
              data: { isBlocked: false },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Transaction failed:");
    return NextResponse.json(
      { error: "Database operation failed" },
      { status: 500 },
    );
  }
}
