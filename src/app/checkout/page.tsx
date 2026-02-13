import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CheckoutClient from "@/components/CheckoutClient";

async function requireSession(
  currentSearchParams: Record<string, string | undefined>,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    const redirectParams = new URLSearchParams();
    // Preserve all search params when redirecting
    const checkoutParams = new URLSearchParams();
    Object.entries(currentSearchParams).forEach(([key, value]) => {
      if (value) checkoutParams.set(key, value);
    });
    const checkoutUrl = `/checkout?${checkoutParams.toString()}`;
    redirectParams.set("redirectTo", checkoutUrl);
    redirect(`/sign-in?${redirectParams.toString()}`);
  }

  return session;
}

export default async function CheckoutPage(props: {
  searchParams: Promise<{
    flightId?: string;
    passengers?: string;
    student?: string;
    from?: string;
    to?: string;
    departureDate?: string;
    returnDate?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const session = await requireSession(searchParams);

  const flightId = Number(searchParams.flightId);

  if (!flightId || Number.isNaN(flightId)) {
    redirect("/airline");
  }

  const flight = await prisma.flight.findUnique({
    where: { id: flightId },
  });

  if (!flight) {
    redirect("/airline");
  }

  const seats = await prisma.seat.findMany({
    where: {
      flightId: flight.id,
    },
    include: {
      bookingSeat: true,
    },
    orderBy: {
      seatNumber: "asc",
    },
  });

  const serializableFlight = {
    id: flight.id,
    flightNumber: flight.flightNumber,
    airlineName: flight.airlineName,
    airlineCode: flight.airlineCode,
    fromAirport: String(flight.fromAirport),
    toAirport: String(flight.toAirport),
    departureTime: flight.departureTime.toISOString(),
    arrivalTime: flight.arrivalTime.toISOString(),
    durationMinutes: flight.durationMinutes,
    basePriceINR: flight.basePriceINR,
  };

  return (
    <CheckoutClient
      user={session.user}
      flight={serializableFlight}
      seats={seats}
      searchParams={searchParams}
    />
  );
}
