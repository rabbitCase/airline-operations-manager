/*
  Warnings:

  - You are about to drop the `airline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `airport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `airport_airline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `baggage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flight_gate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flight_passenger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lostandfound` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `passenger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `works_for` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "IndianAirport" AS ENUM ('BOM', 'DEL', 'BLR', 'MAA', 'HYD', 'CCU', 'GOI', 'AMD', 'COK', 'PNQ', 'PAT', 'LKO', 'JAI', 'TRV', 'CCJ');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "airport_airline" DROP CONSTRAINT "airport_airline_AirlineID_fkey";

-- DropForeignKey
ALTER TABLE "airport_airline" DROP CONSTRAINT "airport_airline_AirportID_fkey";

-- DropForeignKey
ALTER TABLE "baggage" DROP CONSTRAINT "baggage_PassengerID_fkey";

-- DropForeignKey
ALTER TABLE "flight" DROP CONSTRAINT "flight_AirlineID_fkey";

-- DropForeignKey
ALTER TABLE "flight" DROP CONSTRAINT "flight_ArrivalAirportID_fkey";

-- DropForeignKey
ALTER TABLE "flight" DROP CONSTRAINT "flight_DepartureAirportID_fkey";

-- DropForeignKey
ALTER TABLE "flight_gate" DROP CONSTRAINT "flight_gate_FlightID_fkey";

-- DropForeignKey
ALTER TABLE "flight_gate" DROP CONSTRAINT "flight_gate_GateID_fkey";

-- DropForeignKey
ALTER TABLE "flight_passenger" DROP CONSTRAINT "flight_passenger_FlightID_fkey";

-- DropForeignKey
ALTER TABLE "flight_passenger" DROP CONSTRAINT "flight_passenger_PassengerID_fkey";

-- DropForeignKey
ALTER TABLE "gate" DROP CONSTRAINT "gate_AirportID_fkey";

-- DropForeignKey
ALTER TABLE "lostandfound" DROP CONSTRAINT "lostandfound_AirportID_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_AirportID_fkey";

-- DropForeignKey
ALTER TABLE "staff_role" DROP CONSTRAINT "staff_role_StaffID_fkey";

-- DropForeignKey
ALTER TABLE "works_for" DROP CONSTRAINT "works_for_AirportID_fkey";

-- DropForeignKey
ALTER TABLE "works_for" DROP CONSTRAINT "works_for_StaffID_fkey";

-- DropTable
DROP TABLE "airline";

-- DropTable
DROP TABLE "airport";

-- DropTable
DROP TABLE "airport_airline";

-- DropTable
DROP TABLE "baggage";

-- DropTable
DROP TABLE "flight";

-- DropTable
DROP TABLE "flight_gate";

-- DropTable
DROP TABLE "flight_passenger";

-- DropTable
DROP TABLE "gate";

-- DropTable
DROP TABLE "lostandfound";

-- DropTable
DROP TABLE "passenger";

-- DropTable
DROP TABLE "staff";

-- DropTable
DROP TABLE "staff_role";

-- DropTable
DROP TABLE "works_for";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" SERIAL NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "airlineName" TEXT NOT NULL,
    "airlineCode" TEXT NOT NULL,
    "fromAirport" "IndianAirport" NOT NULL,
    "toAirport" "IndianAirport" NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "basePriceINR" INTEGER NOT NULL,
    "gateNumber" TEXT,
    "delayMinutes" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ON_TIME',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seat" (
    "id" SERIAL NOT NULL,
    "flightId" INTEGER NOT NULL,
    "seatNumber" TEXT NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "flightId" INTEGER NOT NULL,
    "passengersCount" INTEGER NOT NULL,
    "isStudent" BOOLEAN NOT NULL DEFAULT false,
    "mealPreference" TEXT,
    "discountCredits" INTEGER NOT NULL DEFAULT 0,
    "extraBaggageKg" INTEGER NOT NULL DEFAULT 0,
    "baseFareINR" INTEGER NOT NULL,
    "taxesINR" INTEGER NOT NULL,
    "totalPriceINR" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingSeat" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "seatId" INTEGER NOT NULL,

    CONSTRAINT "BookingSeat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "Flight_fromAirport_toAirport_departureTime_idx" ON "Flight"("fromAirport", "toAirport", "departureTime");

-- CreateIndex
CREATE UNIQUE INDEX "Seat_flightId_seatNumber_key" ON "Seat"("flightId", "seatNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BookingSeat_seatId_key" ON "BookingSeat"("seatId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSeat" ADD CONSTRAINT "BookingSeat_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSeat" ADD CONSTRAINT "BookingSeat_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
