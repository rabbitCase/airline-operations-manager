//AI generated seed script
import { prisma } from "../src/lib/prisma";

const rowCount = 10;
const cols = ["A", "B", "C", "D", "E", "F"];
const seatNumbers = Array.from({ length: rowCount }).flatMap((_, rowIndex) => {
  const row = rowIndex + 1;
  return cols.map((col) => `${row}${col}`);
});

const AIRPORTS = [
  "BOM",
  "DEL",
  "BLR",
  "MAA",
  "HYD",
  "CCU",
  "GOI",
  "AMD",
  "COK",
  "PNQ",
];
const AIRLINES = [
  { name: "Air India", code: "AI", prefix: "AI" },
  { name: "IndiGo", code: "6E", prefix: "6E" },
  { name: "Vistara", code: "UK", prefix: "UK" },
  { name: "SpiceJet", code: "SG", prefix: "SG" },
  { name: "GoAir", code: "G8", prefix: "G8" },
];

async function main() {
  await prisma.bookingSeat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.flight.deleteMany();

  console.log("Seeding 500 flights...");

  for (let i = 0; i < 5000; i++) {
    const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
    const fromAirport = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
    let toAirport = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];

    while (toAirport === fromAirport) {
      toAirport = AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)];
    }

    const day = Math.floor(Math.random() * 4) + 13;
    const hour = Math.floor(Math.random() * 24);
    const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];

    const departureTime = new Date(
      `2026-02-${day}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00Z`,
    );
    const duration = Math.floor(Math.random() * 120) + 60; // 60-180 mins
    const arrivalTime = new Date(departureTime.getTime() + duration * 60000);

    const flight = await prisma.flight.create({
      data: {
        flightNumber: `${airline.prefix}${Math.floor(1000 + Math.random() * 9000)}`,
        airlineName: airline.name,
        airlineCode: airline.code,
        fromAirport: fromAirport as any,
        toAirport: toAirport as any,
        departureTime,
        arrivalTime,
        durationMinutes: duration,
        basePriceINR: Math.floor(3500 + Math.random() * 6000),
        gateNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 20) + 1}`,
        delayMinutes: Math.random() > 0.85 ? Math.floor(Math.random() * 45) : 0,
        status: Math.random() > 0.9 ? "DELAYED" : "ON_TIME",
      },
    });

    // Bulk create 60 seats per flight to maintain unique constraint
    await prisma.seat.createMany({
      data: seatNumbers.map((num) => ({
        flightId: flight.id,
        seatNumber: num,
        isBlocked: false,
      })),
    });

    if ((i + 1) % 50 === 0) console.log(`Created ${i + 1} flights...`);
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
