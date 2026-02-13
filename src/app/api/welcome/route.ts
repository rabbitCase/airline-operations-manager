import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { depairport, arrairport, tripdate } = body;

    const startOfDay = new Date(tripdate);
    const endOfDay = new Date(tripdate);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const flights = await prisma.flight.findMany({
      where: {
        departureAirportId: parseInt(depairport),
        arrivalAirportId: parseInt(arrairport),
        departureTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      select: {
        airlineId: true,
        departureAirportId: true,
        arrivalAirportId: true,
        departureTime: true,
        arrivalTime: true,
      },
      orderBy: {
        departureTime: 'asc',
      },
    });

    return NextResponse.json(flights);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}