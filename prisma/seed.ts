import { prisma } from "@/lib/prisma";

async function main() {
    await prisma.airport.createMany({
        data: [
            { id: 1, name: 'Chhatrapati Shivaji Maharaj International Airport', location: 'Mumbai', terminals: 2 },
            { id: 2, name: 'Indira Gandhi International Airport', location: 'Delhi', terminals: 3 },
            { id: 3, name: 'Kempegowda International Airport', location: 'Bengaluru', terminals: 1 },
            { id: 4, name: 'Netaji Subhas Chandra Bose International Airport', location: 'Kolkata', terminals: 2 },
            { id: 5, name: 'Rajiv Gandhi International Airport', location: 'Hyderabad', terminals: 1 },
        ],
        skipDuplicates: true,
    });

    await prisma.airline.createMany({
        data: [
            { id: 1, name: 'Air India', code: 'AI' },
            { id: 2, name: 'IndiGo', code: '6E' },
            { id: 3, name: 'SpiceJet', code: 'SG' },
            { id: 4, name: 'Vistara', code: 'UK' },
            { id: 5, name: 'GoAir', code: 'G8' },
        ],
        skipDuplicates: true,
    });

    await prisma.passenger.createMany({
        data: [
            { id: 1, name: 'Rahul Sharma', dob: new Date('1990-05-15'), phoneNumber: 9876543210 },
            { id: 2, name: 'Anjali Gupta', dob: new Date('1985-08-22'), phoneNumber: 8765432109 },
        ],
        skipDuplicates: true,
    });

    await prisma.flight.createMany({
        data: [
            {
                id: 1,
                airlineId: 1,
                departureAirportId: 1,
                arrivalAirportId: 2,
                departureTime: new Date('2025-04-12T10:00:00Z'),
                arrivalTime: new Date('2025-04-12T12:00:00Z'),
                delay: 0
            },
            {
                id: 2,
                airlineId: 2,
                departureAirportId: 2,
                arrivalAirportId: 3,
                departureTime: new Date('2025-04-12T14:00:00Z'),
                arrivalTime: new Date('2025-04-12T16:30:00Z'),
                delay: 15
            },
            {
                id: 3,
                airlineId: 3,
                departureAirportId: 3,
                arrivalAirportId: 4,
                departureTime: new Date('2025-04-13T08:30:00Z'),
                arrivalTime: new Date('2025-04-13T11:00:00Z'),
                delay: 0
            },
            {
                id: 4,
                airlineId: 1,
                departureAirportId: 4,
                arrivalAirportId: 5,
                departureTime: new Date('2025-04-13T15:00:00Z'),
                arrivalTime: new Date('2025-04-13T17:15:00Z'),
                delay: 5
            },
            {
                id: 5,
                airlineId: 4,
                departureAirportId: 5,
                arrivalAirportId: 1,
                departureTime: new Date('2025-04-13T02:00:00Z'),
                arrivalTime: new Date('2025-04-13T04:00:00Z'),
                delay: 0
            },
            {
                id: 6,
                airlineId: 4,
                departureAirportId: 1,
                arrivalAirportId: 2,
                departureTime: new Date('2025-04-13T02:30:00Z'),
                arrivalTime: new Date('2025-04-13T04:30:00Z'),
                delay: 0
            },
            {
                id: 7,
                airlineId: 2,
                departureAirportId: 1,
                arrivalAirportId: 2,
                departureTime: new Date('2025-04-13T03:00:00Z'),
                arrivalTime: new Date('2025-04-13T05:00:00Z'),
                delay: 0
            },
            {
                id: 8,
                airlineId: 2,
                departureAirportId: 1,
                arrivalAirportId: 2,
                departureTime: new Date('2025-04-13T03:30:00Z'),
                arrivalTime: new Date('2025-04-13T05:30:00Z'),
                delay: 0
            },
            {
                id: 9,
                airlineId: 5,
                departureAirportId: 1,
                arrivalAirportId: 2,
                departureTime: new Date('2025-04-13T04:00:00Z'),
                arrivalTime: new Date('2025-04-13T06:00:00Z'),
                delay: 0
            }
        ],
        skipDuplicates: true,
    });
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