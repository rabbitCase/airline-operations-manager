import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminPortalClient, { Flight } from "@/components/AdminPortalClient";

export default async function AdminPortalPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/admin/sign-in");
  }

  const flights = await prisma.flight.findMany({
    orderBy: {
      departureTime: "asc",
    },
  });

  const serializedFlights: Flight[] = flights.map((flight) => ({
    ...flight,
    departureTime: flight.departureTime.toISOString(),
    arrivalTime: flight.arrivalTime.toISOString(),
    basePriceINR: Number(flight.basePriceINR),
  }));

  return <AdminPortalClient initialFlights={serializedFlights} />;
}
